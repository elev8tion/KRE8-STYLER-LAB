/**
 * Resource Library
 * Manages templates, components, patterns, and examples
 */

const fs = require('fs').promises;
const path = require('path');

class ResourceLibrary {
  constructor() {
    this.cache = new Map();
    this.initialized = false;
  }
  
  async initialize() {
    console.log('[RESOURCE-LIBRARY] Initializing...');
    
    // Load built-in resources
    await this.loadTemplates();
    await this.loadComponents();
    await this.loadPatterns();
    await this.loadExamples();
    
    this.initialized = true;
    console.log(`[RESOURCE-LIBRARY] Initialized with ${this.cache.size} resources`);
  }
  
  async loadTemplates() {
    const templates = {
      'app-templates': {
        'react-spa': this.getReactSPATemplate(),
        'vue-ssr': this.getVueSSRTemplate(),
        'flutter-mobile': this.getFlutterTemplate(),
        'express-api': this.getExpressAPITemplate(),
        'nextjs-fullstack': this.getNextJSTemplate()
      },
      'design-templates': {
        'modern-ui': this.getModernUITemplate(),
        'minimal-design': this.getMinimalDesignTemplate(),
        'dashboard-layout': this.getDashboardTemplate()
      }
    };
    
    this.cache.set('templates', templates);
  }
  
  async loadComponents() {
    const components = {
      'ui-components': {
        'button': this.getButtonComponent(),
        'card': this.getCardComponent(),
        'modal': this.getModalComponent(),
        'form': this.getFormComponent(),
        'table': this.getTableComponent()
      },
      'layout-components': {
        'header': this.getHeaderComponent(),
        'sidebar': this.getSidebarComponent(),
        'footer': this.getFooterComponent()
      }
    };
    
    this.cache.set('components', components);
  }
  
  async loadPatterns() {
    const patterns = {
      'architectural-patterns': {
        'mvc': this.getMVCPattern(),
        'mvp': this.getMVPPattern(),
        'mvvm': this.getMVVMPattern(),
        'clean-architecture': this.getCleanArchitecturePattern()
      },
      'design-patterns': {
        'singleton': this.getSingletonPattern(),
        'factory': this.getFactoryPattern(),
        'observer': this.getObserverPattern(),
        'strategy': this.getStrategyPattern()
      }
    };
    
    this.cache.set('patterns', patterns);
  }
  
  async loadExamples() {
    const examples = {
      'code-examples': {
        'authentication': this.getAuthExample(),
        'api-integration': this.getAPIExample(),
        'state-management': this.getStateExample()
      },
      'project-examples': {
        'todo-app': this.getTodoExample(),
        'blog-platform': this.getBlogExample(),
        'ecommerce': this.getEcommerceExample()
      }
    };
    
    this.cache.set('examples', examples);
  }
  
  get(category, id) {
    const categoryData = this.cache.get(category);
    if (!categoryData) return null;
    
    // Navigate nested structure
    const parts = id.split('.');
    let result = categoryData;
    
    for (const part of parts) {
      result = result[part];
      if (!result) return null;
    }
    
    return result;
  }
  
  search(query) {
    const results = [];
    
    for (const [category, data] of this.cache.entries()) {
      this.searchInData(data, query, category, results);
    }
    
    return results;
  }
  
  searchInData(data, query, path, results) {
    if (typeof data === 'string') {
      if (data.toLowerCase().includes(query.toLowerCase())) {
        results.push({ path, match: data });
      }
    } else if (typeof data === 'object') {
      for (const [key, value] of Object.entries(data)) {
        this.searchInData(value, query, `${path}.${key}`, results);
      }
    }
  }
  
  // Template methods
  getReactSPATemplate() {
    return {
      name: 'React SPA Template',
      description: 'Single Page Application with React',
      structure: {
        'src/': {
          'App.tsx': '// React App Component',
          'components/': {},
          'pages/': {},
          'hooks/': {},
          'utils/': {}
        },
        'package.json': '// Package configuration',
        'vite.config.ts': '// Vite configuration'
      }
    };
  }
  
  getVueSSRTemplate() {
    return {
      name: 'Vue SSR Template',
      description: 'Server-Side Rendered Vue application with Nuxt',
      structure: {
        'pages/': {},
        'components/': {},
        'nuxt.config.ts': '// Nuxt configuration'
      }
    };
  }
  
  getFlutterTemplate() {
    return {
      name: 'Flutter Mobile Template',
      description: 'Cross-platform mobile application',
      structure: {
        'lib/': {
          'main.dart': '// Main application',
          'screens/': {},
          'widgets/': {},
          'services/': {}
        },
        'pubspec.yaml': '// Flutter dependencies'
      }
    };
  }
  
  getExpressAPITemplate() {
    return {
      name: 'Express API Template',
      description: 'RESTful API with Express.js',
      structure: {
        'src/': {
          'index.js': '// Server entry point',
          'routes/': {},
          'controllers/': {},
          'models/': {},
          'middleware/': {}
        }
      }
    };
  }
  
  getNextJSTemplate() {
    return {
      name: 'Next.js Full-Stack Template',
      description: 'Full-stack application with Next.js',
      structure: {
        'pages/': {},
        'components/': {},
        'api/': {},
        'styles/': {}
      }
    };
  }
  
  getModernUITemplate() {
    return {
      name: 'Modern UI Design',
      description: 'Contemporary design system with glassmorphism',
      tokens: {
        colors: { primary: '#6366f1', secondary: '#8b5cf6' },
        spacing: { base: '1rem' },
        typography: { fontFamily: 'Inter' }
      }
    };
  }
  
  getMinimalDesignTemplate() {
    return {
      name: 'Minimal Design',
      description: 'Clean, minimal design system',
      tokens: {
        colors: { primary: '#000000', secondary: '#666666' },
        spacing: { base: '1rem' },
        typography: { fontFamily: 'Helvetica' }
      }
    };
  }
  
  getDashboardTemplate() {
    return {
      name: 'Dashboard Layout',
      description: 'Admin dashboard layout template',
      layout: {
        sidebar: 'left',
        header: 'top',
        content: 'center'
      }
    };
  }
  
  // Component methods
  getButtonComponent() {
    return {
      name: 'Button Component',
      variants: ['primary', 'secondary', 'outline', 'ghost'],
      sizes: ['sm', 'md', 'lg'],
      code: {
        react: '// React Button Component',
        vue: '// Vue Button Component',
        flutter: '// Flutter Button Widget'
      }
    };
  }
  
  getCardComponent() {
    return {
      name: 'Card Component',
      variants: ['default', 'elevated', 'outlined'],
      code: {
        react: '// React Card Component',
        vue: '// Vue Card Component',
        flutter: '// Flutter Card Widget'
      }
    };
  }
  
  getModalComponent() {
    return {
      name: 'Modal Component',
      features: ['overlay', 'close-button', 'animations'],
      code: {
        react: '// React Modal Component',
        vue: '// Vue Modal Component',
        flutter: '// Flutter Modal Widget'
      }
    };
  }
  
  getFormComponent() {
    return {
      name: 'Form Component',
      features: ['validation', 'error-handling', 'accessibility'],
      code: {
        react: '// React Form Component',
        vue: '// Vue Form Component',
        flutter: '// Flutter Form Widget'
      }
    };
  }
  
  getTableComponent() {
    return {
      name: 'Table Component',
      features: ['sorting', 'pagination', 'filtering'],
      code: {
        react: '// React Table Component',
        vue: '// Vue Table Component',
        flutter: '// Flutter Table Widget'
      }
    };
  }
  
  getHeaderComponent() {
    return {
      name: 'Header Component',
      features: ['navigation', 'logo', 'user-menu'],
      code: {
        react: '// React Header Component',
        vue: '// Vue Header Component',
        flutter: '// Flutter Header Widget'
      }
    };
  }
  
  getSidebarComponent() {
    return {
      name: 'Sidebar Component',
      features: ['collapsible', 'navigation', 'icons'],
      code: {
        react: '// React Sidebar Component',
        vue: '// Vue Sidebar Component',
        flutter: '// Flutter Sidebar Widget'
      }
    };
  }
  
  getFooterComponent() {
    return {
      name: 'Footer Component',
      features: ['links', 'social-media', 'copyright'],
      code: {
        react: '// React Footer Component',
        vue: '// Vue Footer Component',
        flutter: '// Flutter Footer Widget'
      }
    };
  }
  
  // Pattern methods
  getMVCPattern() {
    return {
      name: 'Model-View-Controller',
      description: 'Separates application logic into three components',
      structure: {
        model: 'Data and business logic',
        view: 'User interface',
        controller: 'Handles user input'
      }
    };
  }
  
  getMVPPattern() {
    return {
      name: 'Model-View-Presenter',
      description: 'Presenter handles the logic of the UI',
      structure: {
        model: 'Data layer',
        view: 'UI layer',
        presenter: 'Business logic'
      }
    };
  }
  
  getMVVMPattern() {
    return {
      name: 'Model-View-ViewModel',
      description: 'ViewModel manages the state for the View',
      structure: {
        model: 'Data layer',
        view: 'UI layer',
        viewmodel: 'State management'
      }
    };
  }
  
  getCleanArchitecturePattern() {
    return {
      name: 'Clean Architecture',
      description: 'Dependency inversion with clear boundaries',
      layers: {
        entities: 'Business rules',
        usecases: 'Application logic',
        adapters: 'Interface adapters',
        frameworks: 'External frameworks'
      }
    };
  }
  
  getSingletonPattern() {
    return {
      name: 'Singleton Pattern',
      description: 'Ensures only one instance of a class',
      code: '// Singleton implementation'
    };
  }
  
  getFactoryPattern() {
    return {
      name: 'Factory Pattern',
      description: 'Creates objects without specifying exact classes',
      code: '// Factory implementation'
    };
  }
  
  getObserverPattern() {
    return {
      name: 'Observer Pattern',
      description: 'Notifies multiple objects about state changes',
      code: '// Observer implementation'
    };
  }
  
  getStrategyPattern() {
    return {
      name: 'Strategy Pattern',
      description: 'Encapsulates algorithms and makes them interchangeable',
      code: '// Strategy implementation'
    };
  }
  
  // Example methods
  getAuthExample() {
    return {
      name: 'Authentication Example',
      description: 'Complete authentication flow',
      features: ['login', 'register', 'logout', 'password-reset'],
      code: '// Authentication implementation'
    };
  }
  
  getAPIExample() {
    return {
      name: 'API Integration Example',
      description: 'REST API integration with error handling',
      features: ['fetch', 'error-handling', 'loading-states'],
      code: '// API integration implementation'
    };
  }
  
  getStateExample() {
    return {
      name: 'State Management Example',
      description: 'Global state management',
      features: ['store', 'actions', 'reducers'],
      code: '// State management implementation'
    };
  }
  
  getTodoExample() {
    return {
      name: 'Todo Application',
      description: 'Complete todo application',
      features: ['CRUD operations', 'local storage', 'filtering'],
      structure: {
        components: ['TodoList', 'TodoItem', 'AddTodo'],
        pages: ['Home'],
        utils: ['storage', 'validation']
      }
    };
  }
  
  getBlogExample() {
    return {
      name: 'Blog Platform',
      description: 'Full-featured blog platform',
      features: ['posts', 'comments', 'categories', 'search'],
      structure: {
        components: ['PostList', 'PostDetail', 'CommentSection'],
        pages: ['Home', 'Post', 'Category'],
        api: ['posts', 'comments', 'categories']
      }
    };
  }
  
  getEcommerceExample() {
    return {
      name: 'E-commerce Platform',
      description: 'Online shopping platform',
      features: ['products', 'cart', 'checkout', 'payments'],
      structure: {
        components: ['ProductGrid', 'CartItem', 'CheckoutForm'],
        pages: ['Shop', 'Product', 'Cart', 'Checkout'],
        api: ['products', 'orders', 'payments']
      }
    };
  }
}

module.exports = { ResourceLibrary };