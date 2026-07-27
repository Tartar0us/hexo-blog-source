# hexo-blog-source

Tartar0us 的 Hexo 博客源码仓库。

## 本地构建

```bash
npm install
npm run build
```

## Cloudflare Pages

Cloudflare Workers/Pages Git 部署配置：

```text
Build command: npm run build
Deploy command: npx wrangler deploy
```

统计接口通过 Cloudflare Pages Functions 提供：

```text
/api/track
/api/summary
/api/visits
```

详细配置见 `CLOUDFLARE_PAGES.md`。
