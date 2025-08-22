'use client';

import React, { useMemo, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ComponentRendererProps {
  code: string;
  css: string;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
      <h3 className="text-red-400 font-bold mb-2">Component Error</h3>
      <pre className="text-sm text-red-300 overflow-auto mb-3">{error.message}</pre>
      <button 
        onClick={resetErrorBoundary}
        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

export default function ComponentRenderer({ code, css }: ComponentRendererProps) {
  const [renderKey, setRenderKey] = React.useState(0);

  const Component = useMemo(() => {
    try {
      // Clean the code
      const cleanCode = code
        .replace(/^import.*$/gm, '')
        .replace(/^export\s+default\s+/gm, '')
        .replace(/^export\s+/gm, '');

      // Extract function name
      const functionMatch = cleanCode.match(/function\s+(\w+)/);
      const componentName = functionMatch ? functionMatch[1] : 'Component';

      // Create component with proper scope
      const componentFactory = new Function(
        'React',
        `
        const { useState, useEffect, useCallback, useMemo, useRef } = React;
        ${cleanCode}
        
        // Return the component
        if (typeof ${componentName} !== 'undefined') {
          return ${componentName};
        }
        
        // Fallback for inline components
        return function() {
          return React.createElement('div', { 
            className: 'p-4 text-gray-400' 
          }, 'No component found');
        };
        `
      );

      return componentFactory(React);
    } catch (error) {
      console.error('Component parsing error:', error);
      return () => (
        <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">Syntax Error</p>
          <p className="text-yellow-300 text-sm">{String(error)}</p>
        </div>
      );
    }
  }, [code]);

  // Inject styles with proper scoping
  useEffect(() => {
    if (!css) return;
    
    const styleId = 'component-preview-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    // Scope styles to preview container
    const scopedCss = css.split('}').map(rule => {
      if (rule.trim()) {
        const [selector, ...styles] = rule.split('{');
        if (selector && styles.length) {
          // Don't scope animation keyframes
          if (selector.includes('@keyframes')) {
            return rule + '}';
          }
          return `.component-preview ${selector.trim()} { ${styles.join('{').trim()} }`;
        }
      }
      return '';
    }).filter(Boolean).join('\n');
    
    styleElement.textContent = scopedCss;
    
    return () => {
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [css]);

  const handleReset = () => {
    setRenderKey(prev => prev + 1);
  };

  return (
    <div className="component-preview h-full w-full p-4 overflow-auto bg-gray-950/50 rounded-lg">
      <ErrorBoundary 
        key={renderKey}
        FallbackComponent={ErrorFallback} 
        onReset={handleReset}
      >
        <Component />
      </ErrorBoundary>
    </div>
  );
}