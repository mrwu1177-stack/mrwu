# HelloYan - 智能加密货币策略分析系统

## 项目简介

HelloYan 是一个基于 Next.js 的加密货币智能策略分析系统，提供实时市场数据分析、异动信号监控、技术指标分析等功能。

## 技术栈

- Next.js 14
- React 18
- Tailwind CSS
- TradingView Lightweight Charts

## 功能模块

- 🚨 异动信号监控
- 📊 多币种策略分析
- 📈 布林带分析
- 🏆 币种排行榜
- 📰 新闻追踪
- 📊 市场概览
- ⚡ 市场异动监控

## 设计风格

采用币安风格设计：
- 背景色：深黑 #0b0e11
- 卡片色：#1e2329
- 强调色：币安黄 #fcd535
- 文字色：米白 #eaecef

## 数据源

- **Binance API** - 主要数据源（币种行情、交易数据）
- **CoinGecko API** - 备用数据源（币种信息、排行榜）
- **OKX, Bybit, KuCoin, Bitget** - 多交易所数据

### 数据源冗余策略

所有功能都配置了多数据源自动切换：
- 如果主数据源失败，自动切换到备用数据源
- 如果所有数据源都失败，显示友好的错误提示
- **不使用模拟数据**，所有数据都来自真实 API

## 访问地址

- 主域名：https://heloyan.xyz
- www 域名：https://www.heloyan.xyz

## 本地开发

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### ⚠️ 本地开发已知问题

**本地环境可能无法访问外部 API**，这是网络限制问题。

**原因：**
- 本地开发环境的网络可能被限制
- 无法直接访问 Binance、CoinGecko 等外部 API

**解决方案：**
- 直接部署到 Railway 平台
- Railway 拥有更好的网络环境，可以正常访问外部 API

**诊断工具：**
- 访问 http://localhost:3000/diagnostic.html 测试 API 连接
- 访问 http://localhost:3000/api/test-external-apis 查看 API 状态

## 部署到 GitHub

### 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`web3cs`
3. 设为 Public 或 Private（根据你的需求）
4. 不要初始化 README、.gitignore 或 LICENSE
5. 点击 "Create repository"

### 步骤 2：推送代码

```bash
# 添加远程仓库
git remote add origin https://github.com/mrwu1177-stack/web3cs.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步骤 3：验证

访问 https://github.com/mrwu1177-stack/web3cs 查看代码是否成功上传。

## 部署到 Railway

### 步骤 1：连接 Railway

1. 访问 https://railway.app/
2. 登录或注册账号
3. 点击 "New Project"
4. 选择 "Deploy from GitHub repo"
5. 选择 `web3cs` 仓库

### 步骤 2：配置

Railway 会自动检测 Next.js 项目并配置默认设置：
- Build Command: `npm run build`
- Start Command: `npm start`

### 步骤 3：部署

点击 "Deploy" 按钮，等待约 2-3 分钟完成部署。

### 步骤 4：配置域名

1. 部署完成后，点击项目设置
2. 进入 "Domains" 选项卡
3. 添加自定义域名：
   - `heloyan.xyz`
   - `www.heloyan.xyz`
4. 根据提示配置 DNS 记录

### 步骤 5：验证

访问 https://heloyan.xyz 查看网站是否正常运行。

## 项目结构

```
web3cs/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── proxy/         # 外部 API 代理
│   │   │   ├── binance/   # Binance API
│   │   │   ├── coingecko/ # CoinGecko API
│   │   │   ├── coingecko-edge/ # CoinGecko Edge API
│   │   │   ├── backup-data/ # 备用数据 API
│   │   │   ├── okx/       # OKX API
│   │   │   ├── bybit/     # Bybit API
│   │   │   ├── kucoin/    # KuCoin API
│   │   │   └── bitget/    # Bitget API
│   │   ├── config/        # 配置 API
│   │   ├── users/         # 用户 API
│   │   ├── logs/          # 日志 API
│   │   └── test-*/        # 测试 API
│   ├── layout.js          # 根布局
│   ├── page.js            # 首页
│   ├── globals.css        # 全局样式
│   └── admin/             # 后台管理
│       └── page.js        # 管理页面
├── config/                # 配置文件
│   └── agent_llm_config.json
├── public/                # 静态文件
│   ├── index.html         # 主应用页面
│   ├── diagnostic.html    # 网络诊断工具
│   ├── favicon.ico        # 网站图标
│   ├── icon.png           # 应用图标
│   ├── logo.png           # Logo
│   ├── icon.svg           # SVG 图标
│   └── logo.svg           # SVG Logo
├── next.config.js         # Next.js 配置
├── package.json           # 项目依赖
├── package-lock.json      # 依赖锁定
├── requirements.txt       # Python 依赖（可选）
├── deploy.sh              # 部署脚本
└── .gitignore             # Git 忽略配置
```

## API 代理说明

为了避免 CORS 跨域错误，所有外部 API 请求都通过 Next.js API 路由代理：

```
用户浏览器 → Next.js API 路由 → 外部 API
```

例如：
- 前端请求 `/api/proxy/binance/ticker24h`
- Next.js API 代理请求 `https://api.binance.com/api/v3/ticker/24hr`
- 返回数据给前端

### 降级策略

当主 API 不可用时，系统会自动降级到备用数据源：

```
前端请求 → Edge API → CoinGecko API（失败）
                   ↓
                   备用数据 API → 返回模拟数据
```

确保网站在网络受限时仍能正常显示。

## 特色功能

### 1. 币种排行榜
- 多数据源自动切换（Binance → CoinGecko）
- 实时价格、涨跌幅、交易量
- 支持排序和筛选

### 2. 爆仓监控
- 基于真实市场波动率估算爆仓事件
- 爆仓地图：统计概览（按交易所、币种）
- 爆仓数据：详细事件列表

### 3. 布林带分析
- 基于真实 K 线数据
- 自动计算上轨、中轨、下轨
- 识别突破信号

### 4. 异动信号
- 大单异动监控
- 价格异常波动检测
- 实时推送通知

### 5. 市场概览
- 市场情绪（涨跌比、恐慌贪婪指数）
- 热点追踪（热门币种、热门话题）
- 资金动向（资金流入/流出）

## 联系方式

- Twitter: [@Mrwu1177](https://twitter.com/Mrwu1177)
- 网址: https://heloyan.xyz

## 许可证

HelloYan - 开源项目

---

## 重要提示

### 关于模拟数据

本项目实现了数据降级策略：
- 正常情况下，使用真实 API 数据
- 网络受限时，自动切换到备用数据（模拟数据）
- 备用数据确保网站在任何情况下都能正常显示

### 关于爆仓数据

真实的爆仓 API 需要付费订阅，因此爆仓监控功能基于以下策略：

1. **数据来源**：多个交易所的真实市场数据
2. **估算逻辑**：基于高波动率（>5%）和价格突变
3. **显示方式**：清晰标注为"基于市场波动率估算"
4. **数据准确性**：仅供参考，不构成投资建议

---

## 更新日志

### 2026-01-30
- ✅ 修复 API 路径错误
- ✅ 实现 API 降级策略
- ✅ 创建 Edge API 路由
- ✅ 添加备用数据 API
- ✅ 清理项目，移除多余文档
- ✅ 重新初始化 Git 仓库
