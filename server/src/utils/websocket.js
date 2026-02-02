import { WebSocketServer } from 'ws';
import http from 'http';

class WebSocketManager {
  constructor(server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.clients = new Set();

    this.setup();
  }

  setup() {
    this.wss.on('connection', (ws, req) => {
      console.log('新的WebSocket客户端连接');
      this.clients.add(ws);

      // 发送欢迎消息
      this.sendToClient(ws, {
        type: 'connected',
        message: 'WebSocket连接成功',
        timestamp: Date.now()
      });

      // 处理客户端消息
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(ws, message);
        } catch (error) {
          console.error('处理消息失败:', error);
        }
      });

      // 处理断开连接
      ws.on('close', () => {
        console.log('WebSocket客户端断开连接');
        this.clients.delete(ws);
      });

      // 处理错误
      ws.on('error', (error) => {
        console.error('WebSocket错误:', error);
      });
    });

    console.log('WebSocket服务器启动，监听路径: /ws');
  }

  // 处理客户端消息
  handleClientMessage(ws, message) {
    switch (message.type) {
      case 'ping':
        this.sendToClient(ws, { type: 'pong', timestamp: Date.now() });
        break;
      case 'subscribe':
        console.log('客户端订阅:', message.channel);
        break;
      default:
        console.log('未知消息类型:', message.type);
    }
  }

  // 发送消息给指定客户端
  sendToClient(client, data) {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(data));
    }
  }

  // 广播消息给所有客户端
  broadcast(data) {
    const message = JSON.stringify(data);
    this.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });

    console.log(`广播消息到 ${this.clients.size} 个客户端:`, data.type);
  }

  // 广播市场数据
  broadcastMarketData(data) {
    this.broadcast({
      type: 'market_data',
      data: data,
      timestamp: Date.now()
    });
  }

  // 广播异动信号
  broadcastAnomalySignal(signal) {
    this.broadcast({
      type: 'anomaly_signal',
      data: signal,
      timestamp: Date.now()
    });
  }

  // 广播恐贪指数
  broadcastFearGreed(data) {
    this.broadcast({
      type: 'fear_greed',
      data: data,
      timestamp: Date.now()
    });
  }

  // 获取客户端数量
  getClientCount() {
    return this.clients.size;
  }
}

export default WebSocketManager;
