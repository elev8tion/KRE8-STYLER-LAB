/**
 * Quality Validator
 * Ensures generated code and content meets quality standards
 */

class QualityValidator {
  constructor() {
    this.rules = new Map();
    this.setupRules();
  }
  
  setupRules() {
    // Code quality rules
    this.rules.set('code', {
      noTodos: (code) => !code.includes('TODO'),
      noConsoleLog: (code) => !code.includes('console.log'),
      hasDocumentation: (code) => code.includes('/**') || code.includes('//'),
      properIndentation: (code) => this.checkIndentation(code),
      noHardcodedValues: (code) => !this.hasHardcodedValues(code)
    });
    
    // Structure quality rules
    this.rules.set('structure', {
      hasReadme: (structure) => structure.hasOwnProperty('README.md'),
      hasPackageJson: (structure) => structure.hasOwnProperty('package.json'),
      hasGitignore: (structure) => structure.hasOwnProperty('.gitignore'),
      properNaming: (structure) => this.checkNaming(structure)
    });
    
    // Design quality rules
    this.rules.set('design', {
      hasColorContrast: (design) => this.checkColorContrast(design),
      hasConsistentSpacing: (design) => this.checkSpacing(design),
      hasResponsiveDesign: (design) => this.checkResponsive(design)
    });
    
    // Content quality rules
    this.rules.set('content', {
      hasNoSpellingErrors: (content) => this.checkSpelling(content),
      hasProperGrammar: (content) => this.checkGrammar(content),
      hasGoodReadability: (content) => this.checkReadability(content)
    });
  }
  
  async validate(result) {
    const validation = {
      valid: true,
      warnings: [],
      errors: [],
      score: 100,
      details: {}
    };
    
    if (result.code) {
      const codeValidation = this.validateCode(result.code);
      validation.details.code = codeValidation;
      this.mergeValidation(validation, codeValidation);
    }
    
    if (result.structure) {
      const structureValidation = this.validateStructure(result.structure);
      validation.details.structure = structureValidation;
      this.mergeValidation(validation, structureValidation);
    }
    
    if (result.design) {
      const designValidation = this.validateDesign(result.design);
      validation.details.design = designValidation;
      this.mergeValidation(validation, designValidation);
    }
    
    if (result.content) {
      const contentValidation = this.validateContent(result.content);
      validation.details.content = contentValidation;
      this.mergeValidation(validation, contentValidation);
    }
    
    return validation;
  }
  
  validateCode(code) {
    const validation = {
      valid: true,
      warnings: [],
      errors: [],
      score: 100,
      checks: {}
    };
    
    const codeRules = this.rules.get('code');
    
    for (const [ruleName, ruleFunc] of Object.entries(codeRules)) {
      try {
        const passed = ruleFunc(code);
        validation.checks[ruleName] = passed;
        
        if (!passed) {
          if (ruleName === 'noTodos' || ruleName === 'noConsoleLog') {
            validation.warnings.push(`Code contains ${ruleName}`);
            validation.score -= 5;
          } else {
            validation.errors.push(`Code fails ${ruleName} check`);
            validation.score -= 10;
            validation.valid = false;
          }
        }
      } catch (error) {
        validation.warnings.push(`Could not check ${ruleName}: ${error.message}`);
      }
    }
    
    return validation;
  }
  
  validateStructure(structure) {
    const validation = {
      valid: true,
      warnings: [],
      errors: [],
      score: 100,
      checks: {}
    };
    
    const structureRules = this.rules.get('structure');
    
    for (const [ruleName, ruleFunc] of Object.entries(structureRules)) {
      try {
        const passed = ruleFunc(structure);
        validation.checks[ruleName] = passed;
        
        if (!passed) {
          validation.warnings.push(`Missing ${ruleName}`);
          validation.score -= 5;
        }
      } catch (error) {
        validation.warnings.push(`Could not check ${ruleName}: ${error.message}`);
      }
    }
    
    return validation;
  }
  
  validateDesign(design) {
    const validation = {
      valid: true,
      warnings: [],
      errors: [],
      score: 100,
      checks: {}
    };
    
    const designRules = this.rules.get('design');
    
    for (const [ruleName, ruleFunc] of Object.entries(designRules)) {
      try {
        const passed = ruleFunc(design);
        validation.checks[ruleName] = passed;
        
        if (!passed) {
          validation.warnings.push(`Design issue: ${ruleName}`);
          validation.score -= 10;
        }
      } catch (error) {
        validation.warnings.push(`Could not check ${ruleName}: ${error.message}`);
      }
    }
    
    return validation;
  }
  
  validateContent(content) {
    const validation = {
      valid: true,
      warnings: [],
      errors: [],
      score: 100,
      checks: {}
    };
    
    const contentRules = this.rules.get('content');
    
    for (const [ruleName, ruleFunc] of Object.entries(contentRules)) {
      try {
        const passed = ruleFunc(content);
        validation.checks[ruleName] = passed;
        
        if (!passed) {
          validation.warnings.push(`Content issue: ${ruleName}`);
          validation.score -= 5;
        }
      } catch (error) {
        validation.warnings.push(`Could not check ${ruleName}: ${error.message}`);
      }
    }
    
    return validation;
  }
  
  mergeValidation(main, sub) {
    if (!sub.valid && main.valid) {
      main.valid = false;
    }
    
    main.warnings.push(...sub.warnings);
    main.errors.push(...sub.errors);
    
    // Average the scores
    main.score = Math.round((main.score + sub.score) / 2);
  }
  
  // Rule implementation methods
  checkIndentation(code) {
    const lines = code.split('\n');
    let prevIndent = 0;
    
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      const indent = line.length - line.trimStart().length;
      const indentDiff = Math.abs(indent - prevIndent);
      
      // Should be multiples of 2 or 4
      if (indentDiff > 0 && indentDiff % 2 !== 0 && indentDiff % 4 !== 0) {
        return false;
      }
      
      prevIndent = indent;
    }
    
    return true;
  }
  
  hasHardcodedValues(code) {
    // Simple check for common hardcoded values
    const hardcodedPatterns = [
      /http:\/\/localhost:\d+/g,
      /'admin'|"admin"/g,
      /'password'|"password"/g,
      /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g // IP addresses
    ];
    
    return hardcodedPatterns.some(pattern => pattern.test(code));
  }
  
  checkNaming(structure) {
    // Check for consistent naming conventions
    const checkNames = (obj, path = '') => {
      for (const [key, value] of Object.entries(obj)) {
        // Files should be kebab-case or camelCase
        if (typeof value === 'string') {
          if (key.includes(' ') || key.includes('_')) {
            return false;
          }
        } else if (typeof value === 'object') {
          if (!checkNames(value, `${path}/${key}`)) {
            return false;
          }
        }
      }
      return true;
    };
    
    return checkNames(structure);
  }
  
  checkColorContrast(design) {
    // Simplified color contrast check
    if (!design.colors) return true;
    
    // Should have sufficient contrast between text and background
    // This is a placeholder - real implementation would calculate WCAG ratios
    return true;
  }
  
  checkSpacing(design) {
    // Check for consistent spacing values
    if (!design.spacing) return true;
    
    const spacingValues = Object.values(design.spacing);
    
    // Should follow a mathematical scale
    return spacingValues.length > 0;
  }
  
  checkResponsive(design) {
    // Check for responsive design tokens
    if (!design.breakpoints && !design.spacing) return false;
    
    return true;
  }
  
  checkSpelling(content) {
    // Simplified spelling check
    const commonMisspellings = [
      'recieve', 'occured', 'seperate', 'definately',
      'occassion', 'neccessary', 'recomend'
    ];
    
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    
    return !commonMisspellings.some(word => 
      text.toLowerCase().includes(word)
    );
  }
  
  checkGrammar(content) {
    // Basic grammar checks
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    
    // Check for double spaces
    if (text.includes('  ')) return false;
    
    // Check for proper sentence ending
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.trim() && !sentence.trim().match(/^[A-Z]/)) {
        return false;
      }
    }
    
    return true;
  }
  
  checkReadability(content) {
    // Simple readability check
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    
    if (sentences === 0) return true;
    
    const avgWordsPerSentence = words / sentences;
    
    // Should be reasonable length (5-20 words per sentence)
    return avgWordsPerSentence >= 5 && avgWordsPerSentence <= 20;
  }
  
  // Utility methods
  async runAsyncValidation(result) {
    // For future async validations like API calls, file checks, etc.
    return this.validate(result);
  }
  
  getValidationReport(validation) {
    return {
      summary: {
        valid: validation.valid,
        score: validation.score,
        warningCount: validation.warnings.length,
        errorCount: validation.errors.length
      },
      issues: [
        ...validation.errors.map(error => ({ type: 'error', message: error })),
        ...validation.warnings.map(warning => ({ type: 'warning', message: warning }))
      ],
      details: validation.details
    };
  }
}

module.exports = { QualityValidator };