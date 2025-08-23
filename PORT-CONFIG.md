# KRE8-Styler Lab Port Configuration

## 🚀 Complete Port Allocation

### Main Application
- **3009** - Next.js Development Server (PRIMARY)
- **8080** - Open WebUI Docker Container

### MCP Gateway Services (NEW - Local LLM Integration)
- **3008** - MCP Gateway HTTP API
- **3010** - MCP Gateway WebSocket

### Claude Bridge Services
- **3006** - Claude MCP Bridge HTTP
- **3007** - Claude MCP Bridge WebSocket
- **3002** - Legacy Claude Bridge

### Local LLM Services
- **11434** - Ollama API Server

## 📍 Dedicated Ports Summary

| Service | Port | Protocol | Purpose |
|---------|------|----------|---------|
| Next.js App | 3009 | HTTP | Main web application |
| MCP Gateway API | 3008 | HTTP | Local LLM tool access |
| MCP Gateway WS | 3010 | WebSocket | Real-time tool execution |
| Claude Bridge | 3006 | HTTP | Claude integration |
| Claude Bridge WS | 3007 | WebSocket | Claude streaming |
| Ollama | 11434 | HTTP | Local LLM API |
| Open WebUI | 8080 | HTTP | Docker Ollama interface |

## 🔐 100% LOCAL OPERATION
**NO CLOUD CONNECTION REQUIRED!**
- MCP Gateway bridges local LLMs to MCP tools
- All tools execute locally on your machine
- No API keys needed for basic operation
- No internet required after model downloads

## 🚦 Quick Start (Local LLMs + MCP)

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start MCP Gateway
npm run mcp-gateway

# Terminal 3: Start Next.js App
npm run dev

# Access at:
http://localhost:3009/ollama-mcp
```

## 📡 Service Commands

```bash
# Start individual services
npm run dev           # Next.js on :3009
npm run mcp-gateway   # MCP Gateway on :3008/:3010
npm run mcp-bridge    # Claude Bridge on :3006/:3007
ollama serve          # Ollama on :11434

# Check if ports are in use
lsof -i :3009  # Next.js
lsof -i :3008  # MCP Gateway
lsof -i :11434 # Ollama
```

## 🔍 Test Endpoints

```bash
# Test MCP Gateway
curl http://localhost:3008/tools

# Test Ollama
curl http://localhost:11434/api/version

# Test Next.js
curl http://localhost:3009
```

## ⚙️ Configuration Files

1. **package.json** - Scripts configured with port flags
2. **.env.local** - Environment variables (optional)
3. **server/mcp-gateway.js** - Port 3008/3010 hardcoded
4. **server/claude-mcp-bridge.js** - Port 3006/3007 hardcoded

## 🛡️ Security Notes

- All services bound to localhost by default
- Not accessible from network without configuration
- Default API keys provided for local development
- Rate limiting enabled (100 req/min default)

## 🚨 Port Conflicts

If a port is already in use:

```bash
# Find process using port
lsof -i :PORT_NUMBER

# Kill process
kill -9 PID

# Or force kill by port
lsof -i :3008 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---
*Last Updated: 2025-08-23*
*All ports are dedicated and hardcoded for consistency*
*MCP Gateway enables 100% local operation - no cloud needed!*