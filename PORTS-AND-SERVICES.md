# 🚀 KRE8-STYLER LAB - PORTS AND SERVICES DOCUMENTATION

## 🌟 IMPORTANT: 100% LOCAL OPERATION
**NO CLOUD CONNECTION REQUIRED** for local LLMs to use MCP tools!
- All MCP tools run locally on your machine
- Ollama models run locally
- MCP Gateway bridges them together locally
- No API keys needed (except optional Claude for enhanced features)
- No internet required once models are downloaded

---

## 📊 PORT ALLOCATION MAP

```
┌─────────────────────────────────────────────────────────────┐
│                    KRE8-STYLER LAB SERVICES                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🌐 WEB SERVICES                                             │
│  ├── :3009  → Next.js Development Server (Main App)          │
│  ├── :8080  → Open WebUI (Docker - Ollama Interface)         │
│  └── :3000  → Reserved (Often default Next.js)               │
│                                                               │
│  🤖 AI/LLM SERVICES                                          │
│  ├── :11434 → Ollama API (Local LLM Server)                  │
│  ├── :3008  → MCP Gateway HTTP API (NEW)                     │
│  └── :3010  → MCP Gateway WebSocket (NEW)                    │
│                                                               │
│  🌉 BRIDGE SERVICES                                          │
│  ├── :3006  → Claude MCP Bridge HTTP                         │
│  ├── :3007  → Claude MCP Bridge WebSocket                    │
│  └── :3002  → Legacy Claude Bridge                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 SERVICE DETAILS

### 1️⃣ MCP Gateway for Local LLMs (NEW)
**Ports: 3008 (HTTP) / 3010 (WebSocket)**
```bash
# Start the gateway
npm run mcp-gateway

# What it provides:
- REST API for tool execution
- WebSocket for real-time operations
- Authentication & rate limiting
- 15+ MCP tools for local LLMs
```

**Endpoints:**
- `GET  http://localhost:3008/tools` - List all available tools
- `GET  http://localhost:3008/tools/:id` - Get tool details
- `POST http://localhost:3008/tools/:id/execute` - Execute a tool
- `POST http://localhost:3008/tools/batch` - Batch execute tools
- `GET  http://localhost:3008/stats` - Usage statistics
- `WS   ws://localhost:3010` - WebSocket connection

**Default API Keys (for local development):**
- `local-ollama-key` - For Ollama integration (1000 req/min)
- `local-dev-key` - For development (500 req/min)
- Session key generated on startup (shown in console)

---

### 2️⃣ Ollama Local LLM Server
**Port: 11434**
```bash
# Start Ollama
ollama serve

# Pull models
ollama pull gemma2:2b
ollama pull phi3:mini
ollama pull llama3.2:3b

# API endpoint
http://localhost:11434/api/chat
```

---

### 3️⃣ Next.js Development Server
**Port: 3009**
```bash
# Start the app
npm run dev

# Main pages:
http://localhost:3009/              # Landing page
http://localhost:3009/mcp-arsenal   # MCP servers showcase
http://localhost:3009/ollama-mcp    # Ollama + MCP tools interface
http://localhost:3009/ollama-chat   # Standard Ollama chat
```

---

### 4️⃣ Claude MCP Bridge (Optional)
**Ports: 3006 (HTTP) / 3007 (WebSocket)**
```bash
# Start if using Claude features
npm run mcp-bridge

# For Claude Desktop integration only
# NOT needed for local LLM operations
```

---

### 5️⃣ Open WebUI Docker Container
**Port: 8080**
```bash
# Start with Docker Compose
docker-compose up -d

# Access at:
http://localhost:8080
```

---

## 🚦 SERVICE STARTUP ORDER

For **LOCAL LLM + MCP Tools** (no cloud needed):
```bash
# 1. Start Ollama (if not running)
ollama serve

# 2. Start MCP Gateway
npm run mcp-gateway

# 3. Start Next.js app
npm run dev

# 4. Navigate to Ollama MCP interface
open http://localhost:3009/ollama-mcp
```

For **Full Stack** (all features):
```bash
# 1. Start all services
ollama serve                    # Terminal 1
npm run mcp-gateway            # Terminal 2
npm run mcp-bridge             # Terminal 3 (optional)
npm run dev                    # Terminal 4
docker-compose up -d           # Terminal 5 (optional)
```

---

## 🔍 PORT CONFLICT RESOLUTION

If you get "port already in use" errors:

```bash
# Check what's using a port (macOS/Linux)
lsof -i :3008    # Replace with your port

# Kill process using port
kill -9 <PID>

# Or find and kill by port
lsof -i :3008 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## 🛡️ SECURITY NOTES

### Local Development (Default)
- All services bound to `localhost` / `127.0.0.1`
- Not accessible from network by default
- Default API keys for convenience
- Rate limiting enabled (100 req/min)

### Production Deployment
- Change default API keys
- Configure proper CORS origins
- Use HTTPS for external access
- Implement proper authentication
- Review rate limits

---

## 📡 CONNECTIVITY DIAGRAM

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Ollama     │────▶│  MCP Gateway │────▶│  MCP Tools   │
│   (Local)    │     │  :3008/:3010 │     │   (Local)    │
│   :11434     │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
                            ▲
                            │
                     ┌──────────────┐
                     │   Next.js    │
                     │   Web UI     │
                     │    :3009     │
                     └──────────────┘
                     
NO INTERNET/CLOUD CONNECTION REQUIRED!
```

---

## ✅ QUICK VERIFICATION

Test if everything is working:

```bash
# 1. Check Ollama
curl http://localhost:11434/api/version

# 2. Check MCP Gateway
curl http://localhost:3008/tools

# 3. Test tool execution
curl -X POST http://localhost:3008/tools/file.list/execute \
  -H "Content-Type: application/json" \
  -d '{"path": "."}'

# 4. Check Next.js
curl http://localhost:3009
```

---

## 🔧 ENVIRONMENT VARIABLES

Optional configuration in `.env.local`:

```env
# Ollama (all local)
OLLAMA_HOST=http://localhost:11434

# MCP Gateway (all local)
MCP_GATEWAY_PORT=3008
MCP_GATEWAY_WS_PORT=3010
MCP_GATEWAY_RATE_LIMIT=100

# Next.js
NEXT_PUBLIC_MCP_GATEWAY=http://localhost:3008
```

---

## 📝 NOTES

- **MCP Gateway** is the bridge between local LLMs and MCP tools
- **No Claude account needed** for local LLM operations
- **No internet needed** after initial model downloads
- All MCP tools execute locally on your machine
- File operations are sandboxed to your local filesystem
- System commands run with your user permissions

---

## 🚨 TROUBLESHOOTING

### "Cannot connect to MCP Gateway"
```bash
# Ensure gateway is running
npm run mcp-gateway

# Check port is listening
netstat -an | grep 3008
```

### "Ollama not responding"
```bash
# Restart Ollama
ollama serve

# Check Ollama status
curl http://localhost:11434/api/version
```

### "Port already in use"
```bash
# Find and kill process
lsof -i :PORT_NUMBER
kill -9 PID
```

---

*Last Updated: 2025-08-23*
*All services run locally - no cloud dependencies for LLM+MCP integration!*