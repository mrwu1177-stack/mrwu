# npm 警告修复说明

## 问题描述
```
npm warn config production Use `--omit=dev` instead.
```

## 解决方案

### 更改的文件

#### 1. `.npmrc` (修改)
```ini
# NPM Configuration

# Installation behavior
omit=dev
legacy-peer-deps=false
strict-peer-deps=true

# Logging
loglevel=warn
```

**说明：**
- `omit=dev`: 指定 npm 安装时跳过 dev 依赖
- `loglevel=warn`: 降低日志级别，隐藏不必要的警告

#### 2. `railway.toml` (新增)
```toml
[build]
builder = "NIXPACKS"

[build.env]
NPM_CONFIG_OMIT = "dev"

[deploy]
startCommand = "npm start"
```

**说明：**
- 设置环境变量 `NPM_CONFIG_OMIT=dev`
- 强制 Railway 构建脚本使用新的 `--omit=dev` 标志
- 明确指定使用 NIXPACKS 构建器（避免 Railpack 问题）

## 部署步骤

### 更新 GitHub 仓库
```bash
# 将更改推送到 GitHub
git push
```

### 等待 Railway 自动部署
- Railway 检测到新提交后会自动重新部署
- 部署时间：约 2-3 分钟

## 预期结果
- ✅ 警告消失或减少
- ✅ 构建成功完成
- ✅ 网站正常运行

## 注意事项
- 即使警告仍然出现，也不会影响构建结果
- 这只是一个弃用提醒，不是错误
- 如果警告仍然困扰你，可以考虑：
  1. 忽略这个警告（推荐）
  2. 使用 Railway 的环境变量功能
  3. 升级 npm 版本到最新

## 验证命令
部署完成后，访问以下地址验证：
- https://mrwu-production.up.railway.app/
- https://www.heloyan.xyz
- https://heloyan.xyz
