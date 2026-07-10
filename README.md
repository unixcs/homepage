# 个人主页（链接聚合页）

部署到 Cloudflare Pages 的纯静态个人主页，对应域名 `fengx.eu.org`。

## 本地预览

```bash
cd homepage
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 自定义

编辑 `index.html` 中的注释标记处：

- `<title>`：浏览器标签标题
- `.avatar`：把首字母占位换成 `<img src="avatar.jpg" alt="头像" />`
- `h1` / `.tagline`：名字与简介
- `.links` 内的 `<a>`：增删跳转按钮（博客按钮已指向 `https://blog.fengx.eu.org`）

## Cloudflare Pages 设置

- 源码：本仓库（GitHub 连接）
- 构建命令：**留空**
- 输出目录：`/`（仓库根目录）
- 自定义域名：`fengx.eu.org`
