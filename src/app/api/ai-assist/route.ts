import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request: NextRequest) {
  try {
    const { prompt, currentCode, action, language = 'typescript' } = await request.json();

    // Try to use the Claude bridge if available
    const bridgeAvailable = await checkBridgeConnection();
    
    if (bridgeAvailable) {
      // Use Claude bridge for real AI assistance
      const enhancedResult = await callClaudeBridge(prompt, currentCode, language);
      if (enhancedResult.success) {
        return NextResponse.json(enhancedResult);
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
  const bridgeStatus = await checkBridgeConnection();
  return NextResponse.json({
    status: 'AI Assist API is running',
    bridgeConnected: bridgeStatus,
    endpoints: {
      POST: '/api/ai-assist - Enhance code with AI'
    }
  });
}

// Helper function to check bridge connection
async function checkBridgeConnection(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3006/api/health', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Helper function to call Claude bridge
async function callClaudeBridge(prompt: string, code: string, language: string) {
  try {
    const message = `Please enhance this ${language} code based on: ${prompt}\n\nCode:\n${code}`;
    
    const response = await fetch('http://localhost:3006/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        sessionId: 'style-guide-editor',
        useTools: true
      })
    });
    
    if (response.ok) {
      const data = await response.json() as { response?: string };
      return {
        code: extractCodeFromResponse(data.response || code),
        message: 'Enhanced by Claude AI',
        success: true
      };
    }
  } catch (error) {
    console.error('Bridge call failed:', error);
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