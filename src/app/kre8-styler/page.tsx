'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, Monitor, Tablet, Code2, Package, Rocket,
  Download, Eye, Settings, Layers, GitBranch, Cloud,
  CheckCircle, AlertCircle, Loader2, Copy, Play,
  ChevronRight, ChevronLeft, Terminal, Database,
  Shield, Activity, Cpu, Bell, Archive, Library
} from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { PromptInputBox } from '@/components/PromptInputBox';
import { useMCPTools } from '@/hooks/useMCPTools';
import { componentStorage } from '@/utils/componentStorage';
import type { SavedComponent } from '@/utils/componentStorage';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
}

type PlatformType = 'web' | 'ios' | 'android' | 'all';
type FrameworkType = 'react' | 'react-native' | 'flutter' | 'next' | 'expo';
type BuildType = 'development' | 'staging' | 'production';

export default function KRE8Styler() {
  const mcpTools = useMCPTools();
  
  // Platform and framework state
  const [targetPlatform, setTargetPlatform] = useState<PlatformType>('web');
  const [framework, setFramework] = useState<FrameworkType>('react');
  const [buildType, setBuildType] = useState<BuildType>('development');
  
  // Component code for different platforms
  const [webCode, setWebCode] = useState(`import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div\`
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
\`;

export default function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <Container>
      <h2>KRE8 Cross-Platform Counter</h2>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </Container>
  );
}`);

  const [mobileCode, setMobileCode] = useState(`import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <Text style={styles.title}>KRE8 Cross-Platform Counter</Text>
      <Text style={styles.subtitle}>You clicked {count} times</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCount(count + 1)}
      >
        <Text style={styles.buttonText}>Click me</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 24,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#667eea',
    fontWeight: '600',
  }
});`);

  const [flutterCode, setFlutterCode] = useState(`import 'package:flutter/material.dart';

class MyComponent extends StatefulWidget {
  @override
  _MyComponentState createState() => _MyComponentState();
}

class _MyComponentState extends State<MyComponent> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(32),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 40,
            offset: Offset(0, 20),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'KRE8 Cross-Platform Counter',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 8),
          Text(
            'You clicked $_count times',
            style: TextStyle(
              color: Colors.white.withOpacity(0.9),
            ),
          ),
          SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _count++;
              });
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Color(0xFF667EEA),
              padding: EdgeInsets.symmetric(
                horizontal: 32,
                vertical: 12,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: Text('Click me'),
          ),
        ],
      ),
    );
  }
}`);

  // Current active code based on platform
  const getCurrentCode = () => {
    if (framework === 'flutter') return flutterCode;
    if (targetPlatform === 'web') return webCode;
    return mobileCode;
  };

  const setCurrentCode = (code: string) => {
    if (framework === 'flutter') setFlutterCode(code);
    else if (targetPlatform === 'web') setWebCode(code);
    else setMobileCode(code);
  };

  // UI State
  const [previewKey, setPreviewKey] = useState(0);
  const [status, setStatus] = useState<'ready' | 'building' | 'deploying' | 'error' | 'success'>('ready');
  const [activeTab, setActiveTab] = useState<'preview' | 'build' | 'deploy' | 'settings'>('preview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [buildOutput, setBuildOutput] = useState<string>('');
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome to KRE8 Styler! I can help you create production-ready apps for:
• 🌐 Web (React, Next.js)
• 📱 iOS & Android (React Native, Expo)
• 🦋 Flutter (iOS, Android, Web)

Connected to ${mcpTools.activeProvider || 'AI'} with ${mcpTools.getEnabledTools().length} tools ready!`,
      timestamp: new Date(),
      toolsUsed: ['KRE8', 'MCP', targetPlatform]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Build configuration
  const [buildConfig, setBuildConfig] = useState({
    appName: 'MyKRE8App',
    bundleId: 'com.kre8.myapp',
    version: '1.0.0',
    minSdkVersion: 21,
    targetSdkVersion: 33,
    iosDeploymentTarget: '13.0',
    outputDir: './build',
    enableProguard: true,
    enableSourceMaps: false,
    optimizeImages: true,
    treeshake: true
  });

  // Deployment configuration
  const [deployConfig, setDeployConfig] = useState({
    provider: 'vercel', // vercel, netlify, aws, firebase, appstore, playstore
    apiKey: '',
    projectId: '',
    region: 'us-east-1',
    autoScale: true,
    ssl: true
  });

  // Handle platform switching
  const handlePlatformChange = (platform: PlatformType) => {
    setTargetPlatform(platform);
    if (platform === 'web') {
      setFramework('react');
    } else if (platform === 'ios' || platform === 'android') {
      setFramework('react-native');
    }
    setPreviewKey(prev => prev + 1);
  };

  // Handle framework change
  const handleFrameworkChange = (fw: FrameworkType) => {
    setFramework(fw);
    setPreviewKey(prev => prev + 1);
  };

  // Build application
  const buildApplication = async () => {
    setStatus('building');
    setBuildOutput('🔨 Starting build process...\n');
    
    try {
      // Simulate build process with MCP tools
      const buildSteps = [
        '📦 Installing dependencies...',
        '🔍 Analyzing code...',
        '🎨 Optimizing assets...',
        '📝 Transpiling TypeScript...',
        '🗂️ Bundling modules...',
        '🚀 Creating production build...'
      ];
      
      for (const step of buildSteps) {
        setBuildOutput(prev => prev + step + '\n');
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Call API to actually build
      const response = await fetch('/api/build-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: targetPlatform,
          framework,
          buildType,
          code: getCurrentCode(),
          config: buildConfig,
          enabledTools: mcpTools.getEnabledTools().map(t => t.name)
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setBuildOutput(prev => prev + '\n✅ Build completed successfully!\n');
        setBuildOutput(prev => prev + `📁 Output: ${result.outputPath}\n`);
        setBuildOutput(prev => prev + `📊 Size: ${result.size}\n`);
        setStatus('success');
      } else {
        throw new Error('Build failed');
      }
    } catch (error) {
      setBuildOutput(prev => prev + '\n❌ Build failed: ' + error);
      setStatus('error');
    }
  };

  // Deploy application
  const deployApplication = async () => {
    setStatus('deploying');
    
    try {
      const response = await fetch('/api/deploy-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: targetPlatform,
          framework,
          deployConfig,
          buildOutput: buildOutput,
          enabledTools: mcpTools.getEnabledTools().map(t => t.name)
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setStatus('success');
        // Show deployment URL or store listing
        alert(`Deployed to: ${result.url || result.storeUrl}`);
      } else {
        throw new Error('Deployment failed');
      }
    } catch (error) {
      setStatus('error');
      console.error('Deployment error:', error);
    }
  };

  // Handle chat messages
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
      const response = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputMessage,
          currentCode: getCurrentCode(),
          platform: targetPlatform,
          framework,
          action: 'enhance',
          enabledTools: mcpTools.getEnabledTools().map(t => t.name),
          agents: mcpTools.getEnabledAgents().map(a => a.name),
          context: {
            buildConfig,
            deployConfig,
            buildType
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.message || 'Code enhanced for ' + targetPlatform,
          timestamp: new Date(),
          toolsUsed: result.toolsUsed || [framework, targetPlatform]
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        if (result.code) {
          setCurrentCode(result.code);
          setPreviewKey(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('AI assist error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Export project
  const exportProject = async () => {
    const projectData = {
      name: buildConfig.appName,
      platform: targetPlatform,
      framework,
      webCode,
      mobileCode,
      flutterCode,
      buildConfig,
      deployConfig,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${buildConfig.appName}-${targetPlatform}.kre8`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/60 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              KRE8 Styler Pro
            </h1>
            
            {/* Platform Selector */}
            <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1 border border-cyan-500/20">
              <button
                onClick={() => handlePlatformChange('web')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                  targetPlatform === 'web' 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                    : 'text-gray-400 hover:text-cyan-400'
                }`}
              >
                <Monitor size={16} />
                <span className="text-sm">Web</span>
              </button>
              <button
                onClick={() => handlePlatformChange('ios')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                  targetPlatform === 'ios' 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                    : 'text-gray-400 hover:text-cyan-400'
                }`}
              >
                <Smartphone size={16} />
                <span className="text-sm">iOS</span>
              </button>
              <button
                onClick={() => handlePlatformChange('android')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                  targetPlatform === 'android' 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                    : 'text-gray-400 hover:text-cyan-400'
                }`}
              >
                <Smartphone size={16} />
                <span className="text-sm">Android</span>
              </button>
              <button
                onClick={() => handlePlatformChange('all')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                  targetPlatform === 'all' 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                    : 'text-gray-400 hover:text-cyan-400'
                }`}
              >
                <Layers size={16} />
                <span className="text-sm">All</span>
              </button>
            </div>
            
            {/* Framework Selector */}
            <select
              value={framework}
              onChange={(e) => handleFrameworkChange(e.target.value as FrameworkType)}
              className="bg-black/40 text-cyan-400 border border-cyan-500/20 rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="react">React</option>
              <option value="react-native">React Native</option>
              <option value="flutter">Flutter</option>
              <option value="next">Next.js</option>
              <option value="expo">Expo</option>
            </select>
            
            {/* Build Type */}
            <select
              value={buildType}
              onChange={(e) => setBuildType(e.target.value as BuildType)}
              className="bg-black/40 text-cyan-400 border border-cyan-500/20 rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              {status === 'ready' && <Activity className="w-4 h-4 text-green-400 animate-pulse" />}
              {status === 'building' && <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />}
              {status === 'deploying' && <Cloud className="w-4 h-4 text-blue-400 animate-pulse" />}
              {status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
              {status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
              <span className="text-sm text-gray-400 capitalize">{status}</span>
            </div>
            
            {/* MCP Connection Status */}
            <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-lg border border-cyan-500/20">
              <div className={`w-2 h-2 rounded-full ${mcpTools.isConnected ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
              <span className="text-xs text-gray-400">
                {mcpTools.activeProvider || 'Local'} | {mcpTools.getEnabledTools().length} tools
              </span>
            </div>
            
            {/* Action Buttons */}
            <button
              onClick={buildApplication}
              disabled={status === 'building'}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 rounded-lg border border-cyan-500/40 hover:border-cyan-400 transition-all disabled:opacity-50"
            >
              <Package size={16} />
              <span>Build</span>
            </button>
            
            <button
              onClick={deployApplication}
              disabled={status !== 'success'}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded-lg border border-purple-500/40 hover:border-purple-400 transition-all disabled:opacity-50"
            >
              <Rocket size={16} />
              <span>Deploy</span>
            </button>
            
            <button
              onClick={exportProject}
              className="flex items-center gap-2 px-4 py-2 bg-black/40 text-gray-400 rounded-lg border border-gray-600/40 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Code Editor Panel */}
          <Panel defaultSize={40} minSize={20}>
            <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm">
              <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-cyan-900/30">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-medium">
                    {framework === 'flutter' ? 'Dart' : 'TypeScript'} Editor
                  </span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(getCurrentCode())}
                  className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
              
              <div className="flex-1">
                <MonacoEditor
                  value={getCurrentCode()}
                  onChange={(value) => value && setCurrentCode(value)}
                  language={framework === 'flutter' ? 'dart' : 'typescript'}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 }
                  }}
                />
              </div>
            </div>
          </Panel>
          
          <PanelResizeHandle className="w-2 bg-transparent hover:bg-cyan-500/20 transition-colors" />
          
          {/* Preview/Build/Deploy Panel */}
          <Panel defaultSize={35} minSize={20}>
            <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm">
              {/* Tab Selector */}
              <div className="flex items-center gap-2 px-4 py-2 bg-black/60 border-b border-cyan-900/30">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                    activeTab === 'preview' 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-gray-400 hover:text-cyan-400'
                  }`}
                >
                  <Eye size={14} />
                  <span className="text-sm">Preview</span>
                </button>
                <button
                  onClick={() => setActiveTab('build')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                    activeTab === 'build' 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-gray-400 hover:text-cyan-400'
                  }`}
                >
                  <Package size={14} />
                  <span className="text-sm">Build</span>
                </button>
                <button
                  onClick={() => setActiveTab('deploy')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                    activeTab === 'deploy' 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-gray-400 hover:text-cyan-400'
                  }`}
                >
                  <Rocket size={14} />
                  <span className="text-sm">Deploy</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                    activeTab === 'settings' 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-gray-400 hover:text-cyan-400'
                  }`}
                >
                  <Settings size={14} />
                  <span className="text-sm">Settings</span>
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="flex-1 overflow-auto">
                {activeTab === 'preview' && (
                  <div className="p-4">
                    <div className="bg-white rounded-lg shadow-2xl overflow-hidden" style={{ minHeight: '400px' }}>
                      {targetPlatform === 'web' ? (
                        <iframe
                          key={previewKey}
                          srcDoc={`
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                  body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                                </style>
                              </head>
                              <body>
                                <div id="root"></div>
                                <script type="module">
                                  ${webCode}
                                </script>
                              </body>
                            </html>
                          `}
                          className="w-full h-full"
                          style={{ minHeight: '400px' }}
                          sandbox="allow-scripts"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full p-8">
                          <div className="text-center">
                            <Smartphone className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                            <p className="text-gray-400 mb-4">
                              Mobile Preview ({targetPlatform})
                            </p>
                            <pre className="text-xs text-left bg-black/60 p-4 rounded-lg max-w-md overflow-auto">
                              {getCurrentCode().slice(0, 500)}...
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === 'build' && (
                  <div className="p-4">
                    <div className="bg-black/60 rounded-lg p-4 mb-4">
                      <h3 className="text-cyan-400 font-medium mb-4">Build Configuration</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400">App Name</label>
                          <input
                            value={buildConfig.appName}
                            onChange={(e) => setBuildConfig({...buildConfig, appName: e.target.value})}
                            className="w-full bg-black/40 text-cyan-400 border border-cyan-500/20 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Version</label>
                          <input
                            value={buildConfig.version}
                            onChange={(e) => setBuildConfig({...buildConfig, version: e.target.value})}
                            className="w-full bg-black/40 text-cyan-400 border border-cyan-500/20 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Bundle ID</label>
                          <input
                            value={buildConfig.bundleId}
                            onChange={(e) => setBuildConfig({...buildConfig, bundleId: e.target.value})}
                            className="w-full bg-black/40 text-cyan-400 border border-cyan-500/20 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">Output Directory</label>
                          <input
                            value={buildConfig.outputDir}
                            onChange={(e) => setBuildConfig({...buildConfig, outputDir: e.target.value})}
                            className="w-full bg-black/40 text-cyan-400 border border-cyan-500/20 rounded px-2 py-1 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-4">
                        <label className="flex items-center gap-2 text-sm text-gray-400">
                          <input
                            type="checkbox"
                            checked={buildConfig.optimizeImages}
                            onChange={(e) => setBuildConfig({...buildConfig, optimizeImages: e.target.checked})}
                            className="rounded"
                          />
                          Optimize Images
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-400">
                          <input
                            type="checkbox"
                            checked={buildConfig.treeshake}
                            onChange={(e) => setBuildConfig({...buildConfig, treeshake: e.target.checked})}
                            className="rounded"
                          />
                          Tree Shaking
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-400">
                          <input
                            type="checkbox"
                            checked={buildConfig.enableProguard}
                            onChange={(e) => setBuildConfig({...buildConfig, enableProguard: e.target.checked})}
                            className="rounded"
                          />
                          ProGuard
                        </label>
                      </div>
                    </div>
                    
                    {/* Build Output */}
                    <div className="bg-black/80 rounded-lg p-4 font-mono text-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400">Build Output</span>
                      </div>
                      <pre className="text-gray-400 whitespace-pre-wrap">
                        {buildOutput || 'Ready to build...'}
                      </pre>
                    </div>
                  </div>
                )}
                
                {activeTab === 'deploy' && (
                  <div className="p-4">
                    <div className="bg-black/60 rounded-lg p-4">
                      <h3 className="text-cyan-400 font-medium mb-4">Deployment Configuration</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-gray-400">Provider</label>
                          <select
                            value={deployConfig.provider}
                            onChange={(e) => setDeployConfig({...deployConfig, provider: e.target.value})}
                            className="w-full bg-black/40 text-cyan-400 border border-cyan-500/20 rounded px-2 py-1 text-sm"
                          >
                            <option value="vercel">Vercel</option>
                            <option value="netlify">Netlify</option>
                            <option value="aws">AWS</option>
                            <option value="firebase">Firebase</option>
                            <option value="appstore">App Store</option>
                            <option value="playstore">Play Store</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-xs text-gray-400">API Key</label>
                          <input
                            type="password"
                            value={deployConfig.apiKey}
                            onChange={(e) => setDeployConfig({...deployConfig, apiKey: e.target.value})}
                            placeholder="Enter your API key"
                            className="w-full bg-black/40 text-cyan-400 border border-cyan-500/20 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="text-xs text-gray-400">Project ID</label>
                          <input
                            value={deployConfig.projectId}
                            onChange={(e) => setDeployConfig({...deployConfig, projectId: e.target.value})}
                            placeholder="your-project-id"
                            className="w-full bg-black/40 text-cyan-400 border border-cyan-500/20 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-sm text-gray-400">
                            <input
                              type="checkbox"
                              checked={deployConfig.autoScale}
                              onChange={(e) => setDeployConfig({...deployConfig, autoScale: e.target.checked})}
                              className="rounded"
                            />
                            Auto Scale
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-400">
                            <input
                              type="checkbox"
                              checked={deployConfig.ssl}
                              onChange={(e) => setDeployConfig({...deployConfig, ssl: e.target.checked})}
                              className="rounded"
                            />
                            SSL/TLS
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'settings' && (
                  <div className="p-4">
                    <div className="bg-black/60 rounded-lg p-4">
                      <h3 className="text-cyan-400 font-medium mb-4">Platform Settings</h3>
                      <div className="space-y-4">
                        {(targetPlatform === 'android' || targetPlatform === 'all') && (
                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">Android Settings</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-500">Min SDK</label>
                                <input
                                  type="number"
                                  value={buildConfig.minSdkVersion}
                                  onChange={(e) => setBuildConfig({...buildConfig, minSdkVersion: parseInt(e.target.value)})}
                                  className="w-full bg-black/40 text-cyan-400 border border-cyan-500/20 rounded px-2 py-1 text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">Target SDK</label>
                                <input
                                  type="number"
                                  value={buildConfig.targetSdkVersion}
                                  onChange={(e) => setBuildConfig({...buildConfig, targetSdkVersion: parseInt(e.target.value)})}
                                  className="w-full bg-black/40 text-cyan-400 border border-cyan-500/20 rounded px-2 py-1 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {(targetPlatform === 'ios' || targetPlatform === 'all') && (
                          <div>
                            <h4 className="text-sm text-gray-400 mb-2">iOS Settings</h4>
                            <div>
                              <label className="text-xs text-gray-500">Deployment Target</label>
                              <input
                                value={buildConfig.iosDeploymentTarget}
                                onChange={(e) => setBuildConfig({...buildConfig, iosDeploymentTarget: e.target.value})}
                                className="w-full bg-black/40 text-cyan-400 border border-cyan-500/20 rounded px-2 py-1 text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Panel>
          
          <PanelResizeHandle className="w-2 bg-transparent hover:bg-cyan-500/20 transition-colors" />
          
          {/* AI Chat Panel */}
          <Panel defaultSize={25} minSize={20}>
            <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm">
              <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-cyan-900/30">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-cyan-400 text-sm font-medium">AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {mcpTools.getEnabledTools().length} tools | {mcpTools.getEnabledAgents().length} agents
                  </span>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/40'
                          : 'bg-purple-500/20 text-purple-100 border border-purple-500/40'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.toolsUsed && message.toolsUsed.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.toolsUsed.map((tool, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-black/40 rounded"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              
              {/* Input */}
              <div className="p-3 border-t border-cyan-900/30">
                <PromptInputBox
                  value={inputMessage}
                  onValueChange={setInputMessage}
                  onSend={() => handleSendMessage()}
                  isLoading={isProcessing}
                  placeholder={`Ask about ${framework} ${targetPlatform} development...`}
                  className="w-full"
                />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}