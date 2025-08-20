const express = require('express');
const cors = require('cors');
const { spawn, exec, execSync } = require('child_process');
const WebSocket = require('ws');
const fs = require('fs').promises;
const path = require('path');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

const app = express();
const PORT = 3001;

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// WebSocket server for streaming responses
const wss = new WebSocket.Server({ 
  port: 3002,
  perMessageDeflate: false
});

console.log('Claude MCP Bridge Server starting...');
console.log('WebSocket server started on port 3002');

// Store active MCP clients
const mcpClients = new Map();

// Initialize MCP client for a session
async function initMCPClient(sessionId) {
  try {
    // Read MCP config from Claude settings
    const configPath = path.join(process.env.HOME, '.claude', 'claude_desktop_config.json');
    const configExists = await fs.access(configPath).then(() => true).catch(() => false);
    
    if (configExists) {
      const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
      console.log('Found MCP configuration');
      
      // Initialize MCP servers
      if (config.mcpServers) {
        for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
          console.log(`Initializing MCP server: ${serverName}`);
          // Store server config for later use
          mcpClients.set(`${sessionId}-${serverName}`, serverConfig);
        }
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error initializing MCP client:', err);
    return false;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connections: wss.clients.size,
    mcpConfigured: mcpClients.size > 0,
    timestamp: new Date().toISOString()
  });
});

// Execute Claude with full capabilities
app.post('/api/claude', async (req, res) => {
  const { message, sessionId, useTools = true } = req.body;
  
  try {
    // Initialize MCP if not already done
    if (!mcpClients.has(sessionId)) {
      await initMCPClient(sessionId);
    }
    
    // Use Claude CLI with MCP support
    const claudeArgs = ['chat', '--no-interactive'];
    
    // Add MCP flags if tools are enabled
    if (useTools) {
      claudeArgs.push('--allow-tools');
    }
    
    const claude = spawn('claude', claudeArgs, {
      env: { 
        ...process.env,
        CLAUDE_ALLOW_TOOLS: 'true'
      }
    });
    
    let output = '';
    let error = '';
    
    // Send message to Claude
    claude.stdin.write(message + '\n');
    claude.stdin.end();
    
    // Stream output to WebSocket
    claude.stdout.on('data', (data) => {
      output += data.toString();
      
      // Find connected WebSocket client
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.sessionId === sessionId) {
          client.send(JSON.stringify({ 
            type: 'stream', 
            content: data.toString() 
          }));
        }
      });
    });
    
    claude.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    claude.on('close', (code) => {
      if (code !== 0) {
        res.status(500).json({ error: error || 'Claude process failed' });
      } else {
        res.json({ response: output });
      }
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Execute bash commands (like Claude can)
app.post('/api/bash', async (req, res) => {
  const { command } = req.body;
  
  try {
    const bash = spawn('bash', ['-c', command], {
      env: process.env,
      cwd: process.cwd()
    });
    
    let output = '';
    let error = '';
    
    bash.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    bash.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    bash.on('close', (code) => {
      res.json({ 
        output, 
        error, 
        exitCode: code 
      });
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// File operations
app.post('/api/file/read', async (req, res) => {
  const { path: filePath } = req.body;
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/file/write', async (req, res) => {
  const { path: filePath, content } = req.body;
  
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List available MCP tools
app.get('/api/mcp/tools', async (req, res) => {
  try {
    // Use Claude CLI to list available tools
    const result = execSync('claude mcp list-tools', { encoding: 'utf-8' });
    const tools = result.split('\n').filter(line => line.trim());
    res.json({ tools });
  } catch (err) {
    res.json({ tools: [], error: 'Unable to list MCP tools' });
  }
});

// Execute MCP tool
app.post('/api/mcp/execute', async (req, res) => {
  const { tool, params, sessionId } = req.body;
  
  try {
    // Use Claude to execute the MCP tool
    const command = `claude mcp execute --tool "${tool}" --params '${JSON.stringify(params)}'`;
    
    exec(command, { encoding: 'utf-8' }, (error, stdout, stderr) => {
      if (error) {
        res.status(500).json({ error: stderr || error.message });
      } else {
        res.json({ result: stdout });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection from:', req.socket.remoteAddress);
  
  // Send immediate confirmation
  ws.send(JSON.stringify({ type: 'connected', timestamp: new Date() }));
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received message:', data.type);
      
      if (data.type === 'init') {
        ws.sessionId = data.sessionId;
        
        // Initialize MCP for this session
        const mcpReady = await initMCPClient(data.sessionId);
        
        ws.send(JSON.stringify({ 
          type: 'initialized', 
          sessionId: data.sessionId,
          mcpReady 
        }));
      } else if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      } else if (data.type === 'execute') {
        // Direct execution through WebSocket
        const { command, type: cmdType } = data;
        
        if (cmdType === 'bash') {
          exec(command, { encoding: 'utf-8' }, (error, stdout, stderr) => {
            ws.send(JSON.stringify({
              type: 'result',
              command,
              output: stdout,
              error: stderr || (error ? error.message : null)
            }));
          });
        }
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
      ws.send(JSON.stringify({ type: 'error', message: err.message }));
    }
  });
  
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
    // Clean up MCP clients for this session
    if (ws.sessionId) {
      for (const [key] of mcpClients) {
        if (key.startsWith(ws.sessionId)) {
          mcpClients.delete(key);
        }
      }
    }
  });
});

// Keep connections alive
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'heartbeat' }));
    }
  });
}, 30000);

app.listen(PORT, () => {
  console.log(`Claude MCP Bridge Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:3002`);
  console.log('Bridge ready for connections!');
});