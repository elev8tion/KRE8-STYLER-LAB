export type ComponentType = 'standard' | 'styled';

export function detectComponentType(code: string): ComponentType {
  // Check for styled-components imports or usage
  const styledImportRegex = /import\s+styled\s+from\s+['"]styled-components['"]/;
  const styledUsageRegex = /styled\.\w+`|styled\([^)]+\)`/;
  
  if (styledImportRegex.test(code) || styledUsageRegex.test(code)) {
    return 'styled';
  }
  
  return 'standard';
}

export function convertToStyledComponent(code: string, css: string): string {
  // Extract component name
  const componentMatch = code.match(/function\s+(\w+)/);
  const componentName = componentMatch ? componentMatch[1] : 'MyComponent';
  
  // Parse CSS to extract class names and their styles
  const classStyles: Record<string, string> = {};
  const cssRules = css.match(/\.([a-zA-Z0-9_-]+)\s*{([^}]+)}/g) || [];
  
  cssRules.forEach(rule => {
    const match = rule.match(/\.([a-zA-Z0-9_-]+)\s*{([^}]+)}/);
    if (match) {
      const className = match[1];
      const styles = match[2].trim();
      classStyles[className] = styles;
    }
  });
  
  // Create styled components
  const styledComponents: string[] = [];
  const componentMap: Record<string, string> = {};
  
  Object.entries(classStyles).forEach(([className, styles]) => {
    // Convert className to PascalCase for styled component
    const styledName = className
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    
    // Determine the HTML element type based on class name or default to div
    let element = 'div';
    if (className.includes('btn') || className.includes('button')) element = 'button';
    if (className.includes('title') || className.includes('heading')) element = 'h2';
    if (className.includes('subtitle') || className.includes('text')) element = 'p';
    if (className.includes('input')) element = 'input';
    if (className.includes('link')) element = 'a';
    
    styledComponents.push(`const ${styledName} = styled.${element}\`
  ${styles.replace(/;\s*/g, ';\n  ')}
\`;`);
    
    componentMap[className] = styledName;
  });
  
  // Replace className usage in the component code
  let updatedCode = code;
  Object.entries(componentMap).forEach(([className, styledName]) => {
    // Replace className="class-name" with component usage
    const classNameRegex = new RegExp(`className=['"]${className}['"]`, 'g');
    updatedCode = updatedCode.replace(classNameRegex, '');
    
    // Replace <div className="class-name"> with <StyledComponent>
    const tagRegex = new RegExp(`<(\\w+)([^>]*?)className=['"]${className}['"]([^>]*?)>`, 'g');
    updatedCode = updatedCode.replace(tagRegex, `<${styledName}$2$3>`);
    
    // Replace closing tags
    const closingTagRegex = new RegExp(`</(\\w+)>`, 'g');
    updatedCode = updatedCode.replace(closingTagRegex, (match, tag) => {
      // This is simplified - in production you'd need proper AST parsing
      return match;
    });
  });
  
  // Combine everything
  const styledComponentCode = `import styled from 'styled-components';

${styledComponents.join('\n\n')}

${updatedCode}`;
  
  return styledComponentCode;
}

export function convertFromStyledComponent(code: string): { code: string; css: string } {
  // Extract styled component definitions
  const styledRegex = /const\s+(\w+)\s*=\s*styled\.\w+\`([^`]+)\`/g;
  const styledComponents: Array<{ name: string; styles: string; element: string }> = [];
  
  let match;
  while ((match = styledRegex.exec(code)) !== null) {
    const elementMatch = match[0].match(/styled\.(\w+)/);
    styledComponents.push({
      name: match[1],
      styles: match[2].trim(),
      element: elementMatch ? elementMatch[1] : 'div'
    });
  }
  
  // Generate CSS classes
  const cssClasses: string[] = [];
  const componentToClass: Record<string, string> = {};
  
  styledComponents.forEach(({ name, styles }) => {
    // Convert PascalCase to kebab-case for class name
    const className = name
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
    
    componentToClass[name] = className;
    cssClasses.push(`.${className} {
  ${styles}
}`);
  });
  
  // Replace styled component usage with className
  let standardCode = code;
  
  // Remove styled-components import
  standardCode = standardCode.replace(/import\s+styled\s+from\s+['"]styled-components['"];?\s*/g, '');
  
  // Remove styled component definitions
  styledComponents.forEach(({ name }) => {
    const defRegex = new RegExp(`const\\s+${name}\\s*=\\s*styled\\.\\w+\`[^`]+\`;?\\s*`, 'g');
    standardCode = standardCode.replace(defRegex, '');
  });
  
  // Replace component usage with className
  Object.entries(componentToClass).forEach(([componentName, className]) => {
    const usageRegex = new RegExp(`<${componentName}([^>]*?)>`, 'g');
    standardCode = standardCode.replace(usageRegex, (match, attrs) => {
      // Determine the element type
      const component = styledComponents.find(c => c.name === componentName);
      const element = component?.element || 'div';
      return `<${element} className="${className}"${attrs}>`;
    });
    
    // Replace closing tags
    const closingRegex = new RegExp(`</${componentName}>`, 'g');
    standardCode = standardCode.replace(closingRegex, (match) => {
      const component = styledComponents.find(c => c.name === componentName);
      const element = component?.element || 'div';
      return `</${element}>`;
    });
  });
  
  // Clean up extra whitespace
  standardCode = standardCode.replace(/\n\n+/g, '\n\n').trim();
  
  return {
    code: standardCode,
    css: cssClasses.join('\n\n')
  };
}