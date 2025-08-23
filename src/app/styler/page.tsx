'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Layers, Eye, Library,
  CheckCircle, AlertCircle, Loader2,
  MessageSquare, Bell, Settings, ChevronRight,
  Activity, Cpu, Terminal, Cloud, Shield, GitBranch, 
  Download, Upload, ChevronDown, ChevronUp, Menu,
  Archive, Cog, Code2, Bot, Database, Info, Copy
} from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import KRE8ComponentLibrary from '@/components/KRE8ComponentLibrary';
import { componentStorage } from '@/utils/componentStorage';
import type { SavedComponent } from '@/utils/componentStorage';
import ExpandingHeaderActions from '@/components/ExpandingHeaderActions';
import ExpandingVerticalTabs from '@/components/ExpandingVerticalTabs';
import { PromptInputBox } from '@/components/PromptInputBox';
import { useMCPTools } from '@/hooks/useMCPTools';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
}


export default function KRE8Styler() {
  // MCP Tools integration
  const mcpTools = useMCPTools();
  
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
      content: `Hi! I'm connected with ${mcpTools.activeProvider || 'local AI'} and have access to ${mcpTools.getEnabledTools().length} MCP tools and ${mcpTools.getEnabledAgents().length} specialized agents. I can help you create amazing components!`,
      timestamp: new Date(),
      toolsUsed: [mcpTools.activeProvider || 'AI', 'MCP Tools', `${mcpTools.getEnabledTools().length} tools`]
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
      // Enhanced AI assist with full MCP tool access
      const enabledTools = mcpTools.getEnabledTools().map(t => t.name);
      const enabledAgents = mcpTools.getEnabledAgents().map(a => a.name);
      
      const response = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputMessage,
          currentCode: componentCode,
          cssCode: cssCode,
          action: 'enhance',
          language: 'typescript',
          context: {
            activeTab: activeTab,
            editingComponent: editingComponent,
            savedComponents: savedComponents
          },
          sessionId: 'kre8-styler-' + Date.now(),
          // Use dynamically enabled MCP tools and agents
          enabledTools: enabledTools.length > 0 ? enabledTools : [
            'component-generator',
            'style-optimizer',
            'code-analyzer',
            'file-manager',
            'terminal-executor',
            'api-connector',
            'search-engine',
            'voice-transcription'
          ],
          agents: enabledAgents.length > 0 ? enabledAgents : [
            'frontend-developer',
            'ui-designer',
            'backend-architect',
            'test-writer-fixer',
            'rapid-prototyper',
            'whimsy-injector',
            'tiktok-strategist'
          ],
          capabilities: {
            codeGeneration: true,
            codeModification: true,
            fileOperations: true,
            systemCommands: true,
            webSearch: true,
            realtimeCollaboration: true
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.message || `Connected via ${result.provider || 'AI Provider'}! I have access to all MCP tools and can help you create components, optimize styles, and much more!`,
          timestamp: new Date(),
          toolsUsed: result.toolsUsed || [result.provider || 'AI Assistant', ...enabledTools.slice(0, 3)]
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Apply code changes if provided
        if (result.code) {
          setComponentCode(result.code);
        }
        if (result.cssCode) {
          setCssCode(result.cssCode);
        }
        if (result.newComponent) {
          // Save new component
          const saved = componentStorage.saveComponent(
            result.newComponent.name || 'New Component',
            result.newComponent.code || componentCode,
            result.newComponent.css || cssCode,
            result.newComponent.tags || []
          );
          setSavedComponents(componentStorage.getComponents());
        }
      } else {
        // Fallback to local model if API fails
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('AI assist error:', error);
      
      // Fallback message with full capabilities listed
      const providerStatus = mcpTools.activeProvider 
        ? `Connected to ${mcpTools.activeProvider}` 
        : 'Using fallback mode';
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant', 
        content: `${providerStatus}. I'm ready to help with full MCP tool access! I can:
• Generate and modify components with ${mcpTools.getEnabledTools().length} tools
• Work with ${mcpTools.getEnabledAgents().length} specialized agents
• Optimize styles and performance
• Run terminal commands
• Manage files and Git operations
• Search the web for solutions
• Analyze and review code
• Create tests and documentation

What would you like to create or improve?`,
        timestamp: new Date(),
        toolsUsed: [mcpTools.activeProvider || 'Local', ...mcpTools.getEnabledTools().slice(0, 2).map(t => t.name)]
      };
      
      setMessages(prev => [...prev, assistantMessage]);
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
                <div className={`flex items-center justify-between px-4 bg-black/40 border-b border-cyan-900/30 transition-all duration-300 ${
                  componentEditorCollapsed || allPanelsCollapsed ? 'py-2' : 'py-3'
                }`}>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    {!(componentEditorCollapsed || allPanelsCollapsed) && (
                      <span className="text-cyan-400 text-sm font-medium">Component Code Editor</span>
                    )}
                  </div>
                  <button
                    onClick={() => setComponentEditorCollapsed(!componentEditorCollapsed)}
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
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
                <div className={`flex items-center justify-between px-4 bg-black/40 border-b border-cyan-900/30 transition-all duration-300 ${
                  aiChatCollapsed || allPanelsCollapsed ? 'py-2' : 'py-3'
                }`}>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    {!(aiChatCollapsed || allPanelsCollapsed) && (
                      <span className="text-cyan-400 text-sm font-medium">AI Chat</span>
                    )}
                  </div>
                  <button
                    onClick={() => setAiChatCollapsed(!aiChatCollapsed)}
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {aiChatCollapsed || allPanelsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
                {!(aiChatCollapsed || allPanelsCollapsed) && (
                  <div className="flex flex-col flex-1 p-2">
                    {/* Professional AI Chat Interface */}
                    <div className="flex-1 flex flex-col gap-3">
                      {/* Main Chat Container */}
                      <div className="flex-1 flex flex-col rounded-2xl border border-cyan-500/20 bg-black/60 backdrop-blur-sm overflow-hidden">
                        {/* Minimal Status Bar */}
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800/50 bg-black/40">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            <span className="text-xs text-cyan-400 font-['Fira_Code']">AI Online</span>
                          </div>
                          <span className="text-xs text-gray-500">Claude 3 Opus</span>
                        </div>
                        
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/10 scrollbar-track-transparent">
                          {/* Welcome Message */}
                          {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                              <div className="relative mb-6">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center border border-cyan-500/20">
                                  <Bot className="w-10 h-10 text-cyan-400" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black" />
                              </div>
                              <h3 className="text-lg font-bold text-cyan-400 mb-2">KRE8 AI Assistant</h3>
                              <p className="text-sm text-gray-400 max-w-sm mb-4">
                                Ready to help you create amazing components
                              </p>
                            </div>
                          )}
                          
                          {/* Messages with Enhanced Design */}
                          {messages.map((msg, index) => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`relative max-w-[85%] group ${msg.role === 'user' ? 'mr-2' : 'ml-2'}`}>
                                {/* Avatar for AI messages */}
                                {msg.role === 'assistant' && (
                                  <div className="absolute -left-10 top-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-purple-400" />
                                  </div>
                                )}
                                
                                {/* Message Bubble */}
                                <div className={`relative rounded-xl backdrop-blur-sm transition-all ${
                                  msg.role === 'user'
                                    ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20'
                                    : 'bg-gray-900/50 border border-gray-800/50'
                                } px-4 py-3`}>
                                  {/* Message Content */}
                                  <div className={`text-sm leading-relaxed ${
                                    msg.role === 'user' ? 'text-cyan-50' : 'text-gray-100'
                                  }`}>
                                    {msg.content}
                                  </div>
                                  
                                  {/* Message Metadata */}
                                  <div className="flex items-center gap-3 mt-2 text-xs">
                                    <span className={`opacity-50 ${
                                      msg.role === 'user' ? 'text-cyan-300' : 'text-gray-400'
                                    }`}>
                                      {typeof window !== 'undefined' ? msg.timestamp.toLocaleTimeString() : ''}
                                    </span>
                                    {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Activity className="w-3 h-3 text-purple-400" />
                                        <span className="text-purple-400">{msg.toolsUsed.join(', ')}</span>
                                      </div>
                                    )}
                                    {msg.role === 'assistant' && (
                                      <button className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                        <Copy className="w-3 h-3 text-gray-400 hover:text-cyan-400 transition-colors" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Typing Indicator for Latest AI Message */}
                                {msg.role === 'assistant' && index === messages.length - 1 && isProcessing && (
                                  <div className="absolute -bottom-6 left-0 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                          <div ref={chatEndRef} />
                        </div>
                        
                      </div>
                      
                      {/* Professional Input Component */}
                      <div className="px-3 pb-3">
                        <PromptInputBox
                          value={inputMessage}
                          onValueChange={setInputMessage}
                          onSend={(message) => {
                            if (message.trim()) {
                              handleSendMessage();
                            }
                          }}
                          isLoading={isProcessing}
                          placeholder="Ask AI to help with your components..."
                          className="w-full"
                        />
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
                      className="h-full overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-black"
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
                      className="h-full overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-black"
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
                      className="h-full overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-black"
                    >
                      <div className="p-8 flex justify-center">
                        <div className="space-y-12 max-w-2xl w-full">
                          {/* Preview Settings */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/30 to-orange-500/20 border-2 border-orange-400 flex items-center justify-center shadow-[0_0_20px_rgba(255,153,0,0.3)]">
                                <Eye className="w-6 h-6 text-orange-400" style={{ filter: 'drop-shadow(0 0 3px #ff9900)' }} />
                              </div>
                              <h3 className="text-xl font-orbitron font-bold text-orange-400" style={{ textShadow: '0 0 20px rgba(255,153,0,0.5)' }}>PREVIEW SETTINGS</h3>
                            </div>
                            <div className="space-y-3 pl-14">
                              <label className="flex items-center justify-between p-4 bg-black/60 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(255,153,0,0.2)] transition-all cursor-pointer group">
                                <span className="text-gray-300 group-hover:text-orange-300 transition-colors font-medium">Auto-run on code change</span>
                                <input
                                  type="checkbox"
                                  checked={autoRun}
                                  onChange={(e) => setAutoRun(e.target.checked)}
                                  className="ml-2 w-5 h-5 rounded accent-orange-500 cursor-pointer"
                                />
                              </label>
                              <label className="flex items-center justify-between p-4 bg-black/60 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(255,153,0,0.2)] transition-all cursor-pointer group">
                                <span className="text-gray-300 group-hover:text-orange-300 transition-colors font-medium">Live preview refresh</span>
                                <input
                                  type="checkbox"
                                  checked={true}
                                  onChange={() => {}}
                                  className="ml-2 w-5 h-5 rounded accent-orange-500 cursor-pointer"
                                />
                              </label>
                              <div className="p-4 bg-black/60 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(255,153,0,0.2)] transition-all">
                                <label className="block text-orange-300 mb-3 font-medium text-sm uppercase tracking-wider">Component Format</label>
                                <select 
                                  value={componentFormat} 
                                  onChange={(e) => setComponentFormat(e.target.value as 'standard' | 'styled')}
                                  className="w-full bg-black/80 border-2 border-orange-500/40 rounded-lg px-4 py-2.5 text-orange-100 hover:border-orange-400 focus:border-orange-300 focus:outline-none transition-all font-medium"
                                >
                                  <option value="standard">Standard React</option>
                                  <option value="styled">Styled Components</option>
                                </select>
                              </div>
                              <div className="p-4 bg-black/60 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(255,153,0,0.2)] transition-all">
                                <label className="block text-orange-300 mb-3 font-medium text-sm uppercase tracking-wider">Preview Background</label>
                                <select 
                                  className="w-full bg-black/80 border-2 border-orange-500/40 rounded-lg px-4 py-2.5 text-orange-100 hover:border-orange-400 focus:border-orange-300 focus:outline-none transition-all font-medium"
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
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,204,0.3)]">
                                <Code2 className="w-6 h-6 text-cyan-400" style={{ filter: 'drop-shadow(0 0 3px #00ffcc)' }} />
                              </div>
                              <h3 className="text-xl font-orbitron font-bold text-cyan-400" style={{ textShadow: '0 0 20px rgba(0,255,204,0.5)' }}>EDITOR SETTINGS</h3>
                            </div>
                            <div className="space-y-3 pl-14">
                              <div className="p-4 bg-black/60 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(255,153,0,0.2)] transition-all">
                                <label className="block text-orange-300 mb-3 font-medium text-sm uppercase tracking-wider">Editor Theme</label>
                                <select 
                                  className="w-full bg-black/80 border-2 border-orange-500/40 rounded-lg px-4 py-2.5 text-orange-100 hover:border-orange-400 focus:border-orange-300 focus:outline-none transition-all font-medium"
                                >
                                  <option value="vs-dark">VS Dark</option>
                                  <option value="monokai">Monokai</option>
                                  <option value="github-dark">GitHub Dark</option>
                                  <option value="dracula">Dracula</option>
                                </select>
                              </div>
                              <div className="p-4 bg-black/60 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(255,153,0,0.2)] transition-all">
                                <label className="block text-orange-300 mb-3 font-medium text-sm uppercase tracking-wider">Font Size</label>
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
                              <label className="flex items-center justify-between p-4 bg-black/60 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(255,153,0,0.2)] transition-all cursor-pointer group">
                                <span className="text-gray-300 group-hover:text-orange-300 transition-colors font-medium">Enable minimap</span>
                                <input
                                  type="checkbox"
                                  defaultChecked={true}
                                  className="ml-2 w-5 h-5 rounded accent-orange-500 cursor-pointer"
                                />
                              </label>
                              <label className="flex items-center justify-between p-4 bg-black/60 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(255,153,0,0.2)] transition-all cursor-pointer group">
                                <span className="text-gray-300 group-hover:text-orange-300 transition-colors font-medium">Word wrap</span>
                                <input
                                  type="checkbox"
                                  defaultChecked={false}
                                  className="ml-2 w-5 h-5 rounded accent-orange-500 cursor-pointer"
                                />
                              </label>
                            </div>
                          </div>

                          {/* AI Settings */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-500/20 border-2 border-purple-400 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                <Bot className="w-6 h-6 text-purple-400" style={{ filter: 'drop-shadow(0 0 3px #a855f7)' }} />
                              </div>
                              <h3 className="text-xl font-orbitron font-bold text-purple-400" style={{ textShadow: '0 0 20px rgba(168,85,247,0.5)' }}>AI ASSISTANT</h3>
                            </div>
                            <div className="space-y-3 pl-14">
                              <label className="flex items-center justify-between p-4 bg-black/60 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(255,153,0,0.2)] transition-all cursor-pointer group">
                                <span className="text-gray-300 group-hover:text-orange-300 transition-colors font-medium">Enable AI suggestions</span>
                                <input
                                  type="checkbox"
                                  defaultChecked={true}
                                  className="ml-2 w-5 h-5 rounded accent-orange-500 cursor-pointer"
                                />
                              </label>
                              <label className="flex items-center justify-between p-4 bg-black/60 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(255,153,0,0.2)] transition-all cursor-pointer group">
                                <span className="text-gray-300 group-hover:text-orange-300 transition-colors font-medium">Auto-complete code</span>
                                <input
                                  type="checkbox"
                                  defaultChecked={false}
                                  className="ml-2 w-5 h-5 rounded accent-orange-500 cursor-pointer"
                                />
                              </label>
                              <div className="p-4 bg-black/60 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-400 hover:shadow-[0_0_20px_rgba(255,153,0,0.2)] transition-all">
                                <label className="block text-orange-300 mb-3 font-medium text-sm uppercase tracking-wider">AI Model</label>
                                <select 
                                  className="w-full bg-black/80 border-2 border-orange-500/40 rounded-lg px-4 py-2.5 text-orange-100 hover:border-orange-400 focus:border-orange-300 focus:outline-none transition-all font-medium"
                                >
                                  <option value="claude-3">Claude 3 (Default)</option>
                                  <option value="gpt-4">GPT-4</option>
                                  <option value="local">Local Model</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Export/Import */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/30 to-green-500/20 border-2 border-green-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                                <Database className="w-6 h-6 text-green-400" style={{ filter: 'drop-shadow(0 0 3px #22c55e)' }} />
                              </div>
                              <h3 className="text-xl font-orbitron font-bold text-green-400" style={{ textShadow: '0 0 20px rgba(34,197,94,0.5)' }}>DATA MANAGEMENT</h3>
                            </div>
                            <div className="pl-14">
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
                          </div>

                          {/* About */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-500/20 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                <Info className="w-6 h-6 text-blue-400" style={{ filter: 'drop-shadow(0 0 3px #3b82f6)' }} />
                              </div>
                              <h3 className="text-xl font-orbitron font-bold text-blue-400" style={{ textShadow: '0 0 20px rgba(59,130,246,0.5)' }}>ABOUT</h3>
                            </div>
                            <div className="pl-14">
                              <div className="p-4 bg-black/60 backdrop-blur-sm rounded-xl border-2 border-blue-500/30">
                                <p className="text-gray-400 text-sm">KRE8 Styler Lab v1.0.0</p>
                                <p className="text-gray-500 text-xs mt-1">AI-powered component styling assistant</p>
                              </div>
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