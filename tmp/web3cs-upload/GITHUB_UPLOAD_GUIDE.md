# GitHub 上传指南

## 📁 文件夹信息

**文件夹名称：** web3cs-upload
**文件数量：** 35 个核心文件

---

## 🚀 上传方法

### 方法1：拖拽上传（最简单）

1. 访问：https://github.com/new
2. 仓库名称：`web3cs`
3. **不要**初始化 README
4. 点击 "Create repository"
5. 点击 "uploading an existing file"
6. 将文件夹中**所有内容**拖拽到上传区域
7. 输入提交信息：`Initial commit: HelloYan 加密货币策略分析系统`
8. 点击 "Commit changes"

### 方法2：使用 Git 命令行（推荐）

```bash
cd web3cs-upload

git init
git config user.email "mrwu1177-stack@users.noreply.github.com"
git config user.name "mrwu1177-stack"
git add .
git commit -m "Initial commit: HelloYan 加密货币策略分析系统"
git remote add origin https://github.com/mrwu1177-stack/web3cs.git
git branch -M main
git push -u origin main
```

---

## 📋 文件清单

包含 35 个文件：
- README.md
- .gitignore
- package.json, package-lock.json
- next.config.js
- requirements.txt
- deploy.sh
- app/ 目录（Next.js 应用）
- config/ 目录（配置文件）
- public/ 目录（前端资源）

---

## 🎯 下一步

上传到 GitHub 后：

1. 访问 https://railway.app/
2. "New Project" → "Deploy from GitHub repo"
3. 选择 web3cs 仓库
4. 点击 "Deploy"
5. 配置域名 heloyan.xyz

---

**文件夹已准备就绪！现在可以上传到 GitHub 了！🚀**
