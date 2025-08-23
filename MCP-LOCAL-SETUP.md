# 🤖 MCP Tools for Local LLMs - Setup Guide

## ✨ The Magic: 100% Local, No Cloud Required!

**You do NOT need:**
- ❌ Claude API subscription
- ❌ OpenAI API key
- ❌ Any cloud service
- ❌ Internet connection (after setup)

**You DO have:**
- ✅ Full MCP tool access for local LLMs
- ✅ 15+ tools (files, system, web, AI, security)
- ✅ Complete privacy - everything runs locally
- ✅ No usage limits or API costs

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Ollama
```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model (one-time download)
ollama pull gemma2:2b
```

### Step 2: Start Services
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start MCP Gateway
cd /Users/cc/kre8-styler-lab/kre8-styler-lab
npm run mcp-gateway

# Terminal 3: Start Web Interface
npm run dev
```

### Step 3: Use It!
Open: http://localhost:3009/ollama-mcp

---

## 🔧 Available MCP Tools

### File Operations
- `file.read` - Read any file
- `file.write` - Write/create files
- `file.edit` - Edit existing files
- `file.list` - List directory contents

### System Operations
- `system.bash` - Execute bash commands
- `system.process_list` - List running processes

### Web Operations
- `web.search` - Search the web
- `web.fetch` - Fetch URL content

### AI/Development
- `ai.analyze_code` - Analyze code quality
- `ai.generate_tests` - Generate unit tests
- `flutter.create_app` - Create Flutter apps
- `security.scan_vulnerabilities` - Security scanning

### Voice Operations
- `voice.speak` - Text to speech
- `voice.transcribe` - Speech to text

---

## 💻 How to Use Tools in Chat

### Method 1: Direct Commands
Type in the chat:
```
use file.read path: /Users/cc/test.txt
use system.bash command: "ls -la"
use web.search query: "latest AI news"
```

### Method 2: Click from UI
1. Click the ⚡ tools button
2. Browse tools by category
3. Click a tool to insert it
4. Add parameters and send

### Method 3: API Calls
```bash
# List all tools
curl http://localhost:3008/tools

# Execute a tool
curl -X POST http://localhost:3008/tools/file.list/execute \
  -H "Content-Type: application/json" \
  -d '{"path": "/Users/cc"}'
```

---

## 🎯 Port Reference

| Service | Port | What It Does |
|---------|------|--------------|
| **3008** | HTTP | MCP Gateway API - Tool execution |
| **3010** | WebSocket | MCP Gateway WS - Real-time |
| **11434** | HTTP | Ollama - Local LLM server |
| **3009** | HTTP | Next.js - Web interface |

---

## 🔐 Default API Keys

For local development, these work out of the box:
- `local-ollama-key` (1000 requests/minute)
- `local-dev-key` (500 requests/minute)
- Session key (shown when starting gateway)

**No configuration needed!**

---

## 📝 Example Conversations

### File Management
```
You: use file.list path: /Users/cc/projects
Bot: [Lists all files in the directory]

You: use file.read path: /Users/cc/projects/README.md
Bot: [Shows file contents]

You: use file.write path: /Users/cc/notes.txt content: "My notes here"
Bot: File written successfully
```

### System Operations
```
You: use system.bash command: "date"
Bot: Wed Aug 23 2025 12:00:00

You: use system.process_list
Bot: [Shows running processes]
```

### Development
```
You: use ai.analyze_code code: "function add(a,b) { return a+b }"
Bot: Code quality: good. Suggestions: Add type checking, documentation

You: use flutter.create_app name: "MyApp" description: "Test app"
Bot: Flutter app 'MyApp' created at /projects/MyApp
```

---

## 🛠️ Advanced Configuration

### Custom Models
```bash
# Add more models
ollama pull phi3:mini
ollama pull llama3.2:3b
ollama pull qwen2.5:7b
```

### Environment Variables (Optional)
Create `.env.local`:
```env
# All local - no cloud services
OLLAMA_HOST=http://localhost:11434
MCP_GATEWAY_PORT=3008
MCP_GATEWAY_RATE_LIMIT=200
```

### Custom Tools
Add to `server/mcp-gateway.js`:
```javascript
toolRegistry['custom.tool'] = {
  description: 'My custom tool',
  parameters: { /* ... */ },
  category: 'custom'
};

toolHandlers['custom.tool'] = async (params) => {
  // Your implementation
  return { success: true, result: 'Done!' };
};
```

---

## 🚨 Troubleshooting

### "Cannot connect to Ollama"
```bash
# Make sure Ollama is running
ollama serve

# Test connection
curl http://localhost:11434/api/version
```

### "MCP Gateway not found"
```bash
# Start the gateway
npm run mcp-gateway

# Should see:
# 📔 Session API Key: mcp_xxxxx
# ✅ MCP Gateway ready for local LLMs
```

### "Tools not showing"
```bash
# Test gateway directly
curl http://localhost:3008/tools

# Should return JSON with 15+ tools
```

### Port conflicts
```bash
# Find what's using a port
lsof -i :3008

# Kill it if needed
kill -9 <PID>
```

---

## 🎉 That's It!

You now have:
- Local LLMs with full MCP tool access
- No cloud dependencies
- No API costs
- Complete privacy
- Unlimited usage

Just remember:
1. `ollama serve` - Start LLM server
2. `npm run mcp-gateway` - Start tool bridge
3. `npm run dev` - Start web UI

Enjoy your fully local AI assistant with superpowers! 🚀

---

## 📚 Further Reading

- [Ollama Documentation](https://ollama.com/docs)
- [MCP Tool Development](./server/mcp-gateway.js)
- [Port Configuration](./PORT-CONFIG.md)
- [Full Port Reference](./PORTS-AND-SERVICES.md)

---

*Created: 2025-08-23*
*100% Local - No Cloud Required!*