import { EventEmitter } from 'events';

interface MCPBridgeConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
}

class MCPBridge extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: MCPBridgeConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private messageQueue: any[] = [];

  constructor(config: Partial<MCPBridgeConfig> = {}) {
    super();
    this.config = {
      url: config.url || 'ws://localhost:3006/ws',
      reconnectInterval: config.reconnectInterval || 3000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10
    };
  }

  connect(): void {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = () => {
        console.log('MCP Bridge connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connected');
        
        // Send queued messages
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();
          this.send(message);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('message', data);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('MCP Bridge error:', error);
        this.emit('error', error);
      };

      this.ws.onclose = () => {
        console.log('MCP Bridge disconnected');
        this.isConnecting = false;
        this.ws = null;
        this.emit('disconnected');
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('max_reconnect_failed');
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting in ${this.config.reconnectInterval}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval);
  }

  send(message: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      // Queue message if not connected
      this.messageQueue.push(message);
      this.connect(); // Try to connect
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('Failed to send message:', error);
      this.messageQueue.push(message);
    }
  }

  async request(message: any, timeout = 30000): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).substring(7);
      const timeoutId = setTimeout(() => {
        this.removeListener(`response_${requestId}`, responseHandler);
        reject(new Error('Request timeout'));
      }, timeout);

      const responseHandler = (data: any) => {
        clearTimeout(timeoutId);
        resolve(data);
      };

      this.once(`response_${requestId}`, responseHandler);
      
      this.send({
        ...message,
        requestId
      });
    });
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.messageQueue = [];
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  getStatus(): 'connected' | 'connecting' | 'disconnected' {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return 'connected';
    }
    if (this.isConnecting) {
      return 'connecting';
    }
    return 'disconnected';
  }
}

// Singleton instance
let bridgeInstance: MCPBridge | null = null;

export function getMCPBridge(): MCPBridge {
  if (!bridgeInstance) {
    bridgeInstance = new MCPBridge();
  }
  return bridgeInstance;
}

export default MCPBridge;