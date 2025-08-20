const express = require('express');
const cors = require('cors');
const { spawn, exec } = require('child_process');
const WebSocket = require('ws');
const fs = require('fs').promises;

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

console.log('WebSocket server started on port 3002');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connections: wss.clients.size,
    timestamp: new Date().toISOString()
  });
});

// Execute Claude CLI commands
app.post('/api/claude', async (req, res) => {
  const { message, sessionId } = req.body;
  
  try {
    // Use Claude CLI to process messages
    const claude = spawn('claude', ['chat', '--no-interactive'], {
      env: { ...process.env }
    });
    
    let output = '';
    let error = '';
    
    // Send message to Claude
    claude.stdin.write(message + '\n');
    claude.stdin.end();
    
    claude.stdout.on('data', (data) => {
      output += data.toString();
      // Stream to WebSocket if client is connected
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
    const bash = spawn('bash', ['-c', command]);
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
  const { path } = req.body;
  const fs = require('fs').promises;
  
  try {
    const content = await fs.readFile(path, 'utf-8');
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/file/write', async (req, res) => {
  const { path, content } = req.body;
  const fs = require('fs').promises;
  
  try {
    await fs.writeFile(path, content, 'utf-8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection from:', req.socket.remoteAddress);
  
  // Send immediate confirmation
  ws.send(JSON.stringify({ type: 'connected', timestamp: new Date() }));
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received message:', data.type);
      
      if (data.type === 'init') {
        ws.sessionId = data.sessionId;
        ws.send(JSON.stringify({ type: 'initialized', sessionId: data.sessionId }));
      } else if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
    }
  });
  
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
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
  console.log(`Claude Bridge Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:3002`);
});