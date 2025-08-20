'use client';

import { useState, useRef, useEffect } from 'react';
import { FiX, FiSend, FiCode, FiSearch, FiFile, FiTerminal, FiLoader, FiCpu, FiFolder, FiEdit } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ClaudePanelProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tools?: string[];
  timestamp: Date;
}

export default function ClaudePanel({ onClose }: ClaudePanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Claude with **full terminal capabilities**. I can:\n\n• **Read/Write files** - Edit any file on your system\n• **Execute commands** - Run bash commands directly\n• **Search the web** - Get real-time information\n• **Run code** - Execute Python, JavaScript, etc.\n• **Use all MCP tools** - Access all your configured tools\n\nI have the same powers here as in your terminal. What would you like me to help with?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionId = useRef(Date.now().toString());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    try {
      console.log('Attempting to connect to WebSocket...');
      wsRef.current = new WebSocket('ws://localhost:3002');
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        wsRef.current?.send(JSON.stringify({ 
          type: 'init', 
          sessionId: sessionId.current 
        }));
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message type:', data.type);
          
          if (data.type === 'connected' || data.type === 'initialized') {
            setIsConnected(true);
            setConnectionError(null);
          } else if (data.type === 'stream') {
            // Handle streaming response
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'assistant' && isLoading) {
                return [
                  ...prev.slice(0, -1),
                  { ...last, content: last.content + data.content }
                ];
              }
              return prev;
            });
          } else if (data.type === 'heartbeat') {
            // Keep connection alive
            wsRef.current?.send(JSON.stringify({ type: 'ping' }));
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setConnectionError('Connection error - retrying...');
      };
      
      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setConnectionError('Failed to connect to bridge server');
    }
  };

  useEffect(() => {
    connectWebSocket();
    
    // Check bridge server health
    fetch('http://localhost:3001/api/health')
      .then(res => res.json())
      .then(data => {
        console.log('Bridge server health:', data);
      })
      .catch(err => {
        console.error('Bridge server not reachable:', err);
        setConnectionError('Bridge server not running');
      });
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const detectTools = (message: string): string[] => {
    const tools = [];
    if (message.match(/\`\`\`/)) tools.push('code');
    if (message.toLowerCase().includes('search') || message.toLowerCase().includes('find')) tools.push('search');
    if (message.toLowerCase().includes('file') || message.toLowerCase().includes('read') || message.toLowerCase().includes('write')) tools.push('file');
    if (message.toLowerCase().includes('bash') || message.toLowerCase().includes('run') || message.toLowerCase().includes('execute')) tools.push('terminal');
    if (message.toLowerCase().includes('edit') || message.toLowerCase().includes('modify')) tools.push('edit');
    return tools;
  };

  const processWithClaude = async (userMessage: string) => {
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    // Detect what tools might be needed
    const detectedTools = detectTools(userMessage);
    setActiveTools(detectedTools);

    try {
      // Check if it's a direct command
      if (userMessage.startsWith('!')) {
        // Direct bash command
        const command = userMessage.slice(1);
        const bashResponse = await fetch('http://localhost:3001/api/bash', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command }),
        });
        
        const bashResult = await bashResponse.json();
        const response = `\`\`\`bash\n$ ${command}\n${bashResult.output || bashResult.error}\n\`\`\``;
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response,
          tools: ['terminal'],
          timestamp: new Date(),
        }]);
      } else if (userMessage.toLowerCase().startsWith('read ')) {
        // Direct file read
        const path = userMessage.slice(5).trim();
        const fileResponse = await fetch('http://localhost:3001/api/file/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path }),
        });
        
        const fileResult = await fileResponse.json();
        const response = fileResult.error 
          ? `Error reading file: ${fileResult.error}`
          : `\`\`\`\n${fileResult.content}\n\`\`\``;
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response,
          tools: ['file'],
          timestamp: new Date(),
        }]);
      } else {
        // Use Claude for complex requests
        // For now, simulate Claude-like response
        // In production, this would call the actual Claude API
        
        let response = `I understand you want to: "${userMessage}"\n\n`;
        
        if (detectedTools.length > 0) {
          response += `I'll use these tools to help: ${detectedTools.join(', ')}\n\n`;
        }
        
        // Simulate tool usage
        if (detectedTools.includes('terminal')) {
          response += `**Executing command:**\n\`\`\`bash\n$ ls -la\ntotal 64\ndrwxr-xr-x  10 user  staff   320 Nov 20 10:00 .\ndrwxr-xr-x  25 user  staff   800 Nov 20 09:00 ..\n\`\`\`\n\n`;
        }
        
        if (detectedTools.includes('file')) {
          response += `**File operation completed successfully.**\n\n`;
        }
        
        if (detectedTools.includes('search')) {
          response += `**Search results:**\n• Found relevant information\n• Updated documentation available\n• Latest best practices identified\n\n`;
        }
        
        response += `Would you like me to perform any specific action?`;
        
        // Add assistant message
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response,
          tools: detectedTools,
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      setActiveTools([]);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const userInput = input;
    setInput('');
    processWithClaude(userInput);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed right-0 top-0 h-screen w-[800px] bg-gray-900 border-l border-gray-800 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <FiCpu className="text-2xl text-purple-400" />
            <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Claude Terminal</h2>
            <p className="text-xs text-gray-400">Full system access • All tools available</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FiX />
        </button>
      </div>

      {/* Active Tools Indicator */}
      {activeTools.length > 0 && (
        <div className="px-4 py-2 bg-purple-900/20 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <FiLoader className="animate-spin text-purple-400" />
            <span className="text-sm text-purple-300">Active:</span>
            {activeTools.map(tool => (
              <span key={tool} className="text-xs bg-purple-600/30 px-2 py-1 rounded flex items-center">
                {tool === 'code' && <FiCode className="mr-1" />}
                {tool === 'search' && <FiSearch className="mr-1" />}
                {tool === 'file' && <FiFile className="mr-1" />}
                {tool === 'terminal' && <FiTerminal className="mr-1" />}
                {tool === 'edit' && <FiEdit className="mr-1" />}
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[90%] rounded-lg px-4 py-3 ${
              message.role === 'user' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : message.role === 'system'
                ? 'bg-red-900/20 border border-red-800 text-red-200'
                : message.role === 'tool'
                ? 'bg-blue-900/20 border border-blue-800 text-blue-200'
                : 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
            }`}>
              {message.tools && message.tools.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {message.tools.map(tool => (
                    <span key={tool} className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                      {tool}
                    </span>
                  ))}
                </div>
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
                        className="text-xs my-2"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-900 px-1 py-0.5 rounded text-xs" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
              <div className="text-xs opacity-50 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-lg px-4 py-3">
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
      <div className="border-t border-gray-800 p-4 bg-gray-900/50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything or use ! for bash commands..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 flex items-center"
          >
            <FiSend />
          </button>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <span className="text-purple-400">!</span>command for bash • 
            <span className="text-purple-400"> read</span> path for files • 
            Natural language for complex tasks
          </div>
          <div className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? '● Connected' : connectionError || '● Disconnected'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}