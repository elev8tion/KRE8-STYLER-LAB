'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiCpu, FiZap } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import HolographicLoader from '@/components/HolographicLoader';
import HolographicBackground from '@/components/HolographicBackground';
import AnimatedButton from '@/components/AnimatedButton';
import AnimatedInput from '@/components/AnimatedInput';
import CyberCard from '@/components/CyberCard';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ClaudeDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('CONNECTED');

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

    // TODO: Integrate with Claude API via MCP bridge
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'Claude integration is being configured. MCP bridge connection will be established.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <HolographicLoader />
      <div className="flex h-screen bg-gradient-to-br from-gray-950/50 via-gray-900/40 to-gray-950/50 relative z-10">
        
        {/* Left Panel - Status and Info */}
        <div className="w-80 bg-gray-900/40 border-r border-cyan-900/30 p-6 flex flex-col">
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent font-orbitron tracking-wider">
              Claude Assistant
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${connectionStatus === 'CONNECTED' ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-400">{connectionStatus}</span>
            </div>
          </div>

          {/* System Info */}
          <div className="flex flex-col gap-8 px-2">
            <div className="py-2">
              <CyberCard 
                title="MCP BRIDGE" 
                subtitle="ACTIVE"
                horizontal={true}
              >
                <div className="text-sm text-cyan-400" style={{ display: 'none' }}>Active</div>
              </CyberCard>
            </div>

            <div className="py-2">
              <CyberCard 
                title="API STATUS" 
                subtitle="READY"
                horizontal={true}
              >
                <div className="text-sm text-green-400" style={{ display: 'none' }}>Ready</div>
              </CyberCard>
            </div>
          </div>

          <div className="mt-auto">
            <div className="text-xs text-gray-500 text-center">
              Powered by Claude AI
            </div>
          </div>
        </div>

        {/* Center Content Area */}
        <div className="flex-1 flex">
          {/* Center Area */}
          <div className="flex-1"></div>
          
          {/* Right Chat Panel */}
          <div className="w-96 bg-gray-900/40 border-l border-cyan-900/30 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-cyan-900/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="text-sm font-medium text-cyan-400">Claude Assistant</div>
                  <div className="text-xs text-gray-400">MCP Bridge Connected</div>
                </div>
              </div>
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
                <div className="bg-gray-800/60 border border-cyan-700/30 rounded-2xl px-6 py-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

            {/* Input Area */}
            <div className="border-t border-cyan-900/30 p-6 bg-gray-900/40">
              <div className="flex space-x-4">
                <AnimatedInput
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask Claude anything..."
                  className="flex-1"
                />
                <AnimatedButton
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  variant="holographic"
                  size="small"
                >
                  <FiSend />
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}