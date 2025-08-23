'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Zap, Settings, RefreshCw, Activity, Terminal, FileCode, Globe, Shield, Mic } from 'lucide-react';

interface Tool {
  id: string;
  description: string;
  category: string;
  parameters: Record<string, any>;
}

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolCalls?: any[];
  toolResults?: any[];
  timestamp: Date;
}

const OllamaMCPChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemma2:2b');
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [mcpConnected, setMcpConnected] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const models = [
    { id: 'gemma2:2b', name: 'Gemma 2B', icon: '💎' },
    { id: 'phi3:mini', name: 'Phi-3 Mini', icon: '🧠' },
    { id: 'llama3.2:3b', name: 'Llama 3.2', icon: '🦙' },
    { id: 'qwen2.5:7b', name: 'Qwen 2.5', icon: '🌟' }
  ];

  const toolCategories = {
    file_operations: { name: 'Files', icon: FileCode, color: 'from-blue-500 to-cyan-500' },
    system: { name: 'System', icon: Terminal, color: 'from-green-500 to-emerald-500' },
    web: { name: 'Web', icon: Globe, color: 'from-purple-500 to-pink-500' },
    flutter: { name: 'Flutter', icon: Bot, color: 'from-orange-500 to-red-500' },
    ai: { name: 'AI/ML', icon: Zap, color: 'from-yellow-500 to-orange-500' },
    security: { name: 'Security', icon: Shield, color: 'from-red-500 to-pink-500' },
    voice: { name: 'Voice', icon: Mic, color: 'from-indigo-500 to-purple-500' }
  };

  useEffect(() => {
    loadMCPTools();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMCPTools = async () => {
    try {
      const response = await fetch('http://localhost:3008/tools');
      const data = await response.json();
      setTools(data.tools);
      setMcpConnected(true);
      console.log(`Loaded ${data.tools.length} MCP tools`);
    } catch (error) {
      console.error('Failed to load MCP tools:', error);
      setMcpConnected(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const executeTool = async (toolId: string, params: any) => {
    try {
      const response = await fetch(`http://localhost:3008/tools/${toolId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(`Failed to execute tool ${toolId}:`, error);
      return { error: error.message };
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Check if message contains tool request
      const toolMatch = input.match(/use (\w+\.\w+)(.*)/i);
      
      if (toolMatch && mcpConnected) {
        const toolId = toolMatch[1];
        const tool = tools.find(t => t.id === toolId);
        
        if (tool) {
          // Parse parameters from the message
          const paramsText = toolMatch[2].trim();
          let params = {};
          
          try {
            // Try to parse as JSON
            if (paramsText.startsWith('{')) {
              params = JSON.parse(paramsText);
            } else {
              // Simple parameter extraction
              const paramMatches = paramsText.matchAll(/(\w+):\s*([^,]+)/g);
              for (const match of paramMatches) {
                params[match[1]] = match[2].trim().replace(/["']/g, '');
              }
            }
          } catch (e) {
            console.error('Failed to parse parameters:', e);
          }

          // Execute the tool
          const result = await executeTool(toolId, params);
          
          const assistantMessage: Message = {
            role: 'assistant',
            content: `Executed ${toolId}:\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``,
            toolCalls: [{ tool: toolId, params, result }],
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          // Tool not found
          const assistantMessage: Message = {
            role: 'assistant',
            content: `Tool "${toolId}" not found. Available tools: ${tools.map(t => t.id).join(', ')}`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
        }
      } else {
        // Regular Ollama chat
        const response = await fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              {
                role: 'system',
                content: mcpConnected 
                  ? `You have access to MCP tools. Available tools: ${tools.map(t => `${t.id} (${t.description})`).join(', ')}. Users can say "use tool.name {params}" to execute tools.`
                  : 'You are a helpful AI assistant.'
              },
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: input }
            ],
            stream: false
          })
        });

        const data = await response.json();
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message.content,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderToolGrid = () => {
    const categorizedTools = tools.reduce((acc, tool) => {
      if (!acc[tool.category]) acc[tool.category] = [];
      acc[tool.category].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);

    return (
      <div className="space-y-4">
        {Object.entries(categorizedTools).map(([category, categoryTools]) => {
          const categoryInfo = toolCategories[category as keyof typeof toolCategories];
          if (!categoryInfo) return null;
          
          const Icon = categoryInfo.icon;
          
          return (
            <div key={category} className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 bg-gradient-to-br ${categoryInfo.color} rounded-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-300">{categoryInfo.name}</h3>
                <span className="text-xs text-gray-500">({categoryTools.length} tools)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categoryTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setInput(`use ${tool.id} `)}
                    className="text-left p-2 bg-gray-700/30 rounded hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="text-xs font-mono text-cyan-400">{tool.id}</div>
                    <div className="text-xs text-gray-400 truncate">{tool.description}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Ollama + MCP Tools</h2>
            {mcpConnected && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">MCP Connected</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.icon} {model.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setShowTools(!showTools)}
              className={`p-2 rounded-lg transition-colors ${
                showTools 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'bg-gray-800 text-gray-400 hover:text-cyan-400'
              }`}
            >
              <Zap className="w-4 h-4" />
            </button>
            
            <button
              onClick={loadMCPTools}
              className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-cyan-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Messages */}
        <div className={`flex-1 flex flex-col ${showTools ? 'w-2/3' : 'w-full'}`}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-700" />
                <p className="text-sm">Start chatting with {selectedModel}</p>
                {mcpConnected && (
                  <p className="text-xs mt-2 text-cyan-400">
                    {tools.length} MCP tools available - Type "use tool.name" to execute
                  </p>
                )}
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-800/50 text-gray-200'
                    }`}
                  >
                    {message.toolCalls && (
                      <div className="text-xs text-cyan-400 mb-2">
                        🔧 Tool Execution
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                placeholder={mcpConnected ? "Type a message or 'use tool.name' to execute MCP tools..." : "Type a message..."}
                className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tools Panel */}
        {showTools && (
          <div className="w-1/3 border-l border-gray-800 p-4 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">MCP Tools</h3>
              <p className="text-xs text-gray-400">
                Click a tool to insert it into your message
              </p>
            </div>
            {mcpConnected ? renderToolGrid() : (
              <div className="text-center text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">MCP Gateway not connected</p>
                <button
                  onClick={loadMCPTools}
                  className="mt-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                >
                  Connect
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OllamaMCPChat;