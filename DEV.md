# chaoxing - 超星学习通修改教程

使用 MT 管理器修改超星学习通的详细教程，基于 VitePress 构建文档站点。

## 本地预览

### 前提条件

- 安装 [Node.js](https://nodejs.org/)（推荐 v18 或更高版本）

### 步骤

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务器
npm run docs:dev

# 3. 浏览器打开终端显示的地址（通常是 http://localhost:5173/chaoxing/）
#    修改文件后浏览器会自动热更新
```

### 构建生产版本

```bash
npm run docs:build
npm run docs:preview
```

## 自动部署

每次推送到 `master` 分支，GitHub Actions 会自动构建并部署到 GitHub Pages：

1. 推送代码到 GitHub
2. 进入仓库 Settings → Pages，确保 Source 设置为 **GitHub Actions**
3. 等待 Action 运行完成即可访问

## 强制覆盖远程仓库

> 如果远程仓库（origin）指向 https://github.com/qcxs/chaoxing，执行以下命令强制覆盖：

```bash
# 1. 确保远程地址正确
git remote set-url origin https://github.com/qcxs/chaoxing.git

# 2. 强制推送到远程 master 分支
git push origin master --force
```

> ⚠️ 注意：`--force` 会覆盖远程仓库的所有历史记录，不可恢复。建议先备份远程仓库或告知协作者。
