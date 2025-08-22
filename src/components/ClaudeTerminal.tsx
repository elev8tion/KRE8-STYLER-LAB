'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FiX, FiSend, FiTerminal, FiCpu, FiCommand, FiTool, FiActivity } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ClaudeTerminalProps {
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'command';
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
  processing?: boolean;
}

// Message ID generator to ensure unique keys
let messageIdCounter = 0;
const generateMessageId = () => {
  messageIdCounter++;
  return `msg-${Date.now()}-${messageIdCounter}-${Math.random().toString(36).substring(2, 9)}`;
};

export default function ClaudeTerminal({ onClose }: ClaudeTerminalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateMessageId(),
      role: 'assistant',
      content: `Welcome to **Claude Terminal** - I have full access to your system!

I can:
• **Execute bash commands** - Run any terminal command
• **Read/write files** - Access and modify any file
• **Use MCP tools** - All your configured tools are available
• **Web search** - Get real-time information
• **Code execution** - Run Python, JavaScript, etc.

Try:
- \`!ls\` for bash commands
- \`read /path/to/file\` to read files
- Or just ask me anything naturally!`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [availableTools, setAvailableTools] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionId = useRef(Date.now().toString());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    // Prevent multiple connections
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || 
        wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }
    
    try {
      console.log('Creating new WebSocket connection...');
      wsRef.current = new WebSocket('ws://localhost:3007');
      
      wsRef.current.onopen = () => {
        console.log('Connected to Claude Bridge');
        setConnectionStatus('connected');
        setConnectionError(null);
        wsRef.current?.send(JSON.stringify({ 
          type: 'init', 
          sessionId: sessionId.current 
        }));
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'initialized') {
            setConnectionStatus('connected');
            setConnectionError(null);
            // Fetch available tools when connected
            fetchAvailableTools();
          } else if (data.type === 'result') {
            // Handle command results
            const resultMessage: Message = {
              id: generateMessageId(),
              role: 'assistant',
              content: `\`\`\`bash\n${data.output || data.error || 'Command completed'}\n\`\`\``,
              timestamp: new Date(),
              toolsUsed: ['bash']
            };
            setMessages(prev => [...prev, resultMessage]);
          } else if (data.type === 'stream') {
            // Handle streaming response
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last && last.processing) {
                return [
                  ...prev.slice(0, -1),
                  { ...last, content: last.content + data.content, processing: false }
                ];
              }
              return prev;
            });
          }
        } catch (err) {
          console.error('WebSocket message error:', err);
        }
      };
      
      wsRef.current.onerror = (error) => {
        // Don't log as error, it's expected when server is starting
        console.log('WebSocket connection error - will retry');
        setConnectionStatus('error');
        setConnectionError('Connecting to bridge server...');
      };
      
      wsRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setConnectionStatus('connecting');
        setConnectionError(`Connection closed: ${event.reason || 'Unknown reason'}`);
        // Only reconnect if not manually closed
        if (event.code !== 1000 && event.code !== 1001) {
          wsRef.current = null;
          setTimeout(connectWebSocket, 3000);
        }
      };
    } catch (err) {
      console.error('Failed to connect:', err);
      setConnectionStatus('error');
    }
  }, []);

  // Fetch available MCP tools
  const fetchAvailableTools = async () => {
    try {
      const response = await fetch('http://localhost:3006/api/mcp/tools');
      const data = await response.json();
      if (data.tools) {
        setAvailableTools(data.tools);
      }
    } catch (err) {
      console.error('Failed to fetch tools:', err);
    }
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      wsRef.current?.close();
    };
  }, [connectWebSocket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const executeCommand = async (command: string) => {
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: command,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Check if it's a direct bash command
      if (command.startsWith('!')) {
        const bashCommand = command.slice(1);
        
        // Use WebSocket for real-time execution
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'execute',
            command: bashCommand,
            cmdType: 'bash'
          }));
        } else {
          // Fallback to HTTP
          const response = await fetch('http://localhost:3006/api/bash', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: bashCommand }),
          });
          
          const result = await response.json();
          const output = result.output || result.error || 'No output';
          
          const responseMessage: Message = {
            id: generateMessageId(),
            role: 'command',
            content: `\`\`\`bash\n$ ${bashCommand}\n${output}\n\`\`\``,
            timestamp: new Date(),
            toolsUsed: ['bash']
          };
          
          setMessages(prev => [...prev, responseMessage]);
        }
      } else if (command.toLowerCase().startsWith('read ')) {
        // File read command
        const filePath = command.slice(5).trim();
        const response = await fetch('http://localhost:3006/api/file/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: filePath }),
        });
        
        const result = await response.json();
        const content = result.error 
          ? `Error: ${result.error}`
          : `\`\`\`\n${result.content}\n\`\`\``;
        
        const responseMessage: Message = {
          id: generateMessageId(),
          role: 'assistant',
          content,
          timestamp: new Date(),
          toolsUsed: ['file']
        };
        
        setMessages(prev => [...prev, responseMessage]);
      } else {
        // Use Claude for natural language processing
        abortControllerRef.current = new AbortController();
        
        const processingMessage: Message = {
          id: generateMessageId(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          processing: true
        };
        
        setMessages(prev => [...prev, processingMessage]);
        
        const response = await fetch('http://localhost:3006/api/claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: command, 
            sessionId: sessionId.current,
            useTools: true
          }),
          signal: abortControllerRef.current.signal
        });
        
        if (!response.ok) throw new Error('Failed to process with Claude');
        
        const result = await response.json();
        
        // Update the processing message with the result
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.processing) {
            return [
              ...prev.slice(0, -1),
              { ...last, content: result.response || 'No response', processing: false }
            ];
          }
          return prev;
        });
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const errorMessage: Message = {
          id: generateMessageId(),
          role: 'system',
          content: `Error: ${err.message || 'Failed to process command'}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isProcessing) return;
    const command = input;
    setInput('');
    executeCommand(command);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="w-full max-w-6xl h-[80vh] bg-gray-950/90 backdrop-blur-md border border-cyan-900/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-900/30 bg-gradient-to-r from-cyan-950/40 to-magenta-950/40">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <FiCpu className="text-2xl text-purple-400" />
              <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' : 
                connectionStatus === 'error' ? 'bg-red-400 shadow-lg shadow-red-400/50' : 'bg-yellow-400 shadow-lg shadow-yellow-400/50'
              } animate-pulse`} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Claude Terminal</h2>
              <p className="text-xs text-gray-400">
                Full system access • {availableTools.length > 0 ? `${availableTools.length} tools available` : 'Loading tools...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Tools Bar */}
        {availableTools.length > 0 && (
          <div className="px-4 py-2 border-b border-cyan-900/30 bg-gray-900/50 backdrop-blur-md">
            <div className="flex items-center space-x-2 text-xs">
              <FiTool className="text-purple-400" />
              <span className="text-gray-400">Available:</span>
              <div className="flex flex-wrap gap-1">
                {availableTools.slice(0, 10).map((tool, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-cyan-900/30 text-cyan-300 rounded border border-cyan-700/20">
                    {tool}
                  </span>
                ))}
                {availableTools.length > 10 && (
                  <span className="px-2 py-0.5 text-gray-400">
                    +{availableTools.length - 10} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-lg px-4 py-3 backdrop-blur-sm ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-cyan-600/80 to-magenta-600/80 text-white border border-cyan-400/30 shadow-lg shadow-cyan-900/30' 
                    : message.role === 'system'
                    ? 'bg-red-950/50 border border-red-800/50 text-red-200 shadow-lg shadow-red-900/30'
                    : message.role === 'command'
                    ? 'bg-cyan-950/50 border border-cyan-800/50 text-cyan-200 shadow-lg shadow-cyan-900/30'
                    : 'bg-gray-900/80 border border-cyan-700/30 shadow-lg shadow-cyan-900/20'
                }`}>
                  {message.toolsUsed && message.toolsUsed.length > 0 && (
                    <div className="flex items-center space-x-2 mb-2 text-xs opacity-70">
                      <FiActivity className="text-xs" />
                      {message.toolsUsed.map(tool => (
                        <span key={tool} className="px-1.5 py-0.5 bg-black/30 rounded">
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {message.processing ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  ) : (
                    <ReactMarkdown
                      components={{
                        code({node, inline, className, children, ...props}: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              className="text-xs my-2 rounded"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-black/30 px-1 py-0.5 rounded text-xs" {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                  
                  <div className="text-xs opacity-50 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-cyan-900/30 p-4 bg-gray-900/50 backdrop-blur-md">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything, or use ! for bash commands..."
                disabled={isProcessing}
                className="w-full bg-gray-800/80 backdrop-blur-sm border border-cyan-700/50 rounded-lg px-4 py-2.5 pr-12 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 disabled:opacity-50 shadow-lg shadow-cyan-900/20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-xs text-gray-500">
                <FiCommand className="text-xs" />
                <span>⏎</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isProcessing || !input.trim()}
              className="bg-gradient-to-r from-cyan-600 to-magenta-600 hover:from-cyan-700 hover:to-magenta-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2.5 flex items-center shadow-lg shadow-cyan-900/30 border border-cyan-400/30"
            >
              {isProcessing ? (
                <FiActivity className="animate-spin" />
              ) : (
                <FiSend />
              )}
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <div>
              <span className="text-purple-400">!</span>command for bash • 
              <span className="text-purple-400"> read</span> /path for files • 
              Natural language for everything else
            </div>
            <div className={`flex items-center space-x-1 ${
              connectionStatus === 'connected' ? 'text-cyan-400' : 
              connectionStatus === 'error' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                connectionStatus === 'connected' ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' : 
                connectionStatus === 'error' ? 'bg-red-400 shadow-lg shadow-red-400/50' : 'bg-yellow-400 shadow-lg shadow-yellow-400/50'
              }`} />
              <span className="text-xs">
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'error' ? (connectionError || 'Error') : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}