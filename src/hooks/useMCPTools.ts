import { useState, useEffect, useCallback } from 'react';
import { getMCPBridge } from '@/lib/mcp-bridge';

interface MCPTool {
  name: string;
  description: string;
  parameters?: any;
  enabled: boolean;
}

interface MCPAgent {
  name: string;
  description: string;
  capabilities: string[];
  enabled: boolean;
}

interface MCPToolsState {
  tools: MCPTool[];
  agents: MCPAgent[];
  isConnected: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  activeProvider: string | null;
}

const DEFAULT_TOOLS: MCPTool[] = [
  {
    name: 'component-generator',
    description: 'Generate React components with TypeScript and styled-components',
    enabled: true
  },
  {
    name: 'style-optimizer',
    description: 'Optimize CSS and styled-components for performance',
    enabled: true
  },
  {
    name: 'code-analyzer',
    description: 'Analyze code for bugs, performance issues, and best practices',
    enabled: true
  },
  {
    name: 'file-manager',
    description: 'Read, write, and manage project files',
    enabled: true
  },
  {
    name: 'terminal-executor',
    description: 'Execute terminal commands and scripts',
    enabled: true
  },
  {
    name: 'api-connector',
    description: 'Connect to APIs and fetch data',
    enabled: true
  },
  {
    name: 'search-engine',
    description: 'Search documentation and code examples',
    enabled: true
  },
  {
    name: 'voice-transcription',
    description: 'Transcribe voice input to text',
    enabled: true
  }
];

const DEFAULT_AGENTS: MCPAgent[] = [
  {
    name: 'frontend-developer',
    description: 'Expert in React, TypeScript, and modern frontend development',
    capabilities: ['component-development', 'state-management', 'performance-optimization'],
    enabled: true
  },
  {
    name: 'ui-designer',
    description: 'Specialist in UI/UX design and component styling',
    capabilities: ['design-systems', 'responsive-design', 'animations'],
    enabled: true
  },
  {
    name: 'backend-architect',
    description: 'Expert in API design and backend architecture',
    capabilities: ['api-design', 'database-modeling', 'security'],
    enabled: true
  },
  {
    name: 'test-writer-fixer',
    description: 'Specialist in writing and fixing tests',
    capabilities: ['unit-testing', 'integration-testing', 'e2e-testing'],
    enabled: true
  },
  {
    name: 'rapid-prototyper',
    description: 'Quick MVP and prototype builder',
    capabilities: ['rapid-development', 'scaffolding', 'prototyping'],
    enabled: true
  },
  {
    name: 'whimsy-injector',
    description: 'Adds delightful animations and interactions',
    capabilities: ['animations', 'micro-interactions', 'creative-design'],
    enabled: true
  },
  {
    name: 'tiktok-strategist',
    description: 'Expert in viral content and social media integration',
    capabilities: ['viral-features', 'social-sharing', 'engagement-optimization'],
    enabled: true
  }
];

export function useMCPTools() {
  const [state, setState] = useState<MCPToolsState>({
    tools: DEFAULT_TOOLS,
    agents: DEFAULT_AGENTS,
    isConnected: false,
    connectionStatus: 'disconnected',
    activeProvider: null
  });

  const [bridge] = useState(() => getMCPBridge());

  useEffect(() => {
    // Set up bridge event listeners
    const handleConnected = () => {
      setState(prev => ({
        ...prev,
        isConnected: true,
        connectionStatus: 'connected',
        activeProvider: 'claude-bridge'
      }));
    };

    const handleDisconnected = () => {
      setState(prev => ({
        ...prev,
        isConnected: false,
        connectionStatus: 'disconnected',
        activeProvider: null
      }));
    };

    const handleMessage = (data: any) => {
      if (data.type === 'tools_update') {
        setState(prev => ({
          ...prev,
          tools: data.tools || prev.tools
        }));
      } else if (data.type === 'agents_update') {
        setState(prev => ({
          ...prev,
          agents: data.agents || prev.agents
        }));
      }
    };

    bridge.on('connected', handleConnected);
    bridge.on('disconnected', handleDisconnected);
    bridge.on('message', handleMessage);

    // Try to connect
    bridge.connect();

    // Check alternative providers if bridge fails
    const checkProviders = async () => {
      try {
        const response = await fetch('/api/ai-assist');
        if (response.ok) {
          const data = await response.json();
          
          if (!bridge.isConnected()) {
            if (data.providers?.ollama) {
              setState(prev => ({
                ...prev,
                activeProvider: 'ollama',
                connectionStatus: 'connected'
              }));
            } else if (data.providers?.localLLM) {
              setState(prev => ({
                ...prev,
                activeProvider: 'local-llm',
                connectionStatus: 'connected'
              }));
            }
          }

          // Update available tools and agents from API
          if (data.availableTools) {
            const tools = data.availableTools.map((name: string) => ({
              name,
              description: DEFAULT_TOOLS.find(t => t.name === name)?.description || '',
              enabled: true
            }));
            setState(prev => ({ ...prev, tools }));
          }

          if (data.availableAgents) {
            const agents = data.availableAgents.map((name: string) => {
              const defaultAgent = DEFAULT_AGENTS.find(a => a.name === name);
              return {
                name,
                description: defaultAgent?.description || '',
                capabilities: defaultAgent?.capabilities || [],
                enabled: true
              };
            });
            setState(prev => ({ ...prev, agents }));
          }
        }
      } catch (error) {
        console.error('Failed to check AI providers:', error);
      }
    };

    checkProviders();

    return () => {
      bridge.off('connected', handleConnected);
      bridge.off('disconnected', handleDisconnected);
      bridge.off('message', handleMessage);
    };
  }, [bridge]);

  const toggleTool = useCallback((toolName: string) => {
    setState(prev => ({
      ...prev,
      tools: prev.tools.map(tool =>
        tool.name === toolName ? { ...tool, enabled: !tool.enabled } : tool
      )
    }));
  }, []);

  const toggleAgent = useCallback((agentName: string) => {
    setState(prev => ({
      ...prev,
      agents: prev.agents.map(agent =>
        agent.name === agentName ? { ...agent, enabled: !agent.enabled } : agent
      )
    }));
  }, []);

  const executeTool = useCallback(async (toolName: string, parameters: any) => {
    if (bridge.isConnected()) {
      return bridge.request({
        type: 'execute_tool',
        tool: toolName,
        parameters
      });
    }
    
    // Fallback to API endpoint
    const response = await fetch('/api/ai-assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'execute_tool',
        tool: toolName,
        parameters,
        enabledTools: state.tools.filter(t => t.enabled).map(t => t.name)
      })
    });

    if (response.ok) {
      return response.json();
    }
    
    throw new Error('Failed to execute tool');
  }, [bridge, state.tools]);

  const invokeAgent = useCallback(async (agentName: string, task: string) => {
    if (bridge.isConnected()) {
      return bridge.request({
        type: 'invoke_agent',
        agent: agentName,
        task
      });
    }

    // Fallback to API endpoint
    const response = await fetch('/api/ai-assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'invoke_agent',
        agent: agentName,
        task,
        agents: state.agents.filter(a => a.enabled).map(a => a.name)
      })
    });

    if (response.ok) {
      return response.json();
    }

    throw new Error('Failed to invoke agent');
  }, [bridge, state.agents]);

  const reconnect = useCallback(() => {
    bridge.connect();
  }, [bridge]);

  return {
    ...state,
    toggleTool,
    toggleAgent,
    executeTool,
    invokeAgent,
    reconnect,
    getEnabledTools: () => state.tools.filter(t => t.enabled),
    getEnabledAgents: () => state.agents.filter(a => a.enabled)
  };
}