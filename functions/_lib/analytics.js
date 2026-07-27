const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: jsonHeaders
  });
}

function unauthorized(error) {
  return json({ ok: false, error: error || 'unauthorized' }, 401);
}

function requireAdmin(request, env) {
  const auth = request.headers.get('authorization') || '';
  const token = request.headers.get('x-admin-token') || auth.replace(/^Bearer\s+/i, '');
  if (!env.ADMIN_TOKEN) return { ok: false, error: 'admin token is not configured' };
  if (token !== env.ADMIN_TOKEN) return { ok: false, error: 'unauthorized' };
  return { ok: true };
}

function parseUA(ua) {
  const lower = ua.toLowerCase();
  const browser = lower.includes('edg/')
    ? 'Edge'
    : lower.includes('chrome/')
      ? 'Chrome'
      : lower.includes('safari/') && !lower.includes('chrome/')
        ? 'Safari'
        : lower.includes('firefox/')
          ? 'Firefox'
          : 'Other';
  const os = lower.includes('windows')
    ? 'Windows'
    : lower.includes('mac os')
      ? 'macOS'
      : lower.includes('android')
        ? 'Android'
        : lower.includes('iphone') || lower.includes('ipad')
          ? 'iOS'
          : lower.includes('linux')
            ? 'Linux'
            : 'Other';
  const device = /mobile|android|iphone|ipad/i.test(ua) ? 'Mobile' : 'Desktop';
  return { browser, os, device };
}

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

function hourKey(date) {
  return date.toISOString().slice(0, 13) + ':00:00Z';
}

async function readJson(request) {
  const text = await request.text();
  if (!text) return {};
  return JSON.parse(text);
}

export async function track(request, env) {
  if (!env.VISITS) return json({ ok: false, error: 'VISITS KV is not configured' }, 500);

  let body;
  try {
    body = await readJson(request);
  } catch (error) {
    return json({ ok: false, error: 'invalid json' }, 400);
  }

  const now = new Date();
  const ua = cleanText(body.userAgent || request.headers.get('user-agent') || '', 500);
  const cf = request.cf || {};
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '';
  const ipHash = ip && env.IP_HASH_SALT ? await sha256(`${env.IP_HASH_SALT}:${ip}`) : '';
  const parsedUA = parseUA(ua);
  const visitorId = cleanText(body.visitorId, 80) || (ipHash ? `ip:${ipHash.slice(0, 16)}` : crypto.randomUUID());

  const event = {
    id: crypto.randomUUID(),
    event: cleanText(body.event, 32) || 'pageview',
    visitorId,
    path: cleanText(body.path, 300) || '/',
    url: cleanText(body.url, 700),
    title: cleanText(body.title, 200),
    referrer: cleanText(body.referrer, 700),
    language: cleanText(body.language, 30),
    screen: cleanText(body.screen, 30),
    viewport: cleanText(body.viewport, 30),
    timezone: cleanText(body.timezone, 80),
    userAgent: ua,
    browser: parsedUA.browser,
    os: parsedUA.os,
    device: parsedUA.device,
    country: cf.country || '',
    city: cf.city || '',
    region: cf.region || '',
    colo: cf.colo || '',
    ipHash,
    createdAt: now.toISOString(),
    day: dayKey(now),
    hour: hourKey(now)
  };

  const key = `visit:${event.createdAt}:${event.id}`;
  await env.VISITS.put(key, JSON.stringify(event));
  return json({ ok: true }, 201);
}

export async function listVisits(request, env) {
  const admin = requireAdmin(request, env);
  if (!admin.ok) return unauthorized(admin.error);
  if (!env.VISITS) return json({ ok: false, error: 'VISITS KV is not configured' }, 500);

  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get('limit') || 100), 500);
  const cursor = url.searchParams.get('cursor') || undefined;
  const listed = await env.VISITS.list({ prefix: 'visit:', limit, cursor });
  const visits = await Promise.all(
    listed.keys.map(async (item) => JSON.parse(await env.VISITS.get(item.name)))
  );

  visits.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return json({ ok: true, visits, cursor: listed.cursor || null, listComplete: listed.list_complete });
}

function countBy(items, field, limit) {
  const map = new Map();
  items.forEach((item) => {
    const key = item[field] || 'Unknown';
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit || 10);
}

export async function summary(request, env) {
  const admin = requireAdmin(request, env);
  if (!admin.ok) return unauthorized(admin.error);
  if (!env.VISITS) return json({ ok: false, error: 'VISITS KV is not configured' }, 500);

  const listed = await env.VISITS.list({ prefix: 'visit:', limit: 1000 });
  const visits = await Promise.all(
    listed.keys.map(async (item) => JSON.parse(await env.VISITS.get(item.name)))
  );
  const visitors = new Set(visits.map((visit) => visit.visitorId));
  const today = dayKey(new Date());
  const todayVisits = visits.filter((visit) => visit.day === today);

  return json({
    ok: true,
    totals: {
      pageviews: visits.length,
      visitors: visitors.size,
      todayPageviews: todayVisits.length,
      todayVisitors: new Set(todayVisits.map((visit) => visit.visitorId)).size
    },
    topPages: countBy(visits, 'path', 8),
    referrers: countBy(visits.filter((visit) => visit.referrer), 'referrer', 8),
    countries: countBy(visits, 'country', 8),
    devices: countBy(visits, 'device', 8),
    recent: visits.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 50)
  });
}
