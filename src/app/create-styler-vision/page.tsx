'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Zap, Code2, Palette, Database, Cloud, Brain, 
  Rocket, Building, Users, Globe, Shield, Mic, Video, 
  FileCode, Bot, Layers, GitBranch, Package, Terminal,
  Cpu, Activity, BarChart, Lock, Infinity, ArrowRight,
  Play, Pause, RefreshCw, ChevronRight, Star
} from 'lucide-react';

const CreateStylerVisionPage = () => {
  const [activeCategory, setActiveCategory] = useState('apps');
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState(0);
  const [creationCounter, setCreationCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnimating) {
        setCreationCounter(prev => prev + Math.floor(Math.random() * 10) + 1);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isAnimating]);

  const categories = {
    apps: {
      name: 'Application Generation',
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
      tools: [
        'create.app.flutter', 'create.app.react', 'create.app.vue',
        'create.app.native', 'create.app.electron', 'create.app.pwa',
        'create.app.game', 'create.app.ar', 'create.app.blockchain'
      ],
      count: 400
    },
    design: {
      name: 'Design & UI',
      icon: Palette,
      color: 'from-purple-500 to-pink-500',
      tools: [
        'create.design.system', 'create.design.figma', 'create.design.components',
        'create.design.logos', 'create.design.animations', 'create.design.3d',
        'create.design.icons', 'create.design.themes', 'create.design.mockups'
      ],
      count: 350
    },
    backend: {
      name: 'Backend & Infrastructure',
      icon: Database,
      color: 'from-green-500 to-emerald-500',
      tools: [
        'create.backend.api', 'create.backend.microservices', 'create.backend.serverless',
        'create.backend.database', 'create.backend.auth', 'create.backend.realtime',
        'create.backend.queue', 'create.backend.ml', 'create.backend.blockchain'
      ],
      count: 300
    },
    content: {
      name: 'Content Generation',
      icon: FileCode,
      color: 'from-orange-500 to-red-500',
      tools: [
        'create.content.docs', 'create.content.blog', 'create.content.marketing',
        'create.content.social', 'create.content.video', 'create.content.course',
        'create.content.book', 'create.content.presentation', 'create.content.email'
      ],
      count: 250
    },
    ai: {
      name: 'AI & Machine Learning',
      icon: Brain,
      color: 'from-indigo-500 to-purple-500',
      tools: [
        'create.ai.model', 'create.ai.dataset', 'create.ai.pipeline',
        'create.ai.agent', 'create.ai.rag', 'create.ai.fine-tune',
        'create.ai.vision', 'create.ai.nlp', 'create.ai.embedding'
      ],
      count: 200
    },
    devops: {
      name: 'DevOps & Automation',
      icon: GitBranch,
      color: 'from-yellow-500 to-orange-500',
      tools: [
        'create.devops.ci', 'create.devops.docker', 'create.devops.k8s',
        'create.devops.terraform', 'create.devops.monitoring', 'create.devops.security',
        'create.devops.backup', 'create.devops.scaling', 'create.devops.testing'
      ],
      count: 180
    }
  };

  const workflows = [
    {
      name: '10-Minute Startup',
      icon: Rocket,
      steps: [
        'Voice: "Create subscription box for developers"',
        '→ Business plan generated',
        '→ Landing page created',
        '→ Payment system integrated',
        '→ Email automation setup',
        '→ Analytics configured',
        '→ Deployed to production'
      ],
      time: '10 minutes',
      color: 'from-purple-600 to-blue-600'
    },
    {
      name: 'Instant Pivot',
      icon: RefreshCw,
      steps: [
        'Voice: "Convert B2C to B2B SaaS"',
        '→ Multi-tenant architecture',
        '→ Team management built',
        '→ Billing system updated',
        '→ Admin panel created',
        '→ API docs generated',
        '→ Enterprise features added'
      ],
      time: '15 minutes',
      color: 'from-green-600 to-teal-600'
    },
    {
      name: 'Content Factory',
      icon: FileCode,
      steps: [
        'Voice: "30-day AI content calendar"',
        '→ 30 blog posts written',
        '→ 60 social posts created',
        '→ 10 video scripts generated',
        '→ 5 newsletters composed',
        '→ 1 eBook compiled',
        '→ Course outline developed'
      ],
      time: '5 minutes',
      color: 'from-orange-600 to-red-600'
    },
    {
      name: 'App Cloner',
      icon: Package,
      steps: [
        'Voice: "Instagram for books"',
        '→ Architecture designed',
        '→ Book cover sharing built',
        '→ Reading lists created',
        '→ Review system added',
        '→ Gamification integrated',
        '→ Publishing connected'
      ],
      time: '20 minutes',
      color: 'from-indigo-600 to-purple-600'
    }
  ];

  const capabilities = [
    { icon: Infinity, label: 'Unlimited Creation', value: '∞' },
    { icon: Zap, label: 'Tools Available', value: '1000+' },
    { icon: Activity, label: 'Creations/Hour', value: '120+' },
    { icon: Cloud, label: 'Cloud Required', value: 'ZERO' },
    { icon: Lock, label: 'Privacy', value: '100%' },
    { icon: BarChart, label: 'Cost', value: '$0' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10" />
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <Sparkles className="w-3 h-3 text-purple-400/30" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-8 py-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 blur-3xl opacity-50" />
              <div className="relative p-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              /create styler
            </span>
          </h1>
          <p className="text-2xl text-gray-300 mb-2">MCP Server for Infinite Creation</p>
          <p className="text-lg text-gray-500">Transform Local LLMs into Omnipotent Creation Engines</p>
          
          <div className="mt-8 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400">100% Local</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-blue-400">Zero Cloud</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-purple-400">Unlimited Power</span>
            </div>
          </div>
        </header>

        {/* Live Counter */}
        <div className="px-8 mb-12">
          <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Activity className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Creations Possible</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {creationCounter.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className="p-3 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 transition-colors"
              >
                {isAnimating ? <Pause className="w-5 h-5 text-purple-400" /> : <Play className="w-5 h-5 text-purple-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Tool Categories */}
        <div className="px-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Creation Categories</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(categories).map(([key, category]) => {
              const Icon = category.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`p-4 rounded-xl transition-all transform hover:scale-105 ${
                    activeCategory === key
                      ? 'bg-gradient-to-br ' + category.color + ' shadow-2xl'
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2 text-white" />
                  <p className="text-xs text-white font-medium">{category.name}</p>
                  <p className="text-lg font-bold text-white mt-1">{category.count}+</p>
                  <p className="text-xs text-white/70">tools</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Category Tools */}
        <div className="px-8 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <categories[activeCategory].icon className="w-6 h-6" />
                {categories[activeCategory].name} Tools
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories[activeCategory].tools.map((tool) => (
                  <div
                    key={tool}
                    className="p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all"
                  >
                    <code className="text-sm text-cyan-400">{tool}</code>
                  </div>
                ))}
                <div className="p-3 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30 flex items-center justify-center">
                  <span className="text-sm text-purple-400">+{categories[activeCategory].count - 9} more</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflows */}
        <div className="px-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Game-Changing Workflows</h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
            {workflows.map((workflow, index) => {
              const Icon = workflow.icon;
              return (
                <div
                  key={index}
                  onClick={() => setSelectedWorkflow(index)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all transform hover:scale-[1.02] ${
                    selectedWorkflow === index
                      ? 'bg-gradient-to-br ' + workflow.color + ' shadow-2xl'
                      : 'bg-gray-900/50 border border-gray-800 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${workflow.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{workflow.name}</h3>
                      <div className="space-y-1">
                        {workflow.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-gray-500" />
                            <span className="text-sm text-gray-300">{step}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-semibold text-green-400">
                          Time: {workflow.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="px-8 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {capabilities.map((cap, index) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all"
                  >
                    <Icon className="w-6 h-6 text-purple-400 mb-2" />
                    <p className="text-2xl font-bold text-white">{cap.value}</p>
                    <p className="text-xs text-gray-400">{cap.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="px-8 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="relative p-8 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-purple-900/20 rounded-3xl border border-purple-500/20">
              <div className="absolute top-4 right-4">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">The Ultimate Vision</h3>
              <p className="text-gray-300 mb-6">
                Every local LLM becomes a complete development team, creative studio, startup accelerator, and innovation lab. 
                Build anything, design everything, deploy everywhere - all in minutes, not months.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <p className="text-sm text-purple-400 mb-2">From Idea</p>
                  <p className="text-white font-semibold">Voice Command</p>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <p className="text-sm text-blue-400 mb-2">To Reality</p>
                  <p className="text-white font-semibold">Full Application</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center">
                <div className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                  <p className="text-white font-bold">Time: Minutes • Cost: $0 • Limit: None</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-8 py-8 border-t border-gray-800">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
              "Why imagine the future when you can create it in minutes?"
            </p>
            <p className="text-gray-500">
              /create styler MCP Server • 1000+ Tools • 100% Local • Infinite Possibilities
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CreateStylerVisionPage;