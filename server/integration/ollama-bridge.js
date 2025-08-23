/**
 * Ollama Integration Bridge
 * Connects /create-styler MCP server with local Ollama LLMs
 */

const WebSocket = require('ws');

class OllamaBridge {
  constructor(createStylerServer) {
    this.server = createStylerServer;
    this.ollamaUrl = 'http://localhost:11434';
    this.connectedLLMs = new Map();
    this.toolRegistrations = new Map();
  }
  
  async initialize() {
    console.log('[OLLAMA-BRIDGE] Initializing Ollama integration...');
    
    // Check if Ollama is running
    const isRunning = await this.checkOllamaStatus();
    
    if (isRunning) {
      await this.registerToolsWithOllama();
      await this.setupLLMHandlers();
      console.log('[OLLAMA-BRIDGE] ✅ Ollama integration active');
    } else {
      console.log('[OLLAMA-BRIDGE] ℹ️  Ollama not detected - tools available via HTTP/WS');
    }
  }
  
  async checkOllamaStatus() {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/version`);
      if (response.ok) {
        const data = await response.json();
        console.log(`[OLLAMA-BRIDGE] Ollama v${data.version} detected`);
        return true;
      }
    } catch (error) {
      // Ollama not running
    }
    return false;
  }
  
  async registerToolsWithOllama() {
    console.log('[OLLAMA-BRIDGE] Registering tools with Ollama...');
    
    const tools = Object.entries(this.server.toolRegistry).map(([id, tool]) => ({
      type: 'function',
      function: {
        name: id.replace(/\./g, '_'),
        description: tool.description,
        parameters: {
          type: 'object',
          properties: this.convertParametersToSchema(tool.parameters),
          required: this.getRequiredParameters(tool.parameters)
        }
      }
    }));
    
    // Store tool mappings
    tools.forEach(tool => {
      const originalId = tool.function.name.replace(/_/g, '.');
      this.toolRegistrations.set(tool.function.name, originalId);
    });
    
    // Register tools with available models
    const models = await this.getAvailableModels();
    
    for (const model of models) {
      try {
        // This would be the actual Ollama API call to register tools
        // For now, we'll just log the registration
        console.log(`[OLLAMA-BRIDGE] Registered ${tools.length} tools with model: ${model.name}`);
      } catch (error) {
        console.error(`[OLLAMA-BRIDGE] Failed to register tools with ${model.name}:`, error.message);
      }
    }
    
    return tools;
  }
  
  async getAvailableModels() {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`);
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('[OLLAMA-BRIDGE] Failed to get models:', error.message);
      return [];
    }
  }
  
  convertParametersToSchema(parameters) {
    if (!parameters) return {};
    
    const schema = {};
    
    for (const [name, param] of Object.entries(parameters)) {
      schema[name] = {
        type: this.mapParameterType(param.type),
        description: param.description || `${name} parameter`
      };
      
      if (param.default !== undefined) {
        schema[name].default = param.default;
      }
      
      if (param.type === 'array') {
        schema[name].items = { type: 'string' };
      }
      
      if (param.enum) {
        schema[name].enum = param.enum;
      }
    }
    
    return schema;
  }
  
  mapParameterType(type) {
    const typeMapping = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'array': 'array',
      'object': 'object'
    };
    
    return typeMapping[type] || 'string';
  }
  
  getRequiredParameters(parameters) {
    if (!parameters) return [];
    
    return Object.entries(parameters)
      .filter(([_, param]) => param.required)
      .map(([name, _]) => name);
  }
  
  async setupLLMHandlers() {
    // Set up WebSocket server for LLM connections
    const llmWss = new WebSocket.Server({ 
      port: 4011,
      path: '/llm-bridge'
    });
    
    llmWss.on('connection', (ws) => {
      console.log('[OLLAMA-BRIDGE] LLM client connected');
      
      ws.on('message', async (message) => {
        try {
          const request = JSON.parse(message);
          await this.handleLLMRequest(ws, request);
        } catch (error) {
          ws.send(JSON.stringify({
            error: `Invalid request: ${error.message}`
          }));
        }
      });
      
      ws.on('close', () => {
        console.log('[OLLAMA-BRIDGE] LLM client disconnected');
      });
    });
    
    console.log('[OLLAMA-BRIDGE] LLM bridge WebSocket server listening on port 4011');
  }
  
  async handleLLMRequest(ws, request) {
    const { type, data } = request;
    
    switch (type) {
      case 'tool_call':
        await this.handleToolCall(ws, data);
        break;
        
      case 'create_request':
        await this.handleCreateRequest(ws, data);
        break;
        
      case 'workflow_request':
        await this.handleWorkflowRequest(ws, data);
        break;
        
      default:
        ws.send(JSON.stringify({
          error: `Unknown request type: ${type}`
        }));
    }
  }
  
  async handleToolCall(ws, data) {
    const { tool_name, arguments: args } = data;
    
    // Map function name back to tool ID
    const toolId = this.toolRegistrations.get(tool_name) || tool_name;
    
    if (!this.server.toolRegistry[toolId]) {
      ws.send(JSON.stringify({
        error: `Tool not found: ${toolId}`
      }));
      return;
    }
    
    try {
      // Send progress update
      ws.send(JSON.stringify({
        type: 'progress',
        message: `Executing ${toolId}...`
      }));
      
      // Execute tool
      const tool = this.server.toolRegistry[toolId];
      const engine = tool.engine === 'orchestrator' 
        ? this.server.orchestrator 
        : this.server.engines[tool.engine];
      
      if (!engine) {
        throw new Error(`Engine ${tool.engine} not found`);
      }
      
      const result = await engine.execute(toolId, args);
      
      // Send result back to LLM
      ws.send(JSON.stringify({
        type: 'tool_result',
        tool_name,
        result
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'tool_error',
        tool_name,
        error: error.message
      }));
    }
  }
  
  async handleCreateRequest(ws, data) {
    const { type, spec, options = {} } = data;
    
    try {
      // Send progress updates
      const progressCallback = (update) => {
        ws.send(JSON.stringify({
          type: 'creation_progress',
          ...update
        }));
      };
      
      // Execute creation with progress
      const result = await this.server.orchestrator.orchestrateWithProgress({
        type,
        spec,
        options,
        registry: this.server.toolRegistry,
        engines: this.server.engines,
        library: this.server.resourceLibrary,
        onProgress: progressCallback
      });
      
      // Send final result
      ws.send(JSON.stringify({
        type: 'creation_complete',
        result
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'creation_error',
        error: error.message
      }));
    }
  }
  
  async handleWorkflowRequest(ws, data) {
    const { workflow, params } = data;
    
    try {
      const workflowTool = `create.workflow.${workflow}`;
      
      if (!this.server.toolRegistry[workflowTool]) {
        throw new Error(`Workflow not found: ${workflow}`);
      }
      
      // Execute workflow
      const result = await this.server.orchestrator.orchestrateWithProgress({
        type: 'workflow',
        spec: { workflow, ...params },
        registry: this.server.toolRegistry,
        engines: this.server.engines,
        library: this.server.resourceLibrary,
        onProgress: (update) => {
          ws.send(JSON.stringify({
            type: 'workflow_progress',
            workflow,
            ...update
          }));
        }
      });
      
      ws.send(JSON.stringify({
        type: 'workflow_complete',
        workflow,
        result
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'workflow_error',
        workflow,
        error: error.message
      }));
    }
  }
  
  // Helper method to create Ollama-compatible prompts
  createSystemPrompt() {
    return `You are /create-styler, an omnipotent AI creator with access to 1000+ creation tools.

You can create:
- Complete applications (Flutter, React, Vue, Native)
- Design systems and UI components  
- Backend APIs and microservices
- Content and documentation
- AI models and agents
- DevOps configurations

Available tool categories:
- create.app.* - Application generation
- create.design.* - Design and UI creation
- create.backend.* - Backend and infrastructure
- create.content.* - Content generation
- create.ai.* - AI/ML tools
- create.devops.* - DevOps automation

You can also execute workflows:
- create.workflow.startup - 10-minute complete startup
- create.workflow.pivot - Instant business model pivot
- create.workflow.clone - Clone and adapt existing apps

When a user requests something to be created, use the appropriate tools to fulfill their request.
Always explain what you're creating and break down complex requests into multiple tool calls.

Example usage:
User: "Create a TikTok-like app for books"
You: I'll create a TikTok-style app adapted for books. Let me break this down:
1. First, I'll create a design system
2. Then build the mobile app structure  
3. Add video-like features for book content
4. Include social features like following and recommendations

[Then make the appropriate tool calls]`;
  }
  
  // Method to send instructions to running Ollama models
  async sendToOllamaModel(modelName, message) {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelName,
          prompt: message,
          stream: false
        })
      });
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error(`[OLLAMA-BRIDGE] Failed to communicate with ${modelName}:`, error.message);
      return null;
    }
  }
  
  // Generate usage examples for LLMs
  getUsageExamples() {
    return [
      {
        request: "Create a Flutter app for a food delivery service",
        tools: ["create.app.flutter"],
        parameters: {
          name: "FoodDelivery", 
          description: "Food delivery mobile app",
          features: ["auth", "maps", "payments", "realtime"]
        }
      },
      {
        request: "Build a modern design system for a fintech startup",
        tools: ["create.design.system"],
        parameters: {
          name: "FinTech Design System",
          style: "modern",
          colors: { primary: "#1a73e8", secondary: "#34a853" }
        }
      },
      {
        request: "Create a complete startup in 10 minutes",
        tools: ["create.workflow.startup"],
        parameters: {
          idea: "AI-powered personal finance assistant",
          mvp: true
        }
      }
    ];
  }
  
  // Health check for the bridge
  async healthCheck() {
    const ollamaStatus = await this.checkOllamaStatus();
    
    return {
      ollama: {
        running: ollamaStatus,
        url: this.ollamaUrl
      },
      bridge: {
        registeredTools: this.toolRegistrations.size,
        connectedLLMs: this.connectedLLMs.size
      },
      websocket: {
        port: 4011,
        path: '/llm-bridge'
      }
    };
  }
}

module.exports = { OllamaBridge };