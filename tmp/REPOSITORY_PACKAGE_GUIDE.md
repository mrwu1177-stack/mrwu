# HelloYan 仓库包使用指南

## 📦 包信息

**文件名：** web3cs-clean.tar.gz
**大小：** 2.1 MB
**创建时间：** 2026-01-30
**版本：** v1.0

**包含内容：**
- ✅ 36 个核心文件
- ✅ 完整的 Next.js 项目代码
- ✅ 所有 API 路由和代理
- ✅ 前端页面和资源
- ✅ 配置文件和依赖
- ❌ 无多余文档
- ❌ 无测试文件
- ❌ 无历史提交

---

## 🚀 快速开始

### 方法1：解压后推送到 GitHub（推荐）

#### 步骤 1：解压包

```bash
# 在你想要的位置创建目录
mkdir web3cs
cd web3cs

# 解压压缩包
tar -xzf /path/to/web3cs-clean.tar.gz
```

#### 步骤 2：初始化 Git 仓库

```bash
git init
git config user.email "mrwu1177-stack@users.noreply.github.com"
git config user.name "mrwu1177-stack"
git add .
git commit -m "Initial commit: HelloYan 加密货币策略分析系统"
```

#### 步骤 3：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`web3cs`
3. 设为 Public 或 Private
4. 不要初始化 README、.gitignore 或 License
5. 点击 "Create repository"

#### 步骤 4：推送到 GitHub

```bash
git remote add origin https://github.com/mrwu1177-stack/web3cs.git
git branch -M main
git push -u origin main
```

#### 步骤 5：验证

访问 https://github.com/mrwu1177-stack/web3cs 查看代码。

---

### 方法2：直接克隆已存在的仓库（如果你已经创建了）

#### 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`web3cs`
3. 初始化 README.md（可选）
4. 点击 "Create repository"

#### 步骤 2：克隆仓库到本地

```bash
git clone https://github.com/mrwu1177-stack/web3cs.git
cd web3cs
```

#### 步骤 3：解压包并覆盖

```bash
# 解压包到临时目录
mkdir /tmp/web3cs-tmp
tar -xzf /path/to/web3cs-clean.tar.gz -C /tmp/web3cs-tmp

# 复制所有文件到当前目录（除了 .git）
cp -r /tmp/web3cs-tmp/* .
cp -r /tmp/web3cs-tmp/.gitignore .

# 删除临时目录
rm -rf /tmp/web3cs-tmp
```

#### 步骤 4：提交并推送

```bash
git add .
git commit -m "Initial commit: HelloYan 加密货币策略分析系统"
git push origin main
```

---

## 📋 项目结构

```
web3cs/
├── .gitignore              # Git 忽略配置
├── README.md               # 项目说明文档
├── next.config.js          # Next.js 配置
├── package.json            # 项目依赖
├── package-lock.json       # 依赖锁定文件
├── requirements.txt        # Python 依赖（可选）
├── deploy.sh               # 部署脚本
├── app/                    # Next.js 应用目录
│   ├── layout.js           # 根布局
│   ├── page.js             # 首页
│   ├── globals.css         # 全局样式
│   ├── admin/              # 后台管理
│   │   └── page.js         # 管理页面
│   └── api/                # API 路由
│       ├── config/         # 配置 API
│       ├── logs/           # 日志 API
│       ├── users/          # 用户 API
│       ├── test-*/         # 测试 API
│       └── proxy/          # 代理 API
│           ├── binance/    # Binance API 代理
│           ├── coingecko/  # CoinGecko API 代理
│           ├── coingecko-edge/  # Edge API
│           ├── backup-data/  # 备用数据 API
│           ├── okx/        # OKX API 代理
│           ├── bybit/      # Bybit API 代理
│           ├── kucoin/     # KuCoin API 代理
│           └── bitget/     # Bitget API 代理
├── config/                 # 配置文件
│   └── agent_llm_config.json
└── public/                 # 静态文件
    ├── index.html          # 主应用页面
    ├── diagnostic.html     # 网络诊断工具
    ├── favicon.ico         # 网站图标
    ├── icon.png            # 应用图标
    ├── logo.png            # Logo
    ├── icon.svg            # SVG 图标
    └── logo.svg            # SVG Logo
```

---

## 🎯 下一步

### 1. 部署到 Railway

推送到 GitHub 后：

1. 访问 https://railway.app/
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择 `web3cs` 仓库
5. 点击 "Deploy"
6. 等待 2-3 分钟部署完成
7. 配置域名 `heloyan.xyz`

### 2. 本地开发

如果想先在本地测试：

```bash
cd web3cs
npm install
npm run dev
```

访问 http://localhost:3000

⚠️ **注意：** 本地环境可能无法访问外部 API，建议直接部署到 Railway。

---

## ✅ 验证清单

推送到 GitHub 后，检查以下内容：

- [ ] 仓库包含 36 个文件
- [ ] README.md 正确显示
- [ ] package.json 和 package-lock.json 存在
- [ ] 所有 API 路由文件存在
- [ ] public/index.html 存在
- [ ] public/diagnostic.html 存在
- [ ] 所有配置文件存在

---

## 🔍 常见问题

### Q1: 解压后文件在哪里？

A: 解压后会在当前目录创建所有项目文件。

### Q2: 推送到 GitHub 失败怎么办？

A: 确保你已经创建了 GitHub 仓库，并且仓库地址正确。

### Q3: Railway 部署失败怎么办？

A:
1. 检查 package.json 中的依赖是否正确
2. 检查 next.config.js 是否存在
3. 查看 Railway 的部署日志

### Q4: 本地开发看不到数据怎么办？

A: 这是正常的，本地环境可能无法访问外部 API。建议直接部署到 Railway。

---

## 📞 联系方式

- Twitter: [@Mrwu1177](https://twitter.com/Mrwu1177)
- 网址: https://heloyan.xyz

---

**祝你部署顺利！🎉**
