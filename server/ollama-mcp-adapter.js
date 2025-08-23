const axios = require('axios');
const WebSocket = require('ws');

/**
 * Ollama MCP Adapter
 * Enables Ollama models to use MCP tools through function calling
 */
class OllamaMCPAdapter {
  constructor(config = {}) {
    this.ollamaUrl = config.ollamaUrl || 'http://localhost:11434';
    this.mcpGatewayUrl = config.mcpGatewayUrl || 'http://localhost:3008';
    this.mcpWebSocketUrl = config.mcpWebSocketUrl || 'ws://localhost:3010';
    this.ws = null;
    this.tools = [];
    this.pendingRequests = new Map();
  }

  async initialize() {
    // Fetch available tools from MCP Gateway
    try {
      const response = await axios.get(`${this.mcpGatewayUrl}/tools`);
      this.tools = response.data.tools;
      console.log(`✅ Loaded ${this.tools.length} MCP tools`);
      
      // Connect to WebSocket for real-time execution
      this.connectWebSocket();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize MCP adapter:', error.message);
      return false;
    }
  }

  connectWebSocket() {
    this.ws = new WebSocket(this.mcpWebSocketUrl);
    
    this.ws.on('open', () => {
      console.log('🔌 Connected to MCP Gateway WebSocket');
    });
    
    this.ws.on('message', (data) => {
      const message = JSON.parse(data);
      if (message.type === 'result' && message.requestId) {
        const pending = this.pendingRequests.get(message.requestId);
        if (pending) {
          pending.resolve(message.result);
          this.pendingRequests.delete(message.requestId);
        }
      }
    });
    
    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  /**
   * Convert MCP tools to Ollama function calling format
   */
  getToolsForOllama() {
    return this.tools.map(tool => ({
      type: 'function',
      function: {
        name: tool.id,
        description: tool.description,
        parameters: {
          type: 'object',
          properties: Object.entries(tool.parameters).reduce((acc, [key, param]) => {
            acc[key] = {
              type: param.type,
              description: param.description
            };
            return acc;
          }, {}),
          required: Object.entries(tool.parameters)
            .filter(([_, param]) => param.required)
            .map(([key]) => key)
        }
      }
    }));
  }

  /**
   * Execute a tool through MCP Gateway
   */
  async executeTool(toolId, params) {
    try {
      const response = await axios.post(
        `${this.mcpGatewayUrl}/tools/${toolId}/execute`,
        params
      );
      return response.data.result;
    } catch (error) {
      console.error(`Failed to execute tool ${toolId}:`, error.message);
      return { error: error.message };
    }
  }

  /**
   * Process a chat message with tool support
   */
  async chat(model, messages, options = {}) {
    const tools = this.getToolsForOllama();
    
    // Prepare the request for Ollama
    const request = {
      model,
      messages,
      tools: tools.length > 0 ? tools : undefined,
      stream: options.stream || false,
      temperature: options.temperature || 0.7,
      ...options
    };

    try {
      const response = await axios.post(
        `${this.ollamaUrl}/api/chat`,
        request,
        { responseType: options.stream ? 'stream' : 'json' }
      );

      if (options.stream) {
        return this.handleStreamResponse(response.data);
      } else {
        return await this.handleResponse(response.data);
      }
    } catch (error) {
      console.error('Chat error:', error.message);
      throw error;
    }
  }

  /**
   * Handle non-streaming response with tool calls
   */
  async handleResponse(response) {
    // Check if the model wants to use tools
    if (response.message?.tool_calls) {
      const toolResults = [];
      
      for (const toolCall of response.message.tool_calls) {
        const result = await this.executeTool(
          toolCall.function.name,
          toolCall.function.arguments
        );
        
        toolResults.push({
          tool_call_id: toolCall.id,
          role: 'tool',
          name: toolCall.function.name,
          content: JSON.stringify(result)
        });
      }
      
      // Return tool results for the model to process
      return {
        message: response.message,
        tool_results: toolResults
      };
    }
    
    return response;
  }

  /**
   * Handle streaming response
   */
  async *handleStreamResponse(stream) {
    let buffer = '';
    
    for await (const chunk of stream) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            
            // Check for tool calls in stream
            if (data.message?.tool_calls) {
              // Execute tools and yield results
              for (const toolCall of data.message.tool_calls) {
                const result = await this.executeTool(
                  toolCall.function.name,
                  toolCall.function.arguments
                );
                
                yield {
                  type: 'tool_result',
                  tool: toolCall.function.name,
                  result
                };
              }
            } else {
              yield data;
            }
          } catch (error) {
            console.error('Failed to parse stream chunk:', error);
          }
        }
      }
    }
  }

  /**
   * Create a tool-aware prompt for models that don't support function calling
   */
  createToolPrompt(userMessage) {
    const toolList = this.tools.map(t => 
      `- ${t.id}: ${t.description}`
    ).join('\n');
    
    return `You have access to the following tools:

${toolList}

To use a tool, respond with:
TOOL: <tool_id>
PARAMS: <json_parameters>

User message: ${userMessage}`;
  }

  /**
   * Parse tool calls from text response (for models without function calling)
   */
  parseToolCalls(text) {
    const toolRegex = /TOOL:\s*([^\n]+)\nPARAMS:\s*({[^}]+})/g;
    const calls = [];
    let match;
    
    while ((match = toolRegex.exec(text)) !== null) {
      try {
        calls.push({
          tool: match[1].trim(),
          params: JSON.parse(match[2])
        });
      } catch (error) {
        console.error('Failed to parse tool call:', error);
      }
    }
    
    return calls;
  }
}

// Export for use in other modules
module.exports = OllamaMCPAdapter;

// Example usage
if (require.main === module) {
  (async () => {
    const adapter = new OllamaMCPAdapter();
    await adapter.initialize();
    
    // Example: Chat with Gemma 2B using MCP tools
    const messages = [
      {
        role: 'user',
        content: 'Read the file /Users/cc/test.txt'
      }
    ];
    
    try {
      const response = await adapter.chat('gemma2:2b', messages);
      console.log('Response:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  })();
}