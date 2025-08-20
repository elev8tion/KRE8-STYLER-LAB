# KRE8-Styler Lab 🚀

A premium local LLM workspace with integrated Claude Terminal for full system capabilities.

![KRE8-Styler Lab](https://img.shields.io/badge/version-1.0.0-purple)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)

## ✨ Features

### 🤖 Local LLM Integration
- **Ollama Support** - Run models like Gemma 2B, Phi-3, Llama 3.2, and Qwen locally
- **Model Switching** - Easy switching between different models
- **Memory Usage Tracking** - Real-time RAM monitoring
- **Beautiful Chat Interface** - Syntax highlighting, markdown support

### 🛠️ Integrated Tools
- **Code Runner** - Monaco Editor with Python execution
- **Web Search** - Integrated search capabilities
- **File Manager** - Browse and manage files
- **Terminal** - Built-in terminal emulator
- **Claude Terminal** - Full system access with Claude AI

### 🎨 Claude Terminal Features
- **Full System Access** - Execute any bash command
- **File Operations** - Read/write any file on your system
- **MCP Tools** - Access all configured Model Context Protocol tools
- **Natural Language** - Process complex requests with Claude
- **WebSocket Streaming** - Real-time response streaming
- **Beautiful UI** - Dark theme with purple/pink gradients

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Ollama installed locally
- Claude CLI (for Claude Terminal features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/elev8tion/KRE8-STYLER-LAB.git
cd KRE8-STYLER-LAB
```

2. Install dependencies:
```bash
npm install
```

3. Start Ollama (if using local models):
```bash
ollama serve
```

4. Pull models you want to use:
```bash
ollama pull gemma2:2b
ollama pull phi3:mini
ollama pull llama3.2:3b
```

5. Start the development server:
```bash
npm run dev
```

6. Start the Claude Bridge (for Claude Terminal):
```bash
npm run mcp-bridge
```

7. Open your browser:
```
http://localhost:3000
```

## 🎮 Usage

### Local LLM Chat
1. Select a model from the sidebar
2. Type your message and press Enter
3. Models will respond based on their capabilities

### Claude Terminal
1. Click "Claude Terminal" button in the sidebar
2. Use commands:
   - `!ls -la` - Execute bash commands
   - `read /path/to/file` - Read file contents
   - Natural language - Ask Claude anything

### Tools
- **Code Runner**: Write and execute Python code
- **Web Search**: Search the web for information
- **File Manager**: Browse your file system
- **Terminal**: Run terminal commands

## 🏗️ Architecture

```
kre8-styler-lab/
├── src/
│   ├── app/
│   │   └── page.tsx          # Main application
│   └── components/
│       ├── ToolPanel.tsx     # Tool panels
│       ├── ClaudePanel.tsx   # Original Claude panel
│       └── ClaudeTerminal.tsx # Enhanced Claude terminal
├── server/
│   ├── claude-bridge.js      # Basic bridge server
│   └── claude-mcp-bridge.js  # MCP-enhanced bridge
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for configuration:

```env
# Ollama Configuration (optional)
OLLAMA_HOST=http://localhost:11434

# Claude Configuration (if using API)
ANTHROPIC_API_KEY=your-api-key-here
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run bridge       # Start basic Claude bridge
npm run mcp-bridge   # Start MCP-enhanced bridge
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- UI powered by [Tailwind CSS](https://tailwindcss.com/) and [Framer Motion](https://www.framer.com/motion/)
- Local LLMs via [Ollama](https://ollama.ai/)
- Claude integration via [Anthropic](https://www.anthropic.com/)
- Code editing with [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## 🐛 Known Issues

- WebSocket connection may need refresh on first load
- Some MCP tools require additional configuration
- Ollama must be running for local model features

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with 💜 by KRE8**