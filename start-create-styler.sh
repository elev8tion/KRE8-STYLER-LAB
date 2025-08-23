#!/bin/bash

# /CREATE STYLER MCP SERVER - Startup Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          /CREATE STYLER MCP SERVER - STARTING             ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║                                                            ║"
echo "║  🚀 Transform every local LLM into an omnipotent creator  ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the /create-styler MCP server
echo "🚀 Starting /create-styler MCP server..."
node server/create-styler-mcp.js &

# Store the PID
CREATE_STYLER_PID=$!
echo "🔥 /create-styler MCP server started with PID: $CREATE_STYLER_PID"

# Optional: Start web interface
read -p "🌐 Start web interface? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 Starting web interface on port 3009..."
    npm run dev &
    WEB_PID=$!
    echo "✅ Web interface started with PID: $WEB_PID"
    echo "🔗 Open: http://localhost:3009/create-styler"
fi

# Keep script running and handle cleanup
cleanup() {
    echo ""
    echo "🛑 Shutting down /create-styler MCP server..."
    kill $CREATE_STYLER_PID 2>/dev/null
    if [ ! -z "$WEB_PID" ]; then
        kill $WEB_PID 2>/dev/null
    fi
    echo "✅ Shutdown complete"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo ""
echo "✅ /CREATE STYLER MCP SERVER IS READY"
echo ""
echo "📊 Server Status:"
echo "   • HTTP API:    http://localhost:4000"
echo "   • WebSocket:   ws://localhost:4001" 
echo "   • Admin:       http://localhost:4002"
echo "   • Metrics:     http://localhost:4003"
echo ""
echo "🛠️  Quick Tests:"
echo "   • curl http://localhost:4000/health"
echo "   • curl http://localhost:4000/tools"
echo ""
echo "🎯 Integration with Ollama:"
echo "   • Make sure Ollama is running: ollama serve"
echo "   • Tools are auto-registered with local LLMs"
echo ""
echo "Press Ctrl+C to stop the server"

# Wait for processes
wait