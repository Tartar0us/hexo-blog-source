# 日记收件箱 Worker

这个 Worker 给 `/diary-inbox/` 手机页面提供后端：保存当天碎片、调用 AI 生成 Markdown 草稿，并在配置 GitHub Token 后同步到 `Tartar0us/hexo-blog-source`。

## 配置

1. 创建 KV：

```bash
npx wrangler kv namespace create DIARY_INBOX
```

把返回的 `id` 填进 `wrangler.toml`。

2. 设置密钥：

```bash
npx wrangler secret put DIARY_TOKEN
npx wrangler secret put AI_API_URL
npx wrangler secret put AI_API_KEY
npx wrangler secret put GITHUB_TOKEN
```

`DIARY_TOKEN` 是手机页面里填写的口令。`AI_API_URL` 使用 OpenAI 兼容接口地址，例如 `https://api.openai.com/v1`。`GITHUB_TOKEN` 需要有目标源码仓库的 contents 写权限。

3. 部署：

```bash
npx wrangler deploy
```

部署后，把 Worker URL 和 `DIARY_TOKEN` 填进博客的 `/diary-inbox/` 页面设置里。
