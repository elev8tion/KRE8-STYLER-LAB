'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSettings, FiRefreshCw, FiCpu, FiZap, FiCode, FiGlobe, FiFile, FiTerminal, FiMessageSquare } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import HolographicLoader from '@/components/HolographicLoader';
import HolographicBackground from '@/components/HolographicBackground';
import dynamic from 'next/dynamic';

const ToolPanel = dynamic(() => import('@/components/ToolPanel'), { ssr: false });
const ClaudeTerminal = dynamic(() => import('@/components/ClaudeTerminal'), { ssr: false });

interface Model {
  name: string;
  id: string;
  size: string;
  description: string;
  speed: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: Date;
}

const MODELS: Model[] = [
  { name: 'Gemma 2B', id: 'gemma2:2b', size: '1.5GB', description: 'General chat, coding', speed: 3 },
  { name: 'Phi-3 Mini', id: 'phi3:mini', size: '2.3GB', description: 'Reasoning, math', speed: 2 },
  { name: 'Llama 3.2 3B', id: 'llama3.2:3b', size: '1.8GB', description: 'Versatile, quality', speed: 2 },
  { name: 'Qwen 2.5 7B', id: 'qwen2.5:7b', size: '4.7GB', description: 'Multilingual, coding', speed: 1 },
];

export default function OllamaChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<Record<string, boolean>>({});
  const [showSettings, setShowSettings] = useState(false);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showClaude, setShowClaude] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkModels();
    const interval = setInterval(updateMemoryUsage, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkModels = async () => {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      const data = await response.json();
      const available = data.models?.map((m: any) => m.name) || [];
      const status: Record<string, boolean> = {};
      MODELS.forEach(model => {
        status[model.id] = available.includes(model.id);
      });
      setModelStatus(status);
    } catch (error) {
      console.error('Failed to check models:', error);
    }
  };

  const updateMemoryUsage = () => {
    const used = Math.random() * 8 + 4;
    setMemoryUsage(used);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel.id,
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          stream: false,
        }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message?.content || 'No response',
        model: selectedModel.name,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: Unable to connect to Ollama. Please ensure Ollama is running on port 11434.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HolographicLoader />
      <div className="flex h-screen bg-gradient-to-br from-gray-950/50 via-gray-900/40 to-gray-950/50 relative z-10">
      {/* Left Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-80 bg-gray-900/40 border-r border-cyan-900/30 p-6 flex flex-col"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent font-orbitron tracking-wider">
            Ollama Chat
          </h1>
          <p className="text-gray-400 text-sm mt-1">Local LLM Workspace</p>
        </div>

        {/* Model Selector */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Active Model</label>
          <select
            value={selectedModel.id}
            onChange={(e) => setSelectedModel(MODELS.find(m => m.id === e.target.value) || MODELS[0])}
            className="w-full bg-gray-800/80 backdrop-blur-sm border border-cyan-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 shadow-lg shadow-cyan-900/20"
          >
            {MODELS.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.size})
              </option>
            ))}
          </select>
        </div>

        {/* Model Status */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Model Status</label>
          <div className="space-y-2">
            {MODELS.map(model => (
              <div key={model.id} className="flex items-center justify-between">
                <span className="text-sm">{model.name}</span>
                <div className={`w-2 h-2 rounded-full ${modelStatus[model.id] ? 'bg-green-400' : 'bg-gray-600'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Memory Usage */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Memory Usage</label>
          <div className="bg-gray-800/60 border border-cyan-700/30 rounded-lg p-3 shadow-lg shadow-cyan-900/20">
            <div className="flex justify-between text-sm mb-2">
              <span>RAM</span>
              <span>{memoryUsage.toFixed(1)} / 16 GB</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2 border border-cyan-800/30">
              <motion.div 
                className="bg-gradient-to-r from-cyan-500 to-magenta-500 h-2 rounded-full shadow-lg shadow-cyan-400/30"
                animate={{ width: `${(memoryUsage / 16) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Tools</label>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setActiveTool(activeTool === 'code' ? null : 'code')}
              className={`${activeTool === 'code' ? 'bg-cyan-600 shadow-lg shadow-cyan-900/50' : 'bg-gray-800/60 border border-cyan-700/30'} hover:bg-cyan-700/30 p-3 rounded-lg flex flex-col items-center transition-colors`}>
              <FiCode className="mb-1" />
              <span className="text-xs">Code Run</span>
            </button>
            <button 
              onClick={() => setActiveTool(activeTool === 'search' ? null : 'search')}
              className={`${activeTool === 'search' ? 'bg-cyan-600 shadow-lg shadow-cyan-900/50' : 'bg-gray-800/60 border border-cyan-700/30'} hover:bg-cyan-700/30 p-3 rounded-lg flex flex-col items-center transition-colors`}>
              <FiGlobe className="mb-1" />
              <span className="text-xs">Web Search</span>
            </button>
            <button 
              onClick={() => setActiveTool(activeTool === 'files' ? null : 'files')}
              className={`${activeTool === 'files' ? 'bg-cyan-600 shadow-lg shadow-cyan-900/50' : 'bg-gray-800/60 border border-cyan-700/30'} hover:bg-cyan-700/30 p-3 rounded-lg flex flex-col items-center transition-colors`}>
              <FiFile className="mb-1" />
              <span className="text-xs">Files</span>
            </button>
            <button 
              onClick={() => setActiveTool(activeTool === 'terminal' ? null : 'terminal')}
              className={`${activeTool === 'terminal' ? 'bg-cyan-600 shadow-lg shadow-cyan-900/50' : 'bg-gray-800/60 border border-cyan-700/30'} hover:bg-cyan-700/30 p-3 rounded-lg flex flex-col items-center transition-colors`}>
              <FiTerminal className="mb-1" />
              <span className="text-xs">Terminal</span>
            </button>
            <button 
              onClick={() => setShowClaude(!showClaude)}
              className={`${showClaude ? 'bg-cyan-600 shadow-lg shadow-cyan-900/50' : 'bg-gray-800/60 border border-cyan-700/30'} hover:bg-cyan-700/30 p-3 rounded-lg flex flex-col items-center transition-colors col-span-2`}>
              <FiMessageSquare className="mb-1 text-lg" />
              <span className="text-xs">Claude Terminal</span>
            </button>
          </div>
        </div>

        <div className="mt-auto">
          <button
            onClick={() => setMessages([])}
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-4 py-2 flex items-center justify-center transition-colors"
          >
            <FiRefreshCw className="mr-2" /> Clear Chat
          </button>
        </div>
      </motion.div>

      {/* Center Content Area */}
      <div className="flex-1 flex">
        {/* Center Area - Could be used for visualization or other content */}
        <div className="flex-1"></div>
        
        {/* Right Chat Panel */}
        <motion.div 
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          className="w-96 bg-gray-900/40 border-l border-cyan-900/30 flex flex-col"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-cyan-900/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <div className="text-sm font-medium text-cyan-400">{selectedModel.name}</div>
                <div className="text-xs text-gray-400">{'⚡'.repeat(selectedModel.speed)} Speed</div>
              </div>
            </div>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-cyan-900/30 rounded-lg transition-colors"
            >
              <FiSettings className="text-gray-400" />
            </button>
          </div>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-3xl rounded-2xl px-6 py-4 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-cyan-600/70 to-magenta-600/70 text-white border border-cyan-400/30 shadow-lg shadow-cyan-900/30' 
                    : 'bg-gray-800/60 border border-cyan-700/30 shadow-lg shadow-cyan-900/20'
                }`}>
                  {message.model && (
                    <div className="text-xs text-gray-400 mb-2">{message.model}</div>
                  )}
                  <ReactMarkdown
                    components={{
                      code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-800/60 border border-cyan-700/30 rounded-2xl px-6 py-4 shadow-lg shadow-cyan-900/20">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

            {/* Input */}
            <div className="border-t border-cyan-900/30 p-6 bg-gray-900/40">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800/60 border border-cyan-700/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 shadow-lg shadow-cyan-900/20"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-cyan-600 to-magenta-600 hover:from-cyan-700 hover:to-magenta-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 flex items-center transition-all shadow-lg shadow-cyan-900/30 border border-cyan-400/30"
                >
                  <FiSend />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Tool Panel */}
      {activeTool && activeTool !== 'claude' && (
        <ToolPanel 
          tool={activeTool} 
          onClose={() => setActiveTool(null)} 
        />
      )}
      
      {/* Claude Terminal Modal */}
      {showClaude && (
        <ClaudeTerminal onClose={() => setShowClaude(false)} />
      )}
    </>
  );
}