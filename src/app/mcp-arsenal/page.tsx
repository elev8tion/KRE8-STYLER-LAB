'use client';

import React, { useState, useMemo } from 'react';
import { Search, Code2, Bot, Shield, Palette, Database, Globe, Terminal, Zap, Layers, FileCode, Brain, Mic, Eye, Settings, GitBranch } from 'lucide-react';

const MCPArsenalPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedServer, setExpandedServer] = useState<string | null>(null);

  const categories = {
    all: { name: 'All Servers', icon: Layers, color: 'from-purple-600 to-blue-600' },
    flutter: { name: 'Flutter Development', icon: Code2, color: 'from-blue-500 to-cyan-500' },
    security: { name: 'Security & Testing', icon: Shield, color: 'from-red-500 to-orange-500' },
    ai: { name: 'AI & Intelligence', icon: Brain, color: 'from-purple-500 to-pink-500' },
    web: { name: 'Web Development', icon: Globe, color: 'from-green-500 to-teal-500' },
    automation: { name: 'Automation & Tools', icon: Zap, color: 'from-yellow-500 to-orange-500' },
    voice: { name: 'Voice & Media', icon: Mic, color: 'from-indigo-500 to-purple-500' },
    design: { name: 'Design & UI', icon: Palette, color: 'from-pink-500 to-rose-500' }
  };

  const mcpServers = [
    {
      id: 'claude-code',
      name: 'Claude Code Manager',
      category: 'automation',
      description: 'Core CLI tool with complete file system access and code management',
      capabilities: [
        'Full file system operations (Read, Write, Edit, MultiEdit)',
        'Git operations and PR management',
        'Bash command execution with parallel processing',
        'Web search and content fetching',
        'Task management with TodoWrite',
        'Agent orchestration for complex workflows',
        'Custom slash commands and hooks',
        'Jupyter notebook support'
      ],
      primaryTools: ['Read', 'Write', 'Edit', 'MultiEdit', 'Bash', 'Git', 'Task', 'TodoWrite'],
      status: 'active',
      power: 100
    },
    {
      id: 'flutter-genesis',
      name: 'Flutter Genesis',
      category: 'flutter',
      description: 'Complete Flutter app generation with pattern intelligence',
      capabilities: [
        'Full Flutter project creation with DRP validation',
        'Pattern analysis from 30+ production apps',
        'Workflow orchestration for different app types',
        'Enhanced output assembly for production-ready code',
        'Multi-server coordination across 9 MCP servers',
        'Business, social, e-commerce app templates'
      ],
      primaryTools: ['create_flutter_app', 'analyze_app_patterns', 'validate_project_drp'],
      status: 'active',
      power: 95
    },
    {
      id: 'flutter-forge',
      name: 'Flutter Forge',
      category: 'flutter',
      description: 'Advanced Flutter application generator with architecture patterns',
      capabilities: [
        'Clean, MVVM, MVC architecture patterns',
        'State management (Riverpod, Bloc, Provider, GetX)',
        'API service layer generation',
        'Comprehensive test generation',
        'Multi-platform support (iOS, Android, Web, Desktop)'
      ],
      primaryTools: ['generate_flutter_app', 'generate_state_management', 'generate_api_service'],
      status: 'active',
      power: 90
    },
    {
      id: 'voice-mode',
      name: 'Voice Mode System',
      category: 'voice',
      description: 'Complete voice conversation system with TTS/STT',
      capabilities: [
        'Real-time voice conversations with converse()',
        'Multiple TTS providers (OpenAI, Kokoro)',
        'Whisper STT integration',
        'LiveKit room-based audio',
        'Multi-language support',
        'Emotional speech with GPT-4o-mini',
        'Service management and monitoring'
      ],
      primaryTools: ['converse', 'service', 'voice_status', 'voice_statistics'],
      status: 'active',
      power: 88
    },
    {
      id: 'security-suite',
      name: 'Security Testing Suite',
      category: 'security',
      description: 'Comprehensive security testing and vulnerability assessment',
      capabilities: [
        'SQL injection testing and exploitation',
        'XSS vulnerability scanning and payload generation',
        'Subdomain enumeration with AI prediction',
        'Directory fuzzing and sensitive file discovery',
        'OWASP Top 10 vulnerability scanning',
        'WAF bypass techniques',
        'Automated bug bounty workflows',
        'Professional report generation'
      ],
      primaryTools: ['sqli-tester', 'xss-hunter', 'vuln-scanner', 'dir-fuzzer', 'report-gen'],
      status: 'active',
      power: 92
    },
    {
      id: 'web-visual-dev',
      name: 'Visual Web Development',
      category: 'web',
      description: 'Interactive web development with live preview',
      capabilities: [
        'Project creation (React, Vue, Svelte, Vanilla)',
        'Hot-reload development server',
        'Live browser preview with screenshots',
        'Component scaffolding',
        'Real-time file updates',
        'App template generation'
      ],
      primaryTools: ['create_project', 'start_dev_server', 'update_file', 'open_browser'],
      status: 'active',
      power: 85
    },
    {
      id: 'puppeteer-playwright',
      name: 'Browser Automation',
      category: 'automation',
      description: 'Advanced browser automation and testing',
      capabilities: [
        'Puppeteer integration for automation',
        'Playwright for FlutterFlow testing',
        'Screenshot and element capture',
        'Form filling and interaction',
        'JavaScript execution in browser',
        'Network request monitoring',
        'Multi-tab management'
      ],
      primaryTools: ['puppeteer_navigate', 'browser_click', 'browser_snapshot', 'browser_evaluate'],
      status: 'active',
      power: 87
    },
    {
      id: 'proxy-interceptor',
      name: 'Proxy Interceptor',
      category: 'security',
      description: 'HTTP/HTTPS proxy for security testing',
      capabilities: [
        'Request/response interception',
        'AI-powered vulnerability analysis',
        'Payload generation for testing',
        'Traffic replay with modifications',
        'SSL/TLS certificate management',
        'Export to multiple formats (HAR, Burp, ZAP)'
      ],
      primaryTools: ['start_proxy', 'intercept_request', 'analyze_request', 'generate_payloads'],
      status: 'active',
      power: 86
    },
    {
      id: 'intelligent-agents',
      name: 'Intelligent Agent System',
      category: 'ai',
      description: 'Specialized AI agents for complex tasks',
      capabilities: [
        '40+ specialized agents (frontend, backend, DevOps, AI)',
        'Whimsy injector for delightful UX',
        'Sprint prioritizer for 6-day cycles',
        'Studio coach for agent coordination',
        'Test writer and fixer',
        'Trend researcher and feedback synthesizer',
        'Performance benchmarker'
      ],
      primaryTools: ['Task', 'studio-coach', 'whimsy-injector', 'sprint-prioritizer'],
      status: 'active',
      power: 94
    },
    {
      id: 'claude-styler',
      name: 'Claude Output Styler',
      category: 'design',
      description: 'Customize Claude\'s response style and formatting',
      capabilities: [
        'Multiple built-in styles (YAML, Table, Ultra-concise)',
        'Custom style creation with natural language',
        'Status line configuration',
        'Output formatting control',
        'Response optimization for different use cases'
      ],
      primaryTools: ['switch_style', 'create_custom_style', 'configure_status_line'],
      status: 'active',
      power: 82
    },
    {
      id: 'code-architecture',
      name: 'Code Architecture Analyzer',
      category: 'ai',
      description: 'Deep code analysis and architecture understanding',
      capabilities: [
        'GitHub repository architecture analysis',
        'Framework and library deep analysis',
        'Blueprint generation for rebuilding projects',
        'API discovery and analysis',
        'Database schema generation from APIs',
        'Intelligent file context and impact analysis'
      ],
      primaryTools: ['analyze_repository', 'generate_blueprint', 'discover_api', 'file_context'],
      status: 'active',
      power: 91
    },
    {
      id: 'flutterflow-automation',
      name: 'FlutterFlow Automation',
      category: 'flutter',
      description: 'Browser automation for FlutterFlow development',
      capabilities: [
        'Automated FlutterFlow login and navigation',
        'Widget creation and property setting',
        'Code export automation',
        'Screenshot capture of designs',
        'Element interaction and form filling'
      ],
      primaryTools: ['navigate_to_project', 'create_widget', 'set_property', 'export_code'],
      status: 'active',
      power: 83
    },
    {
      id: 'react-components',
      name: 'React Component Library',
      category: 'web',
      description: 'Comprehensive React and React Native component database',
      capabilities: [
        'Component search and discovery',
        'Detailed component documentation',
        'React Native specific components',
        'Category-based filtering',
        'Code examples and usage patterns'
      ],
      primaryTools: ['search_components', 'get_component_info', 'fetch_documentation'],
      status: 'active',
      power: 84
    },
    {
      id: 'excalidraw',
      name: 'Excalidraw Diagramming',
      category: 'design',
      description: 'Programmatic diagram and flowchart creation',
      capabilities: [
        'Canvas creation and management',
        'Shape and element addition',
        'Automatic flowchart generation',
        'Layout algorithms (tree, grid, circular)',
        'Export to PNG, SVG, PDF, JSON'
      ],
      primaryTools: ['create_canvas', 'add_element', 'create_flowchart', 'apply_layout'],
      status: 'active',
      power: 80
    },
    {
      id: 'livekit-system',
      name: 'LiveKit Voice Infrastructure',
      category: 'voice',
      description: 'LiveKit server and frontend management',
      capabilities: [
        'LiveKit server installation and management',
        'Voice assistant frontend deployment',
        'Service configuration and monitoring',
        'Real-time audio room management'
      ],
      primaryTools: ['livekit_install', 'livekit_frontend_start', 'service'],
      status: 'active',
      power: 85
    }
  ];

  const filteredServers = useMemo(() => {
    return mcpServers.filter(server => {
      const matchesCategory = selectedCategory === 'all' || server.category === selectedCategory;
      const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           server.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           server.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const totalPower = useMemo(() => {
    return Math.round(mcpServers.reduce((sum, server) => sum + server.power, 0) / mcpServers.length);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl">
              <Layers className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
            MCP Development Arsenal
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Complete suite of {mcpServers.length} MCP servers powering local LLMs with advanced capabilities
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
              <span className="text-green-400 font-semibold">{mcpServers.filter(s => s.status === 'active').length} Active</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
              <span className="text-purple-400 font-semibold">{totalPower}% Power</span>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search servers, tools, or capabilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(categories).map(([key, category]) => {
              const Icon = category.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === key
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Server Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServers.map((server) => {
            const categoryInfo = categories[server.category as keyof typeof categories];
            const Icon = categoryInfo.icon;
            
            return (
              <div
                key={server.id}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div
                  className={`h-2 bg-gradient-to-r ${categoryInfo.color}`}
                />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-gradient-to-br ${categoryInfo.color} rounded-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                        <span className="text-xs text-gray-500">{server.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">{server.power}%</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{server.description}</p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Key Tools</span>
                        <button
                          onClick={() => setExpandedServer(expandedServer === server.id ? null : server.id)}
                          className="text-xs text-purple-400 hover:text-purple-300"
                        >
                          {expandedServer === server.id ? 'Less' : 'More'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {server.primaryTools.slice(0, 3).map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md"
                          >
                            {tool}
                          </span>
                        ))}
                        {server.primaryTools.length > 3 && (
                          <span className="px-2 py-1 text-gray-500 text-xs">
                            +{server.primaryTools.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {expandedServer === server.id && (
                      <div className="pt-3 border-t border-gray-700/50 space-y-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Capabilities</span>
                        <ul className="space-y-1">
                          {server.capabilities.map((capability, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span className="text-xs text-gray-400">{capability}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Power Level</span>
                      <div className="flex-1 mx-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${categoryInfo.color} transition-all duration-500`}
                          style={{ width: `${server.power}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{server.power}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                {mcpServers.length}
              </div>
              <div className="text-sm text-gray-500">Total Servers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                200+
              </div>
              <div className="text-sm text-gray-500">Available Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                {Object.keys(categories).length - 1}
              </div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {totalPower}%
              </div>
              <div className="text-sm text-gray-500">System Power</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MCPArsenalPage;