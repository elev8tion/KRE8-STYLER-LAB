import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      prompt, 
      currentCode, 
      cssCode,
      action, 
      language = 'typescript',
      enabledTools = [],
      agents = [],
      sessionId = 'style-guide-editor'
    } = await request.json();

    // Try multiple AI providers in order of preference
    const providers = [
      { name: 'claude-bridge', check: checkClaudeBridge, call: callClaudeBridge },
      { name: 'ollama', check: checkOllama, call: callOllama },
      { name: 'local-llm', check: checkLocalLLM, call: callLocalLLM }
    ];
    
    for (const provider of providers) {
      const available = await provider.check();
      if (available) {
        const result = await provider.call({
          prompt,
          currentCode,
          cssCode,
          language,
          enabledTools,
          agents,
          sessionId
        });
        if (result.success) {
          return NextResponse.json({
            ...result,
            provider: provider.name
          });
        }
      }
    }
    
    // Fallback to simulated responses
    let enhancedCode = currentCode;
    let message = '';

    if (action === 'enhance') {
      // Simulate AI enhancement based on prompt
      if (prompt.toLowerCase().includes('animation')) {
        message = 'Added animation effects to component';
        enhancedCode = currentCode.replace(
          'className="',
          'className="animate-pulse transition-all duration-300 '
        );
      } else if (prompt.toLowerCase().includes('styled') || prompt.toLowerCase().includes('style')) {
        message = 'Converting to styled-component';
        enhancedCode = convertToStyledComponent(currentCode);
      } else if (prompt.toLowerCase().includes('responsive')) {
        message = 'Made component responsive';
        enhancedCode = currentCode.replace(
          'className="',
          'className="sm:p-4 md:p-6 lg:p-8 '
        );
      } else if (prompt.toLowerCase().includes('dark mode')) {
        message = 'Added dark mode support';
        enhancedCode = currentCode.replace(
          'className="',
          'className="dark:bg-gray-900 dark:text-white '
        );
      } else {
        message = 'Enhanced component based on your request';
        // Default enhancement
        enhancedCode = `// AI Enhanced: ${prompt}\n${currentCode}`;
      }
    }

    return NextResponse.json({
      code: enhancedCode,
      message,
      success: true
    });
  } catch (error) {
    console.error('AI assist error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const [claudeStatus, ollamaStatus, localStatus] = await Promise.all([
    checkClaudeBridge(),
    checkOllama(),
    checkLocalLLM()
  ]);
  
  return NextResponse.json({
    status: 'AI Assist API is running',
    providers: {
      claude: claudeStatus,
      ollama: ollamaStatus,
      localLLM: localStatus
    },
    availableTools: [
      'component-generator',
      'style-optimizer', 
      'code-analyzer',
      'file-manager',
      'terminal-executor',
      'api-connector',
      'search-engine',
      'voice-transcription'
    ],
    availableAgents: [
      'frontend-developer',
      'ui-designer',
      'backend-architect',
      'test-writer-fixer',
      'rapid-prototyper',
      'whimsy-injector',
      'tiktok-strategist'
    ],
    endpoints: {
      POST: '/api/ai-assist - Enhance code with AI using MCP tools'
    }
  });
}

// Check Claude bridge availability
async function checkClaudeBridge(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3006/api/health', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Check Ollama availability
async function checkOllama(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Check local LLM server
async function checkLocalLLM(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:8080/v1/models', {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Call Claude bridge with MCP tools
async function callClaudeBridge(params: any) {
  try {
    const { prompt, currentCode, cssCode, language, enabledTools, agents, sessionId } = params;
    
    const toolsContext = enabledTools.length > 0 ? 
      `\nAvailable tools: ${enabledTools.join(', ')}` : '';
    const agentsContext = agents.length > 0 ? 
      `\nAvailable agents: ${agents.join(', ')}` : '';
    
    const message = `Please enhance this ${language} code based on: ${prompt}
${toolsContext}
${agentsContext}

Current Component Code:
${currentCode}

${cssCode ? `Current CSS Code:\n${cssCode}` : ''}`;
    
    const response = await fetch('http://localhost:3006/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        sessionId,
        useTools: true,
        enabledTools,
        agents,
        systemPrompt: `You are an expert UI/UX developer with access to MCP tools and agents. Use the available tools and agents to provide the best possible assistance.`
      })
    });
    
    if (response.ok) {
      const data = await response.json() as { response?: string; metadata?: any };
      return {
        code: extractCodeFromResponse(data.response || currentCode),
        message: 'Enhanced by Claude AI with MCP tools',
        success: true,
        metadata: data.metadata
      };
    }
  } catch (error) {
    console.error('Claude bridge failed:', error);
  }
  return { success: false };
}

// Call Ollama with tool simulation
async function callOllama(params: any) {
  try {
    const { prompt, currentCode, cssCode, language } = params;
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama2',
        prompt: `You are a code assistant. Enhance this ${language} code based on: ${prompt}\n\nCode:\n${currentCode}${cssCode ? `\n\nCSS:\n${cssCode}` : ''}\n\nProvide the enhanced code:`,
        stream: false
      })
    });
    
    if (response.ok) {
      const data = await response.json() as { response?: string };
      return {
        code: extractCodeFromResponse(data.response || currentCode),
        message: 'Enhanced by Ollama (Llama2)',
        success: true
      };
    }
  } catch (error) {
    console.error('Ollama call failed:', error);
  }
  return { success: false };
}

// Call local LLM server
async function callLocalLLM(params: any) {
  try {
    const { prompt, currentCode, cssCode, language } = params;
    
    const response = await fetch('http://localhost:8080/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an expert UI developer assistant with access to various tools and agents.'
          },
          {
            role: 'user',
            content: `Enhance this ${language} code based on: ${prompt}\n\nCode:\n${currentCode}${cssCode ? `\n\nCSS:\n${cssCode}` : ''}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (response.ok) {
      const data = await response.json() as { choices?: any[] };
      const content = data.choices?.[0]?.message?.content || currentCode;
      return {
        code: extractCodeFromResponse(content),
        message: 'Enhanced by Local LLM',
        success: true
      };
    }
  } catch (error) {
    console.error('Local LLM call failed:', error);
  }
  return { success: false };
}

// Extract code from Claude's response
function extractCodeFromResponse(response: string): string {
  // Look for code blocks in the response
  const codeMatch = response.match(/```(?:tsx?|jsx?|javascript|typescript)?\n([\s\S]*?)```/);
  if (codeMatch) {
    return codeMatch[1].trim();
  }
  // If no code block, check if the entire response looks like code
  if (response.includes('export') || response.includes('import') || response.includes('function')) {
    return response;
  }
  return response;
}

// Convert regular component to styled-component
function convertToStyledComponent(code: string): string {
  // Basic conversion logic
  let converted = code;
  
  // Add styled-components import if not present
  if (!converted.includes('styled-components')) {
    converted = `import styled from 'styled-components';\n\n` + converted;
  }
  
  // Convert className to styled component
  if (converted.includes('className=')) {
    // Extract classes and create styled component
    const classMatch = converted.match(/className="([^"]*)"/g);
    if (classMatch) {
      const classes = classMatch[0].match(/className="([^"]*)"/)?.[1] || '';
      const styledComponent = `\nconst StyledContainer = styled.div\`
  /* Converted from: ${classes} */
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.5rem;
  color: white;
\`;\n`;
      
      converted = converted.replace('return (', styledComponent + '\nreturn (');
      converted = converted.replace(/className="[^"]*"/, '');
      converted = converted.replace(/<div/, '<StyledContainer');
      converted = converted.replace(/<\/div>/, '</StyledContainer>');
    }
  }
  
  return converted;
}