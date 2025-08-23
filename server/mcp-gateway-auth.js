const crypto = require('crypto');

/**
 * MCP Gateway Authentication & Rate Limiting
 */
class MCPGatewayAuth {
  constructor(config = {}) {
    this.apiKeys = new Map();
    this.rateLimits = new Map();
    this.defaultRateLimit = config.defaultRateLimit || 100; // requests per minute
    this.windowMs = config.windowMs || 60000; // 1 minute window
    
    // Initialize with default API keys for local development
    this.initializeDefaultKeys();
  }

  /**
   * Initialize default API keys for local LLMs
   */
  initializeDefaultKeys() {
    // Local development keys
    this.apiKeys.set('local-ollama-key', {
      name: 'Ollama Local',
      permissions: ['*'],
      rateLimit: 1000,
      created: new Date()
    });
    
    this.apiKeys.set('local-dev-key', {
      name: 'Development',
      permissions: ['*'],
      rateLimit: 500,
      created: new Date()
    });
    
    // Generate a random key for this session
    const sessionKey = this.generateApiKey();
    this.apiKeys.set(sessionKey, {
      name: 'Session Key',
      permissions: ['*'],
      rateLimit: 200,
      created: new Date()
    });
    
    console.log(`📔 Session API Key: ${sessionKey}`);
  }

  /**
   * Generate a new API key
   */
  generateApiKey() {
    return 'mcp_' + crypto.randomBytes(24).toString('hex');
  }

  /**
   * Create a new API key with permissions
   */
  createApiKey(name, permissions = ['*'], rateLimit = null) {
    const key = this.generateApiKey();
    this.apiKeys.set(key, {
      name,
      permissions,
      rateLimit: rateLimit || this.defaultRateLimit,
      created: new Date()
    });
    return key;
  }

  /**
   * Validate API key
   */
  validateApiKey(key) {
    if (!key) return { valid: false, error: 'No API key provided' };
    
    const keyData = this.apiKeys.get(key);
    if (!keyData) return { valid: false, error: 'Invalid API key' };
    
    return { valid: true, keyData };
  }

  /**
   * Check if key has permission for tool
   */
  hasPermission(key, tool) {
    const keyData = this.apiKeys.get(key);
    if (!keyData) return false;
    
    // Check for wildcard permission
    if (keyData.permissions.includes('*')) return true;
    
    // Check for specific tool permission
    return keyData.permissions.includes(tool);
  }

  /**
   * Rate limiting check
   */
  checkRateLimit(key) {
    const keyData = this.apiKeys.get(key);
    if (!keyData) return { allowed: false, error: 'Invalid key' };
    
    const now = Date.now();
    const limit = keyData.rateLimit || this.defaultRateLimit;
    
    // Get or create rate limit data for this key
    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, {
        requests: [],
        windowStart: now
      });
    }
    
    const rateData = this.rateLimits.get(key);
    
    // Clean old requests outside the window
    rateData.requests = rateData.requests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    // Check if limit exceeded
    if (rateData.requests.length >= limit) {
      const resetTime = Math.ceil((rateData.requests[0] + this.windowMs - now) / 1000);
      return {
        allowed: false,
        error: 'Rate limit exceeded',
        limit,
        remaining: 0,
        resetIn: resetTime
      };
    }
    
    // Add current request
    rateData.requests.push(now);
    
    return {
      allowed: true,
      limit,
      remaining: limit - rateData.requests.length,
      resetIn: Math.ceil(this.windowMs / 1000)
    };
  }

  /**
   * Express middleware for authentication
   */
  authMiddleware() {
    return (req, res, next) => {
      // Extract API key from header or query
      const apiKey = req.headers['x-api-key'] || 
                     req.query.api_key ||
                     'local-ollama-key'; // Default for local development
      
      // Validate API key
      const validation = this.validateApiKey(apiKey);
      if (!validation.valid) {
        return res.status(401).json({ error: validation.error });
      }
      
      // Check rate limit
      const rateCheck = this.checkRateLimit(apiKey);
      if (!rateCheck.allowed) {
        res.setHeader('X-RateLimit-Limit', rateCheck.limit);
        res.setHeader('X-RateLimit-Remaining', rateCheck.remaining);
        res.setHeader('X-RateLimit-Reset', rateCheck.resetIn);
        
        return res.status(429).json({
          error: rateCheck.error,
          retryAfter: rateCheck.resetIn
        });
      }
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', rateCheck.limit);
      res.setHeader('X-RateLimit-Remaining', rateCheck.remaining);
      res.setHeader('X-RateLimit-Reset', rateCheck.resetIn);
      
      // Attach key data to request
      req.apiKey = apiKey;
      req.keyData = validation.keyData;
      
      next();
    };
  }

  /**
   * Tool permission middleware
   */
  toolPermissionMiddleware() {
    return (req, res, next) => {
      const toolId = req.params.toolId || req.body.tool;
      
      if (toolId && !this.hasPermission(req.apiKey, toolId)) {
        return res.status(403).json({
          error: 'Permission denied for this tool'
        });
      }
      
      next();
    };
  }

  /**
   * Get usage statistics for a key
   */
  getUsageStats(key) {
    const keyData = this.apiKeys.get(key);
    if (!keyData) return null;
    
    const rateData = this.rateLimits.get(key) || { requests: [] };
    const now = Date.now();
    
    // Calculate requests in current window
    const recentRequests = rateData.requests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    // Calculate requests in last hour
    const hourRequests = rateData.requests.filter(
      timestamp => now - timestamp < 3600000
    );
    
    return {
      key: key.substring(0, 8) + '...',
      name: keyData.name,
      created: keyData.created,
      permissions: keyData.permissions,
      rateLimit: keyData.rateLimit,
      currentWindow: {
        requests: recentRequests.length,
        remaining: keyData.rateLimit - recentRequests.length
      },
      lastHour: {
        requests: hourRequests.length
      }
    };
  }

  /**
   * List all API keys (for admin)
   */
  listApiKeys() {
    const keys = [];
    for (const [key, data] of this.apiKeys.entries()) {
      keys.push({
        key: key.substring(0, 8) + '...',
        name: data.name,
        permissions: data.permissions.length,
        rateLimit: data.rateLimit,
        created: data.created
      });
    }
    return keys;
  }
}

module.exports = MCPGatewayAuth;