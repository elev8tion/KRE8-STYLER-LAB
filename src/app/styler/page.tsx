'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Layers, Eye, Library,
  CheckCircle, AlertCircle, Loader2,
  MessageSquare, Bell, Settings, ChevronRight, Send,
  Activity, Cpu, Terminal, Cloud, Shield, GitBranch, 
  Download, Upload, ChevronDown, ChevronUp, Menu,
  Archive, Cog
} from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import KRE8ComponentLibrary from '@/components/KRE8ComponentLibrary';
import { componentStorage } from '@/utils/componentStorage';
import type { SavedComponent } from '@/utils/componentStorage';
import ExpandingHeaderActions from '@/components/ExpandingHeaderActions';
import ExpandingVerticalTabs from '@/components/ExpandingVerticalTabs';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
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
  // Panel collapse states
  const [cssEditorCollapsed, setCssEditorCollapsed] = useState(false);
  const [componentEditorCollapsed, setComponentEditorCollapsed] = useState(false);
  const [aiChatCollapsed, setAiChatCollapsed] = useState(false);
  const [allPanelsCollapsed, setAllPanelsCollapsed] = useState(false);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'library' | 'saved' | 'settings'>('preview');
  const [autoRun, setAutoRun] = useState(true);
  const [status, setStatus] = useState<'ready' | 'processing' | 'error' | 'success'>('ready');
  const [componentFormat, setComponentFormat] = useState<'standard' | 'styled'>('standard');
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  
  
  // Saved components
  const [savedComponents, setSavedComponents] = useState<SavedComponent[]>([]);
  
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
  
  // Load saved components on mount
  useEffect(() => {
    setSavedComponents(componentStorage.getComponents());
  }, []);
  

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

  const copyToClipboard = () => {
    const fullCode = `// Component\n${componentCode}\n\n/* CSS */\n${cssCode}`;
    navigator.clipboard.writeText(fullCode);
  };

  const toggleAllPanels = () => {
    const newCollapsedState = !allPanelsCollapsed;
    setAllPanelsCollapsed(newCollapsedState);
    setCssEditorCollapsed(newCollapsedState);
    setComponentEditorCollapsed(newCollapsedState);
    setAiChatCollapsed(newCollapsedState);
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarCollapsed(!leftSidebarCollapsed);
  };

  const saveComponent = () => {
    const name = prompt('Component name:');
    if (!name) return;
    
    const tags = prompt('Tags (comma-separated, optional):')?.split(',').map(t => t.trim()).filter(Boolean) || [];
    
    try {
      const saved = componentStorage.saveComponent(name, componentCode, cssCode, tags);
      setSavedComponents(componentStorage.getComponents());
      setEditingComponent(saved.id);
      setStatus('success');
      setTimeout(() => setStatus('ready'), 1000);
    } catch (error) {
      console.error('Error saving component:', error);
      setStatus('error');
      setTimeout(() => setStatus('ready'), 1000);
    }
  };
  
  const loadComponent = (component: SavedComponent) => {
    setComponentCode(component.code);
    setCssCode(component.css);
    setEditingComponent(component.id);
    setPreviewKey(prev => prev + 1);
  };
  
  const handleTemplateSelect = (template: any) => {
    setComponentCode(template.code);
    setCssCode(template.css);
    // Template loaded, switching to preview tab
    setPreviewKey(prev => prev + 1);
  };
  
  const exportComponents = () => {
    try {
      const json = componentStorage.exportComponents();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kre8-components.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting components:', error);
    }
  };
  
  const importComponents = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = event.target?.result as string;
          if (componentStorage.importComponents(json)) {
            setSavedComponents(componentStorage.getComponents());
            setStatus('success');
            setTimeout(() => setStatus('ready'), 1000);
          } else {
            setStatus('error');
            setTimeout(() => setStatus('ready'), 1000);
          }
        } catch (error) {
          console.error('Error importing components:', error);
          setStatus('error');
          setTimeout(() => setStatus('ready'), 1000);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };
  
  const convertComponent = () => {
    setComponentFormat(componentFormat === 'styled' ? 'standard' : 'styled');
    // Add conversion logic here if needed
  };
  
  const openGallery = () => {
    window.location.href = '/gallery';
  };
  
  const openEditor = () => {
    window.location.href = '/style-guide';
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black cyber-grid">
      <div className="h-screen flex flex-col">
        {/* Header with KRE8 STYLER Logo */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel panel-header holographic"
        >
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-6">
              {/* Logo without glow container */}
              <img
                src="/kre8-logo.svg"
                alt="KRE8"
                width={90}
                height={90}
                style={{
                  padding: '12px',
                  marginTop: '-10px',
                  marginLeft: '-14px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '8px'
                }}
              />
              
              {/* Format Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-fira-code">FORMAT:</span>
                <span className={`px-3 py-1 text-xs font-fira-code tech-corners ${
                  componentFormat === 'styled' 
                    ? 'glass-panel text-cyan-400 neon-text' 
                    : 'glass-panel-purple text-purple-400 neon-text-purple'
                }`}>
                  {componentFormat === 'styled' ? 'STYLED-COMPONENTS' : 'STANDARD REACT'}
                </span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {status === 'processing' && (
                  <>
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin drop-shadow-glow" />
                    <span className="text-xs neon-text font-fira-code data-stream">PROCESSING...</span>
                  </>
                )}
                {status === 'ready' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400 pulse-glow" />
                    <span className="text-xs neon-text-green font-fira-code">READY</span>
                  </>
                )}
                {status === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400 pulse-glow" />
                    <span className="text-xs text-red-400 font-fira-code">ERROR</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <ExpandingHeaderActions
              toggleAllPanels={toggleAllPanels}
              setAutoRun={setAutoRun}
              convertComponent={convertComponent}
              saveComponent={saveComponent}
              copyToClipboard={copyToClipboard}
              exportComponents={exportComponents}
              importComponents={importComponents}
              openGallery={openGallery}
              openEditor={openEditor}
              allPanelsCollapsed={allPanelsCollapsed}
              autoRun={autoRun}
            />
          </div>
        </motion.header>

        <div className="flex-1 flex overflow-hidden main-container">
          {/* Left Sidebar Navigation */}
          <div className={`glass-panel border-r border-cyan-400/30 transition-all duration-300 ${
            leftSidebarCollapsed ? 'w-16' : 'w-64'
          }`}>
            {/* Sidebar Toggle Button */}
            <div className="flex items-center justify-between p-2 panel-header">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLeftSidebar}
                className="w-12 h-12 flex items-center justify-center tech-corners glass-panel text-cyan-400 hover:neon-text transition-all duration-300 ripple"
                title={leftSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                <Menu className="w-5 h-5" />
              </motion.button>
              {!leftSidebarCollapsed && (
                <span className="text-sm neon-text font-orbitron font-bold tracking-wider">NAVIGATION</span>
              )}
            </div>
            <ul className="flex flex-col gap-2 p-2">
              {/* MCP Tools */}
              <li className={`group overflow-hidden tech-corners border-l-2 border-transparent glass-panel-purple transition-all duration-500 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 has-[:focus]:shadow-lg ${
                leftSidebarCollapsed ? 'w-12' : 'w-full'
              }`}>
                <motion.button 
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="peer flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-purple-400 hover:neon-text-purple transition-all"
                >
                  <div className="tech-corners border-2 border-purple-400/50 bg-purple-500/20 p-1 pulse-glow">
                    <Terminal className="w-6 h-6 drop-shadow-glow" />
                  </div>
                  {!leftSidebarCollapsed && <div className="font-orbitron font-bold tracking-wide">MCP TOOLS</div>}
                </motion.button>
                {!leftSidebarCollapsed && (
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
                )}
              </li>

              {/* Settings */}
              <li className={`group overflow-hidden tech-corners border-l-2 border-transparent glass-panel-green transition-all duration-500 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/20 has-[:focus]:shadow-lg ${
                leftSidebarCollapsed ? 'w-12' : 'w-full'
              }`}>
                <motion.button 
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="peer flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-green-400 hover:neon-text-green transition-all"
                >
                  <div className="tech-corners border-2 border-green-400/50 bg-green-500/20 p-1 pulse-glow">
                    <Settings className="w-6 h-6 drop-shadow-glow" />
                  </div>
                  {!leftSidebarCollapsed && <div className="font-orbitron font-bold tracking-wide">SETTINGS</div>}
                </motion.button>
                {!leftSidebarCollapsed && (
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
                )}
              </li>

              {/* Notifications */}
              <li className={`group overflow-hidden tech-corners border-l-2 border-transparent glass-panel transition-all duration-500 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/20 has-[:focus]:shadow-lg ${
                leftSidebarCollapsed ? 'w-12' : 'w-full'
              }`}>
                <motion.button 
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="peer flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-orange-400 hover:neon-text-orange transition-all"
                >
                  <div className="tech-corners border-2 border-orange-400/50 bg-orange-500/20 p-1 pulse-glow">
                    <Bell className="w-6 h-6 drop-shadow-glow" />
                  </div>
                  {!leftSidebarCollapsed && <div className="font-orbitron font-bold tracking-wide">ACTIVITY</div>}
                </motion.button>
                {!leftSidebarCollapsed && (
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
                )}
              </li>
            </ul>
          </div>

          
          {/* Middle Section - 3 Collapsible Panels */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`bg-black/20 backdrop-blur-sm border-r border-cyan-900/30 transition-all duration-300 ${
              allPanelsCollapsed ? 'w-48' : 'w-2/5'
            }`}
          >
            <PanelGroup direction="vertical">
              {/* Panel 1: CSS Styles Editor */}
              <Panel 
                defaultSize={allPanelsCollapsed ? 5 : 33} 
                minSize={allPanelsCollapsed ? 5 : 10}
                className="flex flex-col"
                collapsible={true}
                collapsedSize={5}
                onCollapse={() => setCssEditorCollapsed(true)}
                onExpand={() => setCssEditorCollapsed(false)}
              >
                <div className={`flex items-center justify-between px-4 bg-black/40 border-b border-cyan-900/30 transition-all duration-300 ${
                  cssEditorCollapsed || allPanelsCollapsed ? 'py-2' : 'py-3'
                }`}>
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-cyan-400" />
                    {!(cssEditorCollapsed || allPanelsCollapsed) && (
                      <span className="text-cyan-400 text-sm font-medium">CSS Styles Editor</span>
                    )}
                  </div>
                  <button
                    onClick={() => setCssEditorCollapsed(!cssEditorCollapsed)}
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {cssEditorCollapsed || allPanelsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
                {!(cssEditorCollapsed || allPanelsCollapsed) && (
                  <div className="flex-1 overflow-hidden">
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
                  </div>
                )}
              </Panel>
              
              <PanelResizeHandle className="h-2 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent hover:via-cyan-400/60 transition-all duration-300 relative group" />

              {/* Panel 2: Component Code Editor */}
              <Panel 
                defaultSize={allPanelsCollapsed ? 5 : 34} 
                minSize={allPanelsCollapsed ? 5 : 10}
                className="flex flex-col"
                collapsible={true}
                collapsedSize={5}
                onCollapse={() => setComponentEditorCollapsed(true)}
                onExpand={() => setComponentEditorCollapsed(false)}
              >
                <div className={`flex items-center justify-between px-4 panel-header transition-all duration-300 ${
                  componentEditorCollapsed || allPanelsCollapsed ? 'py-2' : 'py-3'
                }`}>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400 drop-shadow-glow" />
                    {!(componentEditorCollapsed || allPanelsCollapsed) && (
                      <span className="neon-text-purple text-sm font-orbitron font-bold tracking-wider">COMPONENT CODE EDITOR</span>
                    )}
                  </div>
                  <button
                    onClick={() => setComponentEditorCollapsed(!componentEditorCollapsed)}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {componentEditorCollapsed || allPanelsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
                {!(componentEditorCollapsed || allPanelsCollapsed) && (
                  <div className="flex-1 overflow-hidden">
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
                  </div>
                )}
              </Panel>
              
              <PanelResizeHandle className="h-2 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent hover:via-purple-400/60 transition-all duration-300 relative group" />

              {/* Panel 3: AI Chat */}
              <Panel 
                defaultSize={allPanelsCollapsed ? 5 : 33} 
                minSize={allPanelsCollapsed ? 5 : 10}
                className="flex flex-col"
                collapsible={true}
                collapsedSize={5}
                onCollapse={() => setAiChatCollapsed(true)}
                onExpand={() => setAiChatCollapsed(false)}
              >
                <div className={`flex items-center justify-between px-4 panel-header transition-all duration-300 ${
                  aiChatCollapsed || allPanelsCollapsed ? 'py-2' : 'py-3'
                }`}>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-400 drop-shadow-glow pulse-glow" />
                    {!(aiChatCollapsed || allPanelsCollapsed) && (
                      <span className="neon-text-green text-sm font-orbitron font-bold tracking-wider">AI CHAT</span>
                    )}
                  </div>
                  <button
                    onClick={() => setAiChatCollapsed(!aiChatCollapsed)}
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {aiChatCollapsed || allPanelsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
                {!(aiChatCollapsed || allPanelsCollapsed) && (
                  <div className="flex flex-col flex-1">
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-3">
                        {messages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                              msg.role === 'user' 
                                ? 'bg-cyan-500/20 text-cyan-300' 
                                : 'bg-gray-800/50 text-gray-300'
                            }`}>
                              <div className="text-sm">{msg.content}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {typeof window !== 'undefined' ? msg.timestamp.toLocaleTimeString() : ''}
                                {msg.toolsUsed && (
                                  <span className="ml-2 text-cyan-400">• {msg.toolsUsed.join(', ')}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                    </div>
                    <div className="p-4 border-t border-cyan-900/30">
                      <div className="relative">
                        <input 
                          className="w-full h-10 rounded-lg border border-cyan-500/30 bg-black/50 pl-4 pr-12 text-sm text-white placeholder-gray-500" 
                          placeholder="Ask AI to help with your component..." 
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          disabled={isProcessing}
                        />
                        <button 
                          onClick={handleSendMessage}
                          disabled={isProcessing || !inputMessage.trim()}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-cyan-400 hover:text-cyan-300 disabled:opacity-50 transition-colors"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Panel>
            </PanelGroup>
          </motion.div>

          {/* Right Panel with Vertical Tabs */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`flex bg-black/20 backdrop-blur-sm transition-all duration-300 ${
              allPanelsCollapsed ? 'flex-1' : 'flex-1'
            }`}
          >
            {/* Expanding Vertical Tabs */}
            <ExpandingVerticalTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Tab Content */}
            <div className="flex-1 flex flex-col">
              {/* Tab Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-black/40 border-b border-cyan-900/30">
                {activeTab === 'preview' && (
                  <>
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 text-sm font-medium">Live Preview</span>
                    <div className="flex items-center gap-2 ml-4">
                      <Activity className="w-3 h-3 text-green-400 animate-pulse" />
                      <span className="text-xs text-green-400">Real-time</span>
                    </div>
                  </>
                )}
                {activeTab === 'library' && (
                  <>
                    <Library className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm font-medium">Component Library</span>
                  </>
                )}
                {activeTab === 'saved' && (
                  <>
                    <Archive className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Saved Components</span>
                    <span className="text-xs text-gray-500 ml-2">({savedComponents.length})</span>
                  </>
                )}
                {activeTab === 'settings' && (
                  <>
                    <Cog className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 text-sm font-medium">Settings</span>
                  </>
                )}
              </div>
              
              {/* Tab Content Area */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeTab === 'preview' && (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-full p-8 overflow-auto bg-gradient-to-br from-gray-950 via-gray-900 to-black"
                    >
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
                    </motion.div>
                  )}

                  {activeTab === 'library' && (
                    <motion.div
                      key="library"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-full overflow-y-auto bg-gradient-to-b from-purple-950/20 to-black/90 cyber-grid"
                    >
                      <div className="p-4">
                        <KRE8ComponentLibrary 
                          onSelectTemplate={(template) => {
                            handleTemplateSelect(template);
                            setActiveTab('preview');
                          }}
                          isOpen={true}
                          embedded={true}
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'saved' && (
                    <motion.div
                      key="saved"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-full overflow-y-auto bg-gradient-to-b from-green-950/20 to-black/90 cyber-grid"
                    >
                      <div className="p-4">
                        {savedComponents.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <Archive className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-lg font-medium">No saved components</p>
                            <p className="text-sm">Save your first component to see it here</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4">
                            {savedComponents.map(component => (
                              <motion.button
                                key={component.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  loadComponent(component);
                                  setActiveTab('preview');
                                }}
                                className={`w-full p-4 bg-gray-900/50 border rounded-lg hover:bg-green-500/10 hover:border-green-500/40 transition-colors text-left ${
                                  editingComponent === component.id 
                                    ? 'border-green-500/60 bg-green-500/10' 
                                    : 'border-green-500/20'
                                }`}
                              >
                                <h4 className="font-medium text-white text-lg">{component.name}</h4>
                                <p className="text-sm text-gray-400 mt-1">
                                  {typeof window !== 'undefined' 
                                    ? `${component.timestamp.toLocaleDateString()} • ${component.timestamp.toLocaleTimeString()}`
                                    : ''
                                  }
                                </p>
                                {component.tags && component.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {component.tags.map(tag => (
                                      <span key={tag} className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-md border border-green-500/30">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'settings' && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-full overflow-y-auto bg-gradient-to-b from-orange-950/20 to-black/90 cyber-grid"
                    >
                      <div className="p-4">
                        <div className="space-y-6">
                          {/* Preview Settings */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-orbitron font-bold neon-text-orange">PREVIEW SETTINGS</h3>
                            <div className="space-y-2">
                              <label className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                                <span className="text-gray-300">Auto-run on code change</span>
                                <input
                                  type="checkbox"
                                  checked={autoRun}
                                  onChange={(e) => setAutoRun(e.target.checked)}
                                  className="ml-2 w-5 h-5 rounded text-orange-500 focus:ring-orange-500 focus:ring-2"
                                />
                              </label>
                              <label className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                                <span className="text-gray-300">Live preview refresh</span>
                                <input
                                  type="checkbox"
                                  checked={true}
                                  onChange={(e) => {}}
                                  className="ml-2 w-5 h-5 rounded text-orange-500 focus:ring-orange-500 focus:ring-2"
                                />
                              </label>
                              <div className="p-3 bg-gray-900/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                                <label className="block text-gray-300 mb-2">Component Format</label>
                                <select 
                                  value={componentFormat} 
                                  onChange={(e) => setComponentFormat(e.target.value as 'standard' | 'styled')}
                                  className="w-full bg-black/50 border border-orange-500/30 rounded px-3 py-2 text-white hover:border-orange-500/50 transition-colors"
                                >
                                  <option value="standard">Standard React</option>
                                  <option value="styled">Styled Components</option>
                                </select>
                              </div>
                              <div className="p-3 bg-gray-900/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                                <label className="block text-gray-300 mb-2">Preview Background</label>
                                <select 
                                  className="w-full bg-black/50 border border-orange-500/30 rounded px-3 py-2 text-white hover:border-orange-500/50 transition-colors"
                                >
                                  <option value="gradient">Gradient</option>
                                  <option value="dark">Dark</option>
                                  <option value="light">Light</option>
                                  <option value="transparent">Transparent</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Editor Settings */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-orbitron font-bold neon-text-orange">EDITOR SETTINGS</h3>
                            <div className="space-y-2">
                              <div className="p-3 bg-gray-900/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                                <label className="block text-gray-300 mb-2">Editor Theme</label>
                                <select 
                                  className="w-full bg-black/50 border border-orange-500/30 rounded px-3 py-2 text-white hover:border-orange-500/50 transition-colors"
                                >
                                  <option value="vs-dark">VS Dark</option>
                                  <option value="monokai">Monokai</option>
                                  <option value="github-dark">GitHub Dark</option>
                                  <option value="dracula">Dracula</option>
                                </select>
                              </div>
                              <div className="p-3 bg-gray-900/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                                <label className="block text-gray-300 mb-2">Font Size</label>
                                <input 
                                  type="range"
                                  min="12"
                                  max="20"
                                  defaultValue="14"
                                  className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>12px</span>
                                  <span>14px</span>
                                  <span>20px</span>
                                </div>
                              </div>
                              <label className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                                <span className="text-gray-300">Enable minimap</span>
                                <input
                                  type="checkbox"
                                  defaultChecked={true}
                                  className="ml-2 w-5 h-5 rounded text-orange-500 focus:ring-orange-500 focus:ring-2"
                                />
                              </label>
                              <label className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                                <span className="text-gray-300">Word wrap</span>
                                <input
                                  type="checkbox"
                                  defaultChecked={false}
                                  className="ml-2 w-5 h-5 rounded text-orange-500 focus:ring-orange-500 focus:ring-2"
                                />
                              </label>
                            </div>
                          </div>

                          {/* AI Settings */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-orbitron font-bold neon-text-orange">AI ASSISTANT</h3>
                            <div className="space-y-2">
                              <label className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                                <span className="text-gray-300">Enable AI suggestions</span>
                                <input
                                  type="checkbox"
                                  defaultChecked={true}
                                  className="ml-2 w-5 h-5 rounded text-orange-500 focus:ring-orange-500 focus:ring-2"
                                />
                              </label>
                              <label className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                                <span className="text-gray-300">Auto-complete code</span>
                                <input
                                  type="checkbox"
                                  defaultChecked={false}
                                  className="ml-2 w-5 h-5 rounded text-orange-500 focus:ring-orange-500 focus:ring-2"
                                />
                              </label>
                              <div className="p-3 bg-gray-900/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                                <label className="block text-gray-300 mb-2">AI Model</label>
                                <select 
                                  className="w-full bg-black/50 border border-orange-500/30 rounded px-3 py-2 text-white hover:border-orange-500/50 transition-colors"
                                >
                                  <option value="claude-3">Claude 3 (Default)</option>
                                  <option value="gpt-4">GPT-4</option>
                                  <option value="local">Local Model</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Export/Import */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-orbitron font-bold neon-text-orange">DATA MANAGEMENT</h3>
                            <div className="flex gap-2">
                              <button
                                onClick={exportComponents}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors border border-green-500/20 hover:border-green-500/40"
                              >
                                <Download className="w-4 h-4" />
                                Export
                              </button>
                              <button
                                onClick={importComponents}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20 hover:border-blue-500/40"
                              >
                                <Upload className="w-4 h-4" />
                                Import
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to clear all saved components?')) {
                                  localStorage.removeItem('kre8-components');
                                  setSavedComponents([]);
                                }
                              }}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20 hover:border-red-500/40"
                            >
                              Clear All Data
                            </button>
                          </div>

                          {/* About */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-orbitron font-bold neon-text-orange">ABOUT</h3>
                            <div className="p-3 bg-gray-900/50 rounded-lg border border-orange-500/20">
                              <p className="text-gray-400 text-sm">KRE8 Styler Lab v1.0.0</p>
                              <p className="text-gray-500 text-xs mt-1">AI-powered component styling assistant</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}