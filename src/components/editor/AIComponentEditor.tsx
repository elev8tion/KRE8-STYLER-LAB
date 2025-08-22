'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCode, FiEye, FiZap, FiCopy, FiDownload, FiRefreshCw, 
  FiMaximize2, FiMinimize2, FiSettings, FiSave, FiPlay,
  FiMessageSquare, FiLayout, FiPackage
} from 'react-icons/fi';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface ComponentTemplate {
  id: string;
  name: string;
  category: string;
  code: string;
  description: string;
  dependencies?: string[];
}

interface AIComponentEditorProps {
  initialCode?: string;
  onSave?: (code: string) => void;
  enableAI?: boolean;
}

export default function AIComponentEditor({ 
  initialCode = '', 
  onSave,
  enableAI = true 
}: AIComponentEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [compiledCode, setCompiledCode] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50);
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'split'>('split');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  // Component templates
  const templates: ComponentTemplate[] = [
    {
      id: 'styled-button',
      name: 'Styled Component Button',
      category: 'Styled Components',
      code: `import styled from 'styled-components';

const StyledButton = styled.button\`
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
\`;

export default function Button({ children, onClick }) {
  return (
    <StyledButton onClick={onClick}>
      {children}
    </StyledButton>
  );
}`,
      description: 'A button using styled-components'
    },
    {
      id: 'holo-button',
      name: 'Holographic Button',
      category: 'Buttons',
      code: `export default function HoloButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 
                 text-white rounded-lg hover:scale-105 transition-transform
                 shadow-lg shadow-cyan-500/50"
    >
      {children}
    </button>
  );
}`,
      description: 'A holographic button with gradient and glow effects'
    },
    {
      id: 'cyber-card',
      name: 'Cyber Card',
      category: 'Cards',
      code: `export default function CyberCard({ title, content }) {
  return (
    <div className="p-6 bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 
                    rounded-xl shadow-2xl shadow-cyan-500/20">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">{title}</h3>
      <p className="text-gray-300">{content}</p>
    </div>
  );
}`,
      description: 'A cyberpunk-styled card component'
    },
    {
      id: 'animated-loader',
      name: 'Animated Loader',
      category: 'Loaders',
      code: `export default function AnimatedLoader() {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce"
          style={{ animationDelay: \`\${i * 0.1}s\` }}
        />
      ))}
    </div>
  );
}`,
      description: 'A simple animated loading indicator'
    }
  ];

  // Handle AI assistance
  const handleAIAssist = async () => {
    if (!aiPrompt.trim() || !enableAI) return;
    
    setIsAiLoading(true);
    try {
      // Detect if we're working with styled-components
      const isStyledComponent = code.includes('styled') || aiPrompt.toLowerCase().includes('styled');
      const language = isStyledComponent ? 'styled-components' : 'typescript';
      
      const response = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: aiPrompt, 
          currentCode: code,
          action: 'enhance',
          language 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCode(data.code);
        setConsoleOutput(prev => [...prev, `AI: ${data.message || 'Code enhanced'}`]);
        
        // Show bridge status if connected
        if (data.bridgeConnected) {
          setConsoleOutput(prev => [...prev, 'Claude Bridge: Connected ✓']);
        }
      }
    } catch (error) {
      console.error('AI assist error:', error);
      setConsoleOutput(prev => [...prev, `Error: AI assistance failed`]);
    } finally {
      setIsAiLoading(false);
      setAiPrompt('');
    }
  };

  // Compile/transform code for preview
  useEffect(() => {
    try {
      // Simple transformation for preview
      // In production, use a proper bundler like Sandpack
      const transformed = code
        .replace(/export\s+default\s+function/g, 'function')
        .replace(/className=/g, 'class=');
      setCompiledCode(transformed);
      setConsoleOutput(prev => [...prev, 'Code compiled successfully']);
    } catch (error) {
      setConsoleOutput(prev => [...prev, `Compilation error: ${error}`]);
    }
  }, [code]);

  // Handle drag to resize
  const handleDragResize = useCallback((e: React.MouseEvent) => {
    const startX = e.clientX;
    const startRatio = splitRatio;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newRatio = Math.max(20, Math.min(80, startRatio + (deltaX / window.innerWidth) * 100));
      setSplitRatio(newRatio);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [splitRatio]);

  return (
    <motion.div 
      className={`${isFullscreen ? 'fixed inset-0 z-[100000]' : 'relative'} 
                  bg-gray-950 border border-cyan-900/30 rounded-xl overflow-hidden`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Toolbar */}
      <div className="bg-gray-900/90 border-b border-cyan-900/30 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            AI Component Editor
          </h2>
          
          {/* View Mode Tabs */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-md text-sm transition-all ${
                activeTab === 'code' 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiCode className="inline mr-1" /> Code
            </button>
            <button
              onClick={() => setActiveTab('split')}
              className={`px-3 py-1 rounded-md text-sm transition-all ${
                activeTab === 'split' 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiLayout className="inline mr-1" /> Split
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md text-sm transition-all ${
                activeTab === 'preview' 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiEye className="inline mr-1" /> Preview
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowConsole(!showConsole)}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
            title="Toggle Console"
          >
            <FiMessageSquare />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
            title="Settings"
          >
            <FiSettings />
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
            title="Copy Code"
          >
            <FiCopy />
          </button>
          <button
            onClick={() => onSave?.(code)}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
            title="Save"
          >
            <FiSave />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
        </div>
      </div>

      {/* AI Assistant Bar */}
      {enableAI && (
        <div className="bg-gray-900/50 border-b border-cyan-900/30 p-3">
          <div className="flex items-center space-x-3">
            <FiZap className="text-purple-400" />
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAIAssist()}
              placeholder="Ask AI to enhance your component..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm 
                       text-gray-300 placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
            <button
              onClick={handleAIAssist}
              disabled={isAiLoading || !aiPrompt.trim()}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white 
                       rounded-lg text-sm font-medium hover:opacity-90 transition-opacity
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAiLoading ? <FiRefreshCw className="animate-spin" /> : 'Enhance'}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative flex" style={{ height: isFullscreen ? 'calc(100vh - 120px)' : '600px' }}>
        {/* Code Editor */}
        {(activeTab === 'code' || activeTab === 'split') && (
          <div 
            className={activeTab === 'split' ? 'border-r border-gray-800' : 'w-full'}
            style={{ width: activeTab === 'split' ? `${splitRatio}%` : '100%' }}
          >
            <MonacoEditor
              height="100%"
              language="typescript"
              theme={theme}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize,
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                formatOnPaste: true,
                formatOnType: true,
                // Enhanced for styled-components
                folding: true,
                bracketPairColorization: { enabled: true },
                'semanticHighlighting.enabled': true,
                suggest: {
                  showKeywords: true,
                  showSnippets: true,
                  showClasses: true,
                  showFunctions: true,
                  showVariables: true
                }
              }}
              beforeMount={(monaco) => {
                // Configure Monaco for styled-components
                monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                  jsx: monaco.languages.typescript.JsxEmit.React,
                  esModuleInterop: true,
                  allowSyntheticDefaultImports: true,
                  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                  target: monaco.languages.typescript.ScriptTarget.Latest,
                  allowJs: true,
                  typeRoots: ['node_modules/@types']
                });
                
                // Add styled-components type definitions
                monaco.languages.typescript.typescriptDefaults.addExtraLib(
                  `declare module 'styled-components' {
                    export interface DefaultTheme {
                      colors: {
                        primary: string;
                        secondary: string;
                        background: string;
                        text: string;
                      };
                    }
                  }`,
                  'styled-components.d.ts'
                );
              }}
            />
          </div>
        )}

        {/* Resizer */}
        {activeTab === 'split' && (
          <div
            className="absolute top-0 w-1 h-full bg-gray-700 hover:bg-cyan-500 
                     cursor-col-resize transition-colors z-10"
            style={{ left: `${splitRatio}%`, transform: 'translateX(-50%)' }}
            onMouseDown={handleDragResize}
          />
        )}

        {/* Preview */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div 
            className="bg-gray-900/50 overflow-auto"
            style={{ 
              width: activeTab === 'split' ? `${100 - splitRatio}%` : '100%',
              marginLeft: activeTab === 'split' ? '0' : '0'
            }}
          >
            <div className="p-6">
              <div className="mb-4 text-xs text-gray-500 uppercase tracking-wider">
                Live Preview
              </div>
              <div className="bg-black/50 border border-cyan-900/30 rounded-lg p-6 min-h-[200px]">
                {/* This is where the compiled component would render */}
                {/* In production, use Sandpack or similar for real preview */}
                <div dangerouslySetInnerHTML={{ __html: compiledCode }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Console Output */}
      {showConsole && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gray-900 border-t border-cyan-900/30 p-3 overflow-auto">
          <div className="text-xs font-mono">
            {consoleOutput.map((log, i) => (
              <div key={i} className="text-gray-400 mb-1">
                <span className="text-cyan-500">[{new Date().toLocaleTimeString()}]</span> {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-16 right-4 w-64 bg-gray-900 border border-cyan-900/30 
                     rounded-lg p-4 shadow-2xl z-50"
          >
            <h3 className="text-sm font-bold text-cyan-400 mb-4">Editor Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'vs-dark' | 'light')}
                  className="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                >
                  <option value="vs-dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Font Size</label>
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full mt-1"
                />
                <span className="text-xs text-gray-500">{fontSize}px</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}