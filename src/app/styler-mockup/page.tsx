'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Layers, Play, Save, Copy, Eye, Library, Wand2, Zap, ZapOff, 
  CheckCircle, AlertCircle, Loader2, FolderOpen, Sparkles,
  MessageSquare, Bell, Settings, ChevronRight, Send,
  Activity, Cpu, Terminal, Cloud, Shield, GitBranch
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import DraggableFixedLogo from '@/components/DraggableFixedLogo';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
}

interface ComponentTemplate {
  id: string;
  name: string;
  code: string;
  css: string;
}

export default function KRE8Styler() {
  // Component state
  const [componentCode, setComponentCode] = useState(`function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="card">
      <h2 className="title">KRE8 Interactive Counter</h2>
      <p className="subtitle">You clicked {count} times</p>
      <button 
        className="btn-primary"
        onClick={() => setCount(count + 1)}
      >
        Click me
      </button>
    </div>
  );
}`);

  const [cssCode, setCssCode] = useState(`.card {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: rgba(255,255,255,0.9);
  margin-bottom: 1.5rem;
}

.btn-primary {
  background: white;
  color: #667eea;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}`);

  const [previewKey, setPreviewKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'component' | 'css'>('component');
  const [showLibrary, setShowLibrary] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const [status, setStatus] = useState<'ready' | 'processing' | 'error' | 'success'>('ready');
  const [componentFormat, setComponentFormat] = useState<'standard' | 'styled'>('standard');
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  
  // Chat state for expandable sidebar
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I can help you create amazing components with AI and MCP tools.',
      timestamp: new Date(),
      toolsUsed: ['Claude', 'MCP']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Component templates
  const templates: ComponentTemplate[] = [
    {
      id: '1',
      name: 'Glassmorphic Card',
      code: `function GlassCard() {
  return (
    <div className="glass-card">
      <h2>Glassmorphic Design</h2>
      <p>Modern frosted glass effect</p>
    </div>
  );
}`,
      css: `.glass-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}`
    },
    {
      id: '2',
      name: 'Animated Button',
      code: `function AnimatedButton() {
  return (
    <button className="animated-btn">
      Hover Me
    </button>
  );
}`,
      css: `.animated-btn {
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.animated-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}`
    }
  ];

  // Auto-run functionality
  useEffect(() => {
    if (!autoRun) return;
    
    const timer = setTimeout(() => {
      setStatus('processing');
      setPreviewKey(prev => prev + 1);
      setTimeout(() => setStatus('ready'), 500);
    }, 800);

    return () => clearTimeout(timer);
  }, [componentCode, cssCode, autoRun]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderPreview = () => {
    try {
      const ComponentRenderer = dynamic(() => import('@/components/ComponentRenderer'), { 
        ssr: false,
        loading: () => <div className="text-gray-400">Loading preview...</div>
      });
      
      return <ComponentRenderer code={componentCode} css={cssCode} />;
    } catch (error) {
      return (
        <div className="text-red-500 p-4">
          <p className="font-bold">Error in component:</p>
          <pre className="text-sm mt-2">{String(error)}</pre>
        </div>
      );
    }
  };

  const updatePreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  const copyToClipboard = () => {
    const fullCode = `// Component\n${componentCode}\n\n/* CSS */\n${cssCode}`;
    navigator.clipboard.writeText(fullCode);
  };

  const saveComponent = () => {
    const name = prompt('Component name:');
    if (!name) return;
    
    const description = prompt('Description (optional):') || '';
    const tags = prompt('Tags (comma-separated, optional):')?.split(',').map(t => t.trim()).filter(Boolean) || [];
    
    // Save to localStorage
    const components = JSON.parse(localStorage.getItem('kre8-components') || '[]');
    components.push({
      id: Date.now().toString(),
      name,
      description,
      tags,
      componentCode,
      cssCode,
      format: componentFormat,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('kre8-components', JSON.stringify(components));
    
    setEditingComponent(Date.now().toString());
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      // Call AI assist endpoint
      const response = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputMessage,
          currentCode: componentCode,
          action: 'enhance',
          language: 'typescript'
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.message || 'Component updated!',
          timestamp: new Date(),
          toolsUsed: ['AI']
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        if (result.code) {
          setComponentCode(result.code);
        }
      }
    } catch (error) {
      console.error('AI assist error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
      <div className="h-screen flex flex-col">
        {/* Header with KRE8 STYLER Logo */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/60 backdrop-blur-xl border-b border-cyan-900/30"
        >
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-6">
              {/* KRE8 STYLER Logo - Proper spacing from left */}
              <div className="flex items-center gap-3 ml-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <div className="text-white font-bold text-xl">K8</div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      KRE8 STYLER
                    </span>
                  </h1>
                  <p className="text-xs text-cyan-300/60">AI-Powered Component Studio</p>
                </div>
              </div>
              
              {/* Format Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Format:</span>
                <span className={`px-2 py-1 text-xs rounded-md ${
                  componentFormat === 'styled' 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}>
                  {componentFormat === 'styled' ? 'Styled-Components' : 'Standard React'}
                </span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {status === 'processing' && (
                  <>
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="text-xs text-cyan-400">Processing...</span>
                  </>
                )}
                {status === 'ready' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">Ready</span>
                  </>
                )}
                {status === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-400">Error</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowLibrary(!showLibrary)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors border border-cyan-500/20"
              >
                <Library className="w-4 h-4" />
                Templates
              </button>
              
              {/* Auto-run Toggle */}
              <button
                onClick={() => setAutoRun(!autoRun)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border ${
                  autoRun 
                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20' 
                    : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border-gray-500/20'
                }`}
                title={autoRun ? 'Auto-run is ON' : 'Auto-run is OFF'}
              >
                {autoRun ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                Auto-Run: {autoRun ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={() => {
                  // Convert between standard and styled-components
                  setComponentFormat(componentFormat === 'styled' ? 'standard' : 'styled');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors border border-purple-500/20"
                title="Convert component format"
              >
                <Wand2 className="w-4 h-4" />
                Convert
              </button>
              
              {!autoRun && (
                <button
                  onClick={updatePreview}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors border border-green-500/20"
                >
                  <Play className="w-4 h-4" />
                  Run
                </button>
              )}
              
              <div className="h-6 w-px bg-cyan-900/30" />
              
              <button
                onClick={saveComponent}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20"
              >
                <Save className="w-4 h-4" />
                {editingComponent ? 'Update' : 'Save'}
              </button>
              
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              
              <Link
                href="/gallery"
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors border border-purple-500/20"
              >
                <FolderOpen className="w-4 h-4" />
                Gallery
              </Link>
              
              <Link
                href="/style-guide"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-cyan-400 rounded-lg hover:from-cyan-500/20 hover:to-purple-500/20 transition-all border border-cyan-500/20"
              >
                <Sparkles className="w-4 h-4" />
                AI Editor
              </Link>
            </div>
          </div>
        </motion.header>

        <div className="flex-1 flex overflow-hidden">
          {/* Expandable Sidebar Navigation */}
          <div className="bg-black/40 backdrop-blur-sm border-r border-cyan-900/30">
            <ul className="w-16 flex flex-col gap-1 p-2">
              {/* AI Chat */}
              <li className="group w-14 overflow-hidden rounded-lg border-l border-transparent bg-gray-900/50 backdrop-blur transition-all duration-500 hover:w-64 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 has-[:focus]:w-64 has-[:focus]:shadow-lg">
                <button className="peer flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-cyan-400 transition-all active:scale-95">
                  <div className="rounded-lg border-2 border-cyan-500/30 bg-cyan-500/10 p-1">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="font-semibold">AI Chat</div>
                </button>
                <div className="grid grid-rows-[0fr] overflow-hidden transition-all duration-500 peer-focus:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <div className="max-h-96 overflow-y-auto p-4 pt-2">
                      <div className="space-y-2">
                        {messages.slice(-3).map(msg => (
                          <div key={msg.id} className={`text-xs ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block max-w-[80%] rounded-lg px-2 py-1 ${
                              msg.role === 'user' 
                                ? 'bg-cyan-500/20 text-cyan-300' 
                                : 'bg-gray-800/50 text-gray-300'
                            }`}>
                              {msg.content}
                            </div>
                            <div className="text-gray-600 text-[10px] mt-0.5">
                              {msg.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                    </div>
                    <div className="relative px-2 pb-2">
                      <input 
                        className="h-8 w-full rounded-lg border border-cyan-500/30 bg-black/50 pl-2 pr-8 text-sm text-white placeholder-gray-500" 
                        placeholder="Ask AI..." 
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={isProcessing}
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={isProcessing || !inputMessage.trim()}
                        className="absolute bottom-2 right-4 top-0 my-auto size-fit cursor-pointer text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>

              {/* MCP Tools */}
              <li className="group w-14 overflow-hidden rounded-lg border-l border-transparent bg-gray-900/50 backdrop-blur transition-all duration-500 hover:w-64 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 has-[:focus]:w-64 has-[:focus]:shadow-lg">
                <button className="peer flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-purple-400 transition-all active:scale-95">
                  <div className="rounded-lg border-2 border-purple-500/30 bg-purple-500/10 p-1">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div className="font-semibold">MCP Tools</div>
                </button>
                <div className="grid grid-rows-[0fr] overflow-hidden transition-all duration-500 peer-focus:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <ul className="divide-y divide-gray-800/50 p-4 pt-0">
                      <li className="py-2">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-gray-300">System Tools</span>
                        </div>
                        <div className="text-xs text-gray-500">File, Bash, Process</div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-2">
                          <Cloud className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-gray-300">Web Tools</span>
                        </div>
                        <div className="text-xs text-gray-500">Search, Fetch, API</div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium text-gray-300">Dev Tools</span>
                        </div>
                        <div className="text-xs text-gray-500">Flutter, Puppeteer, Visual</div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-medium text-gray-300">Security</span>
                        </div>
                        <div className="text-xs text-gray-500">Scan, Analyze, Test</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>

              {/* Settings */}
              <li className="group w-14 overflow-hidden rounded-lg border-l border-transparent bg-gray-900/50 backdrop-blur transition-all duration-500 hover:w-64 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 has-[:focus]:w-64 has-[:focus]:shadow-lg">
                <button className="peer flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-green-400 transition-all active:scale-95">
                  <div className="rounded-lg border-2 border-green-500/30 bg-green-500/10 p-1">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div className="font-semibold">Settings</div>
                </button>
                <div className="grid grid-rows-[0fr] overflow-hidden transition-all duration-500 peer-focus:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <ul className="divide-y divide-gray-800/50 p-4 pt-0">
                      <li className="py-2">
                        <div className="flex items-center justify-between">
                          <button className="peer cursor-pointer font-semibold text-gray-300 hover:text-cyan-400">
                            Editor Preferences
                          </button>
                          <div className="text-sm text-gray-500 transition-all peer-hover:translate-x-1">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">Font size, Theme</div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center justify-between">
                          <button className="peer cursor-pointer font-semibold text-gray-300 hover:text-cyan-400">
                            AI Configuration
                          </button>
                          <div className="text-sm text-gray-500 transition-all peer-hover:translate-x-1">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">Model, Temperature</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>

              {/* Notifications */}
              <li className="group w-14 overflow-hidden rounded-lg border-l border-transparent bg-gray-900/50 backdrop-blur transition-all duration-500 hover:w-64 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 has-[:focus]:w-64 has-[:focus]:shadow-lg">
                <button className="peer flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-orange-400 transition-all active:scale-95">
                  <div className="rounded-lg border-2 border-orange-500/30 bg-orange-500/10 p-1">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div className="font-semibold">Activity</div>
                </button>
                <div className="grid grid-rows-[0fr] overflow-hidden transition-all duration-500 peer-focus:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <ul className="divide-y divide-gray-800/50 p-4 pt-0">
                      <li className="py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-300">Component Saved</span>
                          <div className="text-xs text-gray-500">2m ago</div>
                        </div>
                        <div className="text-xs text-gray-500">GlassCard.tsx</div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-300">AI Generated</span>
                          <div className="text-xs text-gray-500">5m ago</div>
                        </div>
                        <div className="text-xs text-gray-500">AnimatedButton.tsx</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Template Library Sidebar */}
          <AnimatePresence>
            {showLibrary && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="w-80 bg-black/40 backdrop-blur-sm border-r border-cyan-900/30 overflow-y-auto"
              >
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">Component Templates</h3>
                  <div className="space-y-2">
                    {templates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setComponentCode(template.code);
                          setCssCode(template.css);
                          setShowLibrary(false);
                        }}
                        className="w-full p-3 bg-gray-900/50 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-colors text-left"
                      >
                        <h4 className="font-medium text-white">{template.name}</h4>
                        <p className="text-xs text-gray-400 mt-1">Click to load template</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Code Editor Panel */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 flex flex-col bg-black/20 backdrop-blur-sm border-r border-cyan-900/30"
          >
            <div className="flex bg-black/40 border-b border-cyan-900/30">
              <button
                onClick={() => setActiveTab('component')}
                className={`flex items-center gap-2 px-4 py-3 transition-colors ${
                  activeTab === 'component' 
                    ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                Component
              </button>
              <button
                onClick={() => setActiveTab('css')}
                className={`flex items-center gap-2 px-4 py-3 transition-colors ${
                  activeTab === 'css' 
                    ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Palette className="w-4 h-4" />
                Styles
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === 'component' ? (
                  <motion.div
                    key="component"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="h-full"
                  >
                    <MonacoEditor
                      height="100%"
                      language="javascript"
                      theme="vs-dark"
                      value={componentCode}
                      onChange={(value) => setComponentCode(value || '')}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        automaticLayout: true,
                        padding: { top: 20 },
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="css"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="h-full"
                  >
                    <MonacoEditor
                      height="100%"
                      language="css"
                      theme="vs-dark"
                      value={cssCode}
                      onChange={(value) => setCssCode(value || '')}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        automaticLayout: true,
                        padding: { top: 20 },
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Live Preview Panel */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 flex flex-col bg-black/20 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-black/40 border-b border-cyan-900/30">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Live Preview</span>
              <div className="flex items-center gap-2 ml-4">
                <Activity className="w-3 h-3 text-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Real-time</span>
              </div>
            </div>
            
            <div className="flex-1 p-8 overflow-auto bg-gradient-to-br from-gray-950 via-gray-900 to-black">
              <div className="min-h-full flex items-center justify-center">
                <motion.div
                  key={previewKey}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {renderPreview()}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Draggable KRE8 Logo */}
      <DraggableFixedLogo />
    </div>
  );
}