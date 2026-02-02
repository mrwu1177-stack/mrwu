import express from 'express';
import cors from 'cors';
import http from 'http';
import WebSocketManager from './utils/websocket.js';
import apiService from './services/apiService.js';
import models from './models/index.js';
import cron from 'node-cron';

const app = express();
const server = http.createServer(app);
const wsManager = new WebSocketManager(server);

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    clients: wsManager.getClientCount()
  });
});

// API路由

// 获取市场数据
app.get('/api/market-data', async (req, res) => {
  try {
    const data = await models.MarketData.getAll();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取异动信号
app.get('/api/signals', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const signals = await models.AnomalySignal.getRecent(limit);
    res.json({ success: true, data: signals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取恐贪指数
app.get('/api/fear-greed', async (req, res) => {
  try {
    const latest = await models.FearGreed.getLatest();
    res.json({ success: true, data: latest });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取全球市场数据
app.get('/api/global-market', async (req, res) => {
  try {
    const marketData = await models.MarketData.getAll();
    
    res.json({
      success: true,
      data: {
        totalMarketCap: marketData.reduce((sum, d) => sum + (d.marketCap || 0), 0),
        totalVolume: marketData.reduce((sum, d) => sum + (d.volume24h || 0), 0),
        btcDominance: marketData.find(m => m.symbol === 'BTCUSDT') 
          ? (marketData.find(m => m.symbol === 'BTCUSDT').marketCap / 
             marketData.reduce((sum, d) => sum + (d.marketCap || 0), 0) * 100)
          : 0,
        ethDominance: marketData.find(m => m.symbol === 'ETHUSDT') 
          ? (marketData.find(m => m.symbol === 'ETHUSDT').marketCap / 
             marketData.reduce((sum, d) => sum + (d.marketCap || 0), 0) * 100)
          : 0,
        activeCryptos: marketData.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 定时任务：每分钟刷新市场数据
async function refreshMarketData() {
  try {
    console.log('开始刷新市场数据...');
    
    // 获取市场数据
    const marketData = await apiService.fetchMarketData();
    if (marketData.length > 0) {
      models.MarketData.upsertMany(marketData);
      wsManager.broadcastMarketData(marketData.slice(0, 20)); // 广播前20个
    }

    // 获取恐贪指数
    const fearGreed = await apiService.fetchFearGreedIndex();
    if (fearGreed) {
      models.FearGreed.save(fearGreed);
      wsManager.broadcastFearGreed(fearGreed);
    }

    // 分析异动信号
    const anomalies = apiService.analyzeAnomalies(marketData);
    if (anomalies.length > 0) {
      models.AnomalySignal.save(anomalies);
      anomalies.forEach(signal => {
        wsManager.broadcastAnomalySignal(signal);
      });
    }

    console.log(`市场数据刷新完成: ${marketData.length} 个币种, ${anomalies.length} 个异动`);
  } catch (error) {
    console.error('刷新市场数据失败:', error.message);
  }
}

// 启动时执行一次
refreshMarketData();

// 每分钟执行一次
cron.schedule('* * * * *', () => {
  refreshMarketData();
});

// 每天清理旧数据（凌晨3点）
cron.schedule('0 3 * * *', async () => {
  console.log('开始清理旧数据...');
  await models.AnomalySignal.cleanup();
  await models.FearGreed.cleanup();
});

// 启动服务器
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}/ws`);
});

export default app;
