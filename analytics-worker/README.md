# Visitor analytics backend

This Cloudflare Worker receives pageview events from the Hexo blog and stores
them in Cloudflare KV. The public website only sends data to `/api/track`; the
dashboard reads `/api/summary` with an admin token.

## Deploy

1. Log in to Cloudflare:

```bash
npx wrangler login
```

2. Set your private admin password for `/stats/`:

```bash
npx wrangler secret put ADMIN_TOKEN
```

3. Set a different random secret used to hash visitor IPs:

```bash
npx wrangler secret put IP_HASH_SALT
```

4. Deploy the Worker:

```bash
npx wrangler deploy
```

Wrangler can automatically create the KV namespace declared in `wrangler.toml`.
If it asks for permission to update `wrangler.toml`, allow it.

5. Copy the deployed Worker URL and replace
   `https://YOUR-WORKER-SUBDOMAIN.workers.dev` in `../_config.shoka.yml`.
6. Run `npm run build` and deploy the Hexo site again.

## What is recorded

The tracker records page path, page title, referrer, browser, OS, device type,
language, timezone, screen size, country/region/city from Cloudflare metadata,
and a browser-generated visitor ID. It does not know a visitor's real name
unless you add a login system later.
