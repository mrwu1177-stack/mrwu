# 加密货币异动监控系统

基于前后端分离架构的加密货币实时监控系统，支持WebSocket实时推送、数据持久化和移动端自适应。

## 项目架构

### 后端服务 (Port 5001)
- **技术栈**: Node.js, Express, WebSocket, JSON文件存储
- **功能**:
  - 定时获取市场数据（CoinGecko API）
  - 分析异动信号（24h涨跌幅>10%）
  - 恐贪指数监控
  - WebSocket实时数据推送
  - 数据持久化存储（JSON文件）

### 前端应用 (Port 5000)
- **技术栈**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **功能**:
  - 实时异动信号展示
  - 恐贪指数可视化
  - 市场数据概览
  - WebSocket实时更新
  - 移动端自适应

## 启动方式

### 方式1: 使用Coze CLI（推荐）

```bash
# 启动开发环境（同时启动前端和后端）
cd /workspace/projects
coze dev
```

### 方式2: 手动启动

```bash
# 启动后端服务
cd /workspace/projects/server
node src/index.js

# 启动前端服务（新终端）
cd /workspace/projects/crypto-monitor
npx next dev --port 5000
```

## API文档

### 健康检查
```
GET http://localhost:5001/health
```

### 获取市场数据
```
GET http://localhost:5001/api/market-data
```

### 获取异动信号
```
GET http://localhost:5001/api/signals?limit=50
```

### 获取恐贪指数
```
GET http://localhost:5001/api/fear-greed
```

### 获取全球市场数据
```
GET http://localhost:5001/api/global-market
```

## WebSocket连接

```
ws://localhost:5001/ws
```

### 消息类型

#### 1. 连接确认
```json
{
  "type": "connected",
  "message": "WebSocket连接成功",
  "timestamp": 1770047629000
}
```

#### 2. 市场数据更新
```json
{
  "type": "market_data",
  "data": [...],
  "timestamp": 1770047629000
}
```

#### 3. 异动信号
```json
{
  "type": "anomaly_signal",
  "data": {
    "symbol": "BTCUSDT",
    "signalType": "主拉",
    "price": 68040.04,
    "change24h": 15.5,
    "direction": "up"
  },
  "timestamp": 1770047629000
}
```

#### 4. 恐贪指数
```json
{
  "type": "fear_greed",
  "data": {
    "value": 45,
    "classification": "Neutral"
  },
  "timestamp": 1770047629000
}
```

## 数据持久化

数据存储在 `/workspace/projects/server/data/` 目录下：

- `signals.json` - 异动信号历史
- `market.json` - 市场数据
- `fear-greed.json` - 恐贪指数历史

## 定时任务

- **每分钟**: 刷新市场数据并推送
- **每天凌晨3点**: 清理7天前的异动信号和30天前的恐贪指数

## 注意事项

1. **API限流**: 当前使用CoinGecko API，有请求频率限制。当API不可用时，系统会自动切换到模拟数据模式。

2. **WebSocket自动重连**: 前端实现了自动重连机制，最多重试5次。

3. **数据保留**: 异动信号保留7天，恐贪指数保留30天。

4. **端口占用**:
   - 前端: 5000
   - 后端: 5001
   - WebSocket: 5001/ws

## 项目结构

```
/workspace/projects/
├── server/                    # 后端服务
│   ├── src/
│   │   ├── config/            # 数据库配置
│   │   ├── models/            # 数据模型
│   │   ├── services/          # API服务
│   │   ├── utils/             # WebSocket工具
│   │   └── index.js           # 主入口
│   ├── data/                  # 数据存储目录
│   └── package.json
├── crypto-monitor/            # 前端应用
│   ├── src/
│   │   ├── app/               # 页面
│   │   ├── hooks/             # React Hooks
│   │   └── services/          # API服务
│   └── package.json
└── .coze                      # Coze CLI配置
```

## 开发指南

### 添加新的API端点

1. 在 `server/src/index.js` 添加路由
2. 在 `server/src/services/apiService.js` 实现数据获取逻辑
3. 在 `crypto-monitor/src/services/api.ts` 添加TypeScript类型和函数

### 添加新的WebSocket消息类型

1. 在 `server/src/utils/websocket.js` 添加广播方法
2. 在 `crypto-monitor/src/hooks/useWebSocket.ts` 添加消息处理

## 许可证

MIT
