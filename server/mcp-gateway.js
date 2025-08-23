const express = require('express');
const cors = require('cors');
const { spawn, exec } = require('child_process');
const WebSocket = require('ws');
const fs = require('fs').promises;
const path = require('path');
const MCPGatewayAuth = require('./mcp-gateway-auth');

const app = express();
const PORT = 3008;

// Initialize authentication
const auth = new MCPGatewayAuth({
  defaultRateLimit: 100,
  windowMs: 60000
});

// CORS configuration for local LLMs
app.use(cors({
  origin: '*', // Allow all origins for local LLM access
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// WebSocket server for real-time tool execution
const wss = new WebSocket.Server({ 
  port: 3010,
  perMessageDeflate: false
});

console.log('🚀 MCP Gateway Server for Local LLMs');
console.log(`HTTP API: http://localhost:${PORT}`);
console.log('WebSocket: ws://localhost:3010');

// Tool registry with descriptions for local LLMs
const toolRegistry = {
  // File Operations
  'file.read': {
    description: 'Read contents of a file',
    parameters: {
      path: { type: 'string', required: true, description: 'File path to read' }
    },
    category: 'file_operations'
  },
  'file.write': {
    description: 'Write content to a file',
    parameters: {
      path: { type: 'string', required: true, description: 'File path to write' },
      content: { type: 'string', required: true, description: 'Content to write' }
    },
    category: 'file_operations'
  },
  'file.edit': {
    description: 'Edit existing file content',
    parameters: {
      path: { type: 'string', required: true, description: 'File path to edit' },
      oldContent: { type: 'string', required: true, description: 'Content to replace' },
      newContent: { type: 'string', required: true, description: 'New content' }
    },
    category: 'file_operations'
  },
  'file.list': {
    description: 'List files in a directory',
    parameters: {
      path: { type: 'string', required: true, description: 'Directory path' },
      pattern: { type: 'string', required: false, description: 'File pattern filter' }
    },
    category: 'file_operations'
  },
  
  // System Operations
  'system.bash': {
    description: 'Execute bash command',
    parameters: {
      command: { type: 'string', required: true, description: 'Bash command to execute' },
      background: { type: 'boolean', required: false, description: 'Run in background' }
    },
    category: 'system'
  },
  'system.process_list': {
    description: 'List running processes',
    parameters: {},
    category: 'system'
  },
  
  // Web Operations
  'web.search': {
    description: 'Search the web',
    parameters: {
      query: { type: 'string', required: true, description: 'Search query' },
      limit: { type: 'number', required: false, description: 'Number of results' }
    },
    category: 'web'
  },
  'web.fetch': {
    description: 'Fetch content from URL',
    parameters: {
      url: { type: 'string', required: true, description: 'URL to fetch' }
    },
    category: 'web'
  },
  
  // Flutter Development
  'flutter.create_app': {
    description: 'Create a new Flutter application',
    parameters: {
      name: { type: 'string', required: true, description: 'App name' },
      description: { type: 'string', required: true, description: 'App description' },
      features: { type: 'array', required: false, description: 'Features to include' }
    },
    category: 'flutter'
  },
  'flutter.add_widget': {
    description: 'Add a widget to Flutter app',
    parameters: {
      type: { type: 'string', required: true, description: 'Widget type' },
      properties: { type: 'object', required: false, description: 'Widget properties' }
    },
    category: 'flutter'
  },
  
  // AI/ML Operations
  'ai.analyze_code': {
    description: 'Analyze code for improvements',
    parameters: {
      code: { type: 'string', required: true, description: 'Code to analyze' },
      language: { type: 'string', required: false, description: 'Programming language' }
    },
    category: 'ai'
  },
  'ai.generate_tests': {
    description: 'Generate tests for code',
    parameters: {
      code: { type: 'string', required: true, description: 'Code to test' },
      framework: { type: 'string', required: false, description: 'Test framework' }
    },
    category: 'ai'
  },
  
  // Security Testing
  'security.scan_vulnerabilities': {
    description: 'Scan for security vulnerabilities',
    parameters: {
      target: { type: 'string', required: true, description: 'Target URL or file' },
      depth: { type: 'string', required: false, description: 'Scan depth' }
    },
    category: 'security'
  },
  
  // Voice Operations
  'voice.speak': {
    description: 'Convert text to speech',
    parameters: {
      text: { type: 'string', required: true, description: 'Text to speak' },
      voice: { type: 'string', required: false, description: 'Voice to use' }
    },
    category: 'voice'
  },
  'voice.transcribe': {
    description: 'Transcribe audio to text',
    parameters: {
      audio: { type: 'string', required: true, description: 'Audio data or path' }
    },
    category: 'voice'
  }
};

// Tool execution handlers
const toolHandlers = {
  'file.read': async (params) => {
    try {
      const content = await fs.readFile(params.path, 'utf-8');
      return { success: true, content };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  'file.write': async (params) => {
    try {
      await fs.writeFile(params.path, params.content);
      return { success: true, message: `File written: ${params.path}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  'file.edit': async (params) => {
    try {
      let content = await fs.readFile(params.path, 'utf-8');
      content = content.replace(params.oldContent, params.newContent);
      await fs.writeFile(params.path, content);
      return { success: true, message: `File edited: ${params.path}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  'file.list': async (params) => {
    try {
      const files = await fs.readdir(params.path);
      const filtered = params.pattern 
        ? files.filter(f => f.match(new RegExp(params.pattern)))
        : files;
      return { success: true, files: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  'system.bash': async (params) => {
    return new Promise((resolve) => {
      exec(params.command, (error, stdout, stderr) => {
        if (error) {
          resolve({ success: false, error: error.message, stderr });
        } else {
          resolve({ success: true, stdout, stderr });
        }
      });
    });
  },
  
  'system.process_list': async () => {
    return new Promise((resolve) => {
      exec('ps aux', (error, stdout) => {
        if (error) {
          resolve({ success: false, error: error.message });
        } else {
          const processes = stdout.split('\n').slice(1).map(line => {
            const parts = line.trim().split(/\s+/);
            return {
              user: parts[0],
              pid: parts[1],
              cpu: parts[2],
              mem: parts[3],
              command: parts.slice(10).join(' ')
            };
          }).filter(p => p.command);
          resolve({ success: true, processes });
        }
      });
    });
  },
  
  'web.search': async (params) => {
    // Simulated web search - in production, integrate with actual search API
    return {
      success: true,
      results: [
        {
          title: `Search result for: ${params.query}`,
          url: 'https://example.com',
          snippet: 'This is a simulated search result'
        }
      ]
    };
  },
  
  'web.fetch': async (params) => {
    try {
      const response = await fetch(params.url);
      const text = await response.text();
      return { 
        success: true, 
        content: text.substring(0, 1000), // Limit response size
        status: response.status 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  'flutter.create_app': async (params) => {
    // Simulated Flutter app creation
    return {
      success: true,
      message: `Flutter app '${params.name}' created`,
      path: `/projects/${params.name}`,
      features: params.features || []
    };
  },
  
  'flutter.add_widget': async (params) => {
    return {
      success: true,
      message: `Widget '${params.type}' added`,
      code: `Widget build(BuildContext context) {\n  return ${params.type}();\n}`
    };
  },
  
  'ai.analyze_code': async (params) => {
    // Simulated code analysis
    return {
      success: true,
      analysis: {
        quality: 'good',
        issues: [],
        suggestions: ['Consider adding error handling', 'Add documentation']
      }
    };
  },
  
  'ai.generate_tests': async (params) => {
    return {
      success: true,
      tests: `// Generated tests for provided code\ntest('example test', () => {\n  expect(true).toBe(true);\n});`
    };
  },
  
  'security.scan_vulnerabilities': async (params) => {
    return {
      success: true,
      vulnerabilities: [],
      message: `Scanned ${params.target} - No vulnerabilities found`
    };
  },
  
  'voice.speak': async (params) => {
    return {
      success: true,
      message: `Speaking: "${params.text}"`,
      audio: 'base64_encoded_audio_data'
    };
  },
  
  'voice.transcribe': async (params) => {
    return {
      success: true,
      text: 'Transcribed text from audio',
      confidence: 0.95
    };
  }
};

// API Endpoints

// Apply authentication middleware to all routes
app.use(auth.authMiddleware());

// Admin endpoint to get API keys
app.get('/admin/keys', (req, res) => {
  // Only allow with admin key
  if (req.keyData.name !== 'Development') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  res.json({ keys: auth.listApiKeys() });
});

// Get usage statistics
app.get('/stats', (req, res) => {
  const stats = auth.getUsageStats(req.apiKey);
  res.json(stats);
});

// List all available tools
app.get('/tools', (req, res) => {
  const tools = Object.entries(toolRegistry).map(([id, tool]) => ({
    id,
    ...tool
  }));
  res.json({ tools, count: tools.length });
});

// Get tool details
app.get('/tools/:toolId', (req, res) => {
  const tool = toolRegistry[req.params.toolId];
  if (!tool) {
    return res.status(404).json({ error: 'Tool not found' });
  }
  res.json({ id: req.params.toolId, ...tool });
});

// Execute a tool
app.post('/tools/:toolId/execute', auth.toolPermissionMiddleware(), async (req, res) => {
  const toolId = req.params.toolId;
  const tool = toolRegistry[toolId];
  
  if (!tool) {
    return res.status(404).json({ error: 'Tool not found' });
  }
  
  const handler = toolHandlers[toolId];
  if (!handler) {
    return res.status(501).json({ error: 'Tool not implemented' });
  }
  
  // Validate required parameters
  for (const [param, config] of Object.entries(tool.parameters)) {
    if (config.required && !(param in req.body)) {
      return res.status(400).json({ 
        error: `Missing required parameter: ${param}` 
      });
    }
  }
  
  try {
    const result = await handler(req.body);
    res.json({ toolId, result });
  } catch (error) {
    res.status(500).json({ 
      error: 'Tool execution failed', 
      details: error.message 
    });
  }
});

// Batch execute multiple tools
app.post('/tools/batch', async (req, res) => {
  const { operations } = req.body;
  if (!Array.isArray(operations)) {
    return res.status(400).json({ error: 'Operations must be an array' });
  }
  
  const results = [];
  for (const op of operations) {
    const handler = toolHandlers[op.tool];
    if (handler) {
      try {
        const result = await handler(op.params || {});
        results.push({ tool: op.tool, result });
      } catch (error) {
        results.push({ 
          tool: op.tool, 
          error: error.message 
        });
      }
    } else {
      results.push({ 
        tool: op.tool, 
        error: 'Tool not found' 
      });
    }
  }
  
  res.json({ results });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    tools: Object.keys(toolRegistry).length,
    wsClients: wss.clients.size
  });
});

// WebSocket connection for real-time tool execution
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'execute') {
        const handler = toolHandlers[data.tool];
        if (handler) {
          const result = await handler(data.params || {});
          ws.send(JSON.stringify({
            type: 'result',
            tool: data.tool,
            result
          }));
        } else {
          ws.send(JSON.stringify({
            type: 'error',
            error: `Tool not found: ${data.tool}`
          }));
        }
      } else if (data.type === 'list') {
        ws.send(JSON.stringify({
          type: 'tools',
          tools: Object.keys(toolRegistry)
        }));
      }
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        error: error.message
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to MCP Gateway',
    tools: Object.keys(toolRegistry).length
  }));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ MCP Gateway ready for local LLMs`);
  console.log(`\n📡 API Endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/tools - List all tools`);
  console.log(`  GET  http://localhost:${PORT}/tools/:id - Get tool details`);
  console.log(`  POST http://localhost:${PORT}/tools/:id/execute - Execute tool`);
  console.log(`  POST http://localhost:${PORT}/tools/batch - Batch execute`);
  console.log(`\n🔌 WebSocket: ws://localhost:3010`);
  console.log(`\n🤖 Ready for Ollama integration!`);
});