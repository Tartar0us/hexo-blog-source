# Cloudflare Pages 部署说明

这个项目可以同时保留 GitHub Pages 和 Cloudflare Pages。

推荐结构：

- GitHub：保存 Hexo 博客源码。
- GitHub Pages：继续保留原网站 `https://tartar0us.github.io/`。
- Cloudflare Pages：从 GitHub 源码仓库自动构建并发布一份相同网站。
- Cloudflare Pages Functions：提供同源统计接口 `/api/track`、`/api/summary`、`/api/visits`。

## Cloudflare Pages 配置

在 Cloudflare Dashboard 里创建 Pages 项目时选择连接 GitHub 仓库。

如果 GitHub 仓库根目录就是当前 `blog` 目录，填写：

```text
Framework preset: Hexo
Build command: npm run build
Build output directory: public
Root directory: /
```

如果 GitHub 仓库根目录是外层 `hexo-blog`，而博客在 `blog` 子目录，填写：

```text
Framework preset: Hexo
Build command: npm run build
Build output directory: public
Root directory: blog
```

## 环境变量

在 Cloudflare Pages 项目的 Settings -> Environment variables 里添加：

```text
ADMIN_TOKEN = 你的管理员口令
IP_HASH_SALT = 一串随机长字符串
```

`ADMIN_TOKEN` 用于打开 `/stats/` 查看数据。

## KV 绑定

在 Cloudflare Pages 项目的 Settings -> Functions -> KV namespace bindings 里添加：

```text
Variable name: VISITS
KV namespace: tartarous-visitor-analytics-visits
```

可以复用之前 Worker 自动创建的 KV namespace。

## 访问统计路径

Cloudflare Pages 上会使用同源接口：

```text
/api/track
/api/summary
/api/visits
```

GitHub Pages 上会继续使用之前的 Worker：

```text
https://tartarous-visitor-analytics.tartarous-blog-3010383177.workers.dev
```

因此两个网站可以同时存在，但更推荐把 Cloudflare Pages 地址作为主入口。
