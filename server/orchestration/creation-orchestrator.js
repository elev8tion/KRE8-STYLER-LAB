/**
 * Intelligent Creation Orchestrator
 * Manages multi-step creation workflows with parallel execution
 */

class CreationOrchestrator {
  constructor() {
    this.activeWorkflows = new Map();
    this.taskQueue = [];
    this.executionGraph = null;
  }
  
  async orchestrate({ type, spec, options, registry, engines, library }) {
    console.log(`[ORCHESTRATOR] Starting ${type} creation`);
    
    // 1. Analyze and plan
    const plan = await this.analyzePlan({ type, spec });
    
    // 2. Decompose into tasks
    const tasks = await this.decomposeTasks(plan, spec);
    
    // 3. Build dependency graph
    const graph = this.buildDependencyGraph(tasks);
    
    // 4. Execute in optimal order
    const results = await this.executeParallel(graph, { engines, library });
    
    // 5. Validate quality
    const validated = await this.validateResults(results);
    
    // 6. Assemble final output
    return this.assembleOutput(validated, spec);
  }
  
  async orchestrateWithProgress({ type, spec, options, registry, engines, library, onProgress }) {
    const workflowId = Date.now().toString();
    this.activeWorkflows.set(workflowId, { status: 'planning' });
    
    // Send progress updates
    const updateProgress = (stage, percentage, details = {}) => {
      if (onProgress) {
        onProgress({
          stage,
          percentage,
          details,
          timestamp: Date.now()
        });
      }
    };
    
    updateProgress('planning', 10, { message: 'Analyzing requirements' });
    const plan = await this.analyzePlan({ type, spec });
    
    updateProgress('decomposing', 20, { message: 'Breaking down tasks' });
    const tasks = await this.decomposeTasks(plan, spec);
    
    updateProgress('scheduling', 30, { message: 'Building execution plan' });
    const graph = this.buildDependencyGraph(tasks);
    
    updateProgress('executing', 40, { message: 'Starting parallel execution' });
    const results = await this.executeParallelWithProgress(
      graph, 
      { engines, library },
      (taskProgress) => {
        updateProgress('executing', 40 + taskProgress * 0.4, {
          message: `Processing tasks: ${Math.round(taskProgress * 100)}%`
        });
      }
    );
    
    updateProgress('validating', 85, { message: 'Validating quality' });
    const validated = await this.validateResults(results);
    
    updateProgress('assembling', 95, { message: 'Assembling final output' });
    const output = this.assembleOutput(validated, spec);
    
    updateProgress('complete', 100, { message: 'Creation complete!' });
    this.activeWorkflows.delete(workflowId);
    
    return output;
  }
  
  async analyzePlan({ type, spec }) {
    const plan = {
      type,
      complexity: this.assessComplexity(spec),
      requirements: this.extractRequirements(spec),
      constraints: this.identifyConstraints(spec),
      optimizations: this.suggestOptimizations(spec)
    };
    
    // Determine creation strategy
    if (type === 'workflow') {
      plan.strategy = 'multi-phase';
      plan.phases = this.planWorkflowPhases(spec);
    } else if (type === 'app') {
      plan.strategy = 'full-stack';
      plan.components = ['frontend', 'backend', 'database', 'deployment'];
    } else if (type === 'design') {
      plan.strategy = 'iterative';
      plan.iterations = 3;
    } else {
      plan.strategy = 'single-phase';
    }
    
    return plan;
  }
  
  assessComplexity(spec) {
    let complexity = 1;
    
    if (spec.features && spec.features.length > 5) complexity++;
    if (spec.platforms && spec.platforms.length > 2) complexity++;
    if (spec.integrations && spec.integrations.length > 0) complexity++;
    if (spec.scale === 'enterprise') complexity += 2;
    
    return Math.min(complexity, 5); // 1-5 scale
  }
  
  extractRequirements(spec) {
    return {
      functional: spec.features || [],
      nonFunctional: {
        performance: spec.performance || 'standard',
        security: spec.security || 'standard',
        scalability: spec.scalability || 'standard'
      },
      technical: {
        language: spec.language,
        framework: spec.framework,
        database: spec.database
      }
    };
  }
  
  identifyConstraints(spec) {
    return {
      time: spec.deadline || null,
      budget: spec.budget || 'unlimited',
      resources: spec.resources || 'standard',
      compliance: spec.compliance || []
    };
  }
  
  suggestOptimizations(spec) {
    const optimizations = [];
    
    if (spec.performance === 'high') {
      optimizations.push('caching', 'lazy-loading', 'code-splitting');
    }
    
    if (spec.scale === 'enterprise') {
      optimizations.push('microservices', 'load-balancing', 'auto-scaling');
    }
    
    if (spec.platforms && spec.platforms.includes('mobile')) {
      optimizations.push('responsive-design', 'offline-first', 'progressive-enhancement');
    }
    
    return optimizations;
  }
  
  async decomposeTasks(plan, spec) {
    const tasks = [];
    let taskId = 0;
    
    // Generate tasks based on plan type
    if (plan.type === 'app' || plan.type.includes('app')) {
      // Frontend tasks
      tasks.push({
        id: `task-${taskId++}`,
        name: 'design-system',
        engine: 'design',
        priority: 1,
        dependencies: [],
        params: {
          style: spec.designSystem?.style || 'modern',
          colors: spec.designSystem?.colors,
          components: spec.components || []
        }
      });
      
      tasks.push({
        id: `task-${taskId++}`,
        name: 'frontend-structure',
        engine: 'app',
        priority: 2,
        dependencies: ['task-0'],
        params: {
          framework: spec.framework || 'react',
          routes: spec.routes || [],
          layouts: spec.layouts || []
        }
      });
      
      // Backend tasks
      tasks.push({
        id: `task-${taskId++}`,
        name: 'database-schema',
        engine: 'backend',
        priority: 1,
        dependencies: [],
        params: {
          type: spec.database || 'postgres',
          models: spec.models || []
        }
      });
      
      tasks.push({
        id: `task-${taskId++}`,
        name: 'api-endpoints',
        engine: 'backend',
        priority: 2,
        dependencies: ['task-2'],
        params: {
          type: spec.apiType || 'rest',
          endpoints: spec.endpoints || []
        }
      });
      
      tasks.push({
        id: `task-${taskId++}`,
        name: 'authentication',
        engine: 'backend',
        priority: 3,
        dependencies: ['task-3'],
        params: {
          providers: spec.authProviders || ['email'],
          features: spec.authFeatures || ['jwt']
        }
      });
      
      // Integration tasks
      tasks.push({
        id: `task-${taskId++}`,
        name: 'frontend-backend-integration',
        engine: 'app',
        priority: 4,
        dependencies: ['task-1', 'task-3'],
        params: {
          apiClient: true,
          stateManagement: true
        }
      });
      
      // Deployment tasks
      tasks.push({
        id: `task-${taskId++}`,
        name: 'deployment-config',
        engine: 'backend',
        priority: 5,
        dependencies: ['task-5'],
        params: {
          platform: spec.deployPlatform || 'vercel',
          environments: ['development', 'production']
        }
      });
    }
    
    // Workflow-specific tasks
    if (plan.type === 'workflow') {
      if (spec.workflow === 'startup') {
        tasks.push(
          { id: `task-${taskId++}`, name: 'business-plan', engine: 'content', priority: 1 },
          { id: `task-${taskId++}`, name: 'landing-page', engine: 'app', priority: 2 },
          { id: `task-${taskId++}`, name: 'mvp', engine: 'app', priority: 3 },
          { id: `task-${taskId++}`, name: 'marketing', engine: 'content', priority: 4 }
        );
      }
    }
    
    return tasks;
  }
  
  buildDependencyGraph(tasks) {
    const graph = {
      nodes: new Map(),
      edges: new Map(),
      layers: []
    };
    
    // Add all tasks as nodes
    tasks.forEach(task => {
      graph.nodes.set(task.id, task);
      graph.edges.set(task.id, task.dependencies || []);
    });
    
    // Topological sort to find execution layers
    const visited = new Set();
    const layers = [];
    
    while (visited.size < tasks.length) {
      const layer = [];
      
      for (const task of tasks) {
        if (!visited.has(task.id)) {
          const deps = task.dependencies || [];
          if (deps.every(dep => visited.has(dep))) {
            layer.push(task.id);
          }
        }
      }
      
      layer.forEach(id => visited.add(id));
      if (layer.length > 0) {
        layers.push(layer);
      }
    }
    
    graph.layers = layers;
    return graph;
  }
  
  async executeParallel(graph, { engines, library }) {
    const results = new Map();
    
    // Execute each layer in sequence, tasks within layer in parallel
    for (const layer of graph.layers) {
      console.log(`[ORCHESTRATOR] Executing layer with ${layer.length} tasks`);
      
      const layerPromises = layer.map(async (taskId) => {
        const task = graph.nodes.get(taskId);
        const engine = engines[task.engine];
        
        if (!engine) {
          throw new Error(`Engine ${task.engine} not found for task ${taskId}`);
        }
        
        // Get results from dependencies
        const depResults = {};
        (task.dependencies || []).forEach(depId => {
          depResults[depId] = results.get(depId);
        });
        
        // Execute task
        const result = await engine.executeTask({
          task,
          dependencies: depResults,
          library
        });
        
        return { taskId, result };
      });
      
      // Wait for all tasks in layer to complete
      const layerResults = await Promise.all(layerPromises);
      
      // Store results
      layerResults.forEach(({ taskId, result }) => {
        results.set(taskId, result);
      });
    }
    
    return results;
  }
  
  async executeParallelWithProgress(graph, { engines, library }, onTaskProgress) {
    const results = new Map();
    const totalTasks = graph.nodes.size;
    let completedTasks = 0;
    
    for (const layer of graph.layers) {
      const layerPromises = layer.map(async (taskId) => {
        const task = graph.nodes.get(taskId);
        const engine = engines[task.engine];
        
        const depResults = {};
        (task.dependencies || []).forEach(depId => {
          depResults[depId] = results.get(depId);
        });
        
        const result = await engine.executeTask({
          task,
          dependencies: depResults,
          library
        });
        
        completedTasks++;
        onTaskProgress(completedTasks / totalTasks);
        
        return { taskId, result };
      });
      
      const layerResults = await Promise.all(layerPromises);
      layerResults.forEach(({ taskId, result }) => {
        results.set(taskId, result);
      });
    }
    
    return results;
  }
  
  async validateResults(results) {
    const validated = new Map();
    
    for (const [taskId, result] of results) {
      // Basic validation
      const validation = {
        valid: true,
        warnings: [],
        errors: []
      };
      
      // Check for required fields
      if (!result) {
        validation.valid = false;
        validation.errors.push('No result produced');
      }
      
      // Check for common issues
      if (result && result.code && result.code.includes('TODO')) {
        validation.warnings.push('Contains TODO items');
      }
      
      validated.set(taskId, {
        ...result,
        validation
      });
    }
    
    return validated;
  }
  
  assembleOutput(results, spec) {
    const output = {
      success: true,
      timestamp: Date.now(),
      spec,
      artifacts: {}
    };
    
    // Collect all artifacts from tasks
    for (const [taskId, result] of results) {
      if (result && result.validation && result.validation.valid) {
        const taskName = taskId.replace('task-', '');
        output.artifacts[taskName] = result;
      }
    }
    
    // Generate combined output structure
    if (spec.type === 'app' || spec.name) {
      output.project = {
        name: spec.name || 'generated-project',
        structure: this.generateProjectStructure(output.artifacts),
        files: this.collectFiles(output.artifacts),
        instructions: this.generateInstructions(output.artifacts)
      };
    }
    
    return output;
  }
  
  generateProjectStructure(artifacts) {
    return {
      'src/': {
        'components/': artifacts['1']?.components || {},
        'pages/': artifacts['1']?.pages || {},
        'api/': artifacts['3']?.endpoints || {},
        'styles/': artifacts['0']?.styles || {}
      },
      'database/': artifacts['2']?.schema || {},
      'config/': artifacts['6']?.config || {},
      'tests/': {},
      'docs/': {}
    };
  }
  
  collectFiles(artifacts) {
    const files = [];
    
    Object.values(artifacts).forEach(artifact => {
      if (artifact.files) {
        files.push(...artifact.files);
      }
    });
    
    return files;
  }
  
  generateInstructions(artifacts) {
    return {
      setup: [
        'npm install',
        'cp .env.example .env',
        'npm run db:migrate'
      ],
      development: [
        'npm run dev'
      ],
      deployment: artifacts['6']?.deploymentSteps || []
    };
  }
  
  planWorkflowPhases(spec) {
    const phases = [];
    
    if (spec.workflow === 'startup') {
      phases.push(
        { name: 'ideation', duration: '2m' },
        { name: 'planning', duration: '3m' },
        { name: 'building', duration: '5m' },
        { name: 'launching', duration: '2m' }
      );
    }
    
    return phases;
  }
}

module.exports = { CreationOrchestrator };