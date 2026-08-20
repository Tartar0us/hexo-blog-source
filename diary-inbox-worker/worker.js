const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8'
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return withCors(new Response(null, { status: 204 }), request, env);
    }

    try {
      if (!isAuthorized(request, env)) {
        return json({ error: '口令不正确' }, 401, request, env);
      }

      const url = new URL(request.url);
      if (url.pathname === '/api/fragments' && request.method === 'GET') {
        return getFragments(url, request, env);
      }
      if (url.pathname === '/api/fragments' && request.method === 'POST') {
        return saveFragment(request, env);
      }
      if (url.pathname === '/api/fragments' && request.method === 'DELETE') {
        return deleteFragment(url, request, env);
      }
      if (url.pathname === '/api/generate' && request.method === 'POST') {
        return generateDraft(request, env);
      }
      if (url.pathname === '/api/publish' && request.method === 'POST') {
        return publishDraft(request, env);
      }

      return json({ error: 'Not found' }, 404, request, env);
    } catch (error) {
      return json({ error: error.message || 'Worker error' }, 500, request, env);
    }
  }
};

async function getFragments(url, request, env) {
  const date = requireDate(url.searchParams.get('date'));
  const fragments = await readFragments(env, date);
  return json({ date, fragments }, 200, request, env);
}

async function saveFragment(request, env) {
  const body = await request.json();
  const date = requireDate(body.date);
  const fragments = await readFragments(env, date);
  const fragment = {
    id: makeId(),
    date,
    type: String(body.type || 'fragment').slice(0, 40),
    mood: String(body.mood || '').slice(0, 40),
    tags: Array.isArray(body.tags) ? body.tags.map((tag) => String(tag).slice(0, 32)).filter(Boolean).slice(0, 8) : [],
    text: String(body.text || '').trim(),
    createdAt: new Date().toISOString()
  };
  if (!fragment.text) {
    return json({ error: '内容为空' }, 400, request, env);
  }
  fragments.push(fragment);
  await env.DIARY_INBOX.put(fragmentKey(date), JSON.stringify(fragments));
  return json({ fragment, fragments }, 200, request, env);
}

async function deleteFragment(url, request, env) {
  const date = requireDate(url.searchParams.get('date'));
  const id = url.searchParams.get('id');
  const fragments = await readFragments(env, date);
  const next = id ? fragments.filter((fragment) => fragment.id !== id) : [];
  await env.DIARY_INBOX.put(fragmentKey(date), JSON.stringify(next));
  return json({ date, fragments: next }, 200, request, env);
}

async function generateDraft(request, env) {
  const body = await request.json();
  const date = requireDate(body.date);
  const fragments = await readFragments(env, date);
  const markdown = env.AI_API_KEY && env.AI_API_URL
    ? await generateWithAi(env, date, fragments)
    : fallbackMarkdown(date, fragments);
  await env.DIARY_INBOX.put(draftKey(date), markdown);
  return json({ date, markdown }, 200, request, env);
}

async function publishDraft(request, env) {
  const body = await request.json();
  const date = requireDate(body.date);
  const markdown = String(body.markdown || '').trim();
  if (!markdown) {
    return json({ error: '草稿为空' }, 400, request, env);
  }
  await env.DIARY_INBOX.put(draftKey(date), markdown);

  if (!env.GITHUB_TOKEN) {
    return json({ date, saved: true, commitUrl: null }, 200, request, env);
  }

  const result = await writeGithubFile(env, date, markdown);
  return json({ date, saved: true, commitUrl: result.commitUrl, path: result.path }, 200, request, env);
}

async function readFragments(env, date) {
  const value = await env.DIARY_INBOX.get(fragmentKey(date), 'json');
  return Array.isArray(value) ? value : [];
}

async function generateWithAi(env, date, fragments) {
  const prompt = [
    '你是一个私人日记整理助手。请把手机随手记录的碎片整理成一篇自然、真实、第一人称的中文日记。',
    '要求：保留原始情绪和具体细节，不要编造不存在的经历；可以润色逻辑和错别字。',
    '输出 Markdown，包含 Hexo front matter：title、date、categories: diary、tags。正文不要写解释。',
    '',
    `日期：${date}`,
    '碎片：',
    JSON.stringify(fragments, null, 2)
  ].join('\n');

  const response = await fetch(env.AI_API_URL.replace(/\/$/, '') + '/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.AI_API_KEY}`
    },
    body: JSON.stringify({
      model: env.AI_MODEL || 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: '你负责把碎片化日记整理成贴近作者原本语气的博客草稿。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6
    })
  });

  if (!response.ok) {
    throw new Error(`AI 生成失败：${response.status}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || fallbackMarkdown(date, fragments);
}

function fallbackMarkdown(date, fragments) {
  const title = diaryTitle(date);
  const lines = [
    '---',
    `title: ${title}`,
    `date: ${date} 23:50:00`,
    'categories: diary',
    'tags:',
    '  - 日记',
    '---',
    '',
    '# 今日碎片',
    ''
  ];
  if (!fragments.length) {
    lines.push('今天还没有记录碎片。');
  } else {
    for (const item of fragments) {
      const meta = [item.type, item.mood, ...(item.tags || [])].filter(Boolean).join(' / ');
      lines.push(`- ${meta ? `【${meta}】` : ''}${item.text}`);
    }
  }
  lines.push('', '# 晚间整理', '', '这里留给 AI 或自己继续整理。');
  return lines.join('\n');
}

async function writeGithubFile(env, date, markdown) {
  const owner = env.GITHUB_OWNER || 'Tartar0us';
  const repo = env.GITHUB_REPO || 'hexo-blog-source';
  const branch = env.GITHUB_BRANCH || 'main';
  const path = `source/_posts/diary/${diaryTitle(date)}.md`;
  const api = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
  const headers = {
    authorization: `Bearer ${env.GITHUB_TOKEN}`,
    accept: 'application/vnd.github+json',
    'content-type': 'application/json',
    'user-agent': 'tartarous-diary-inbox',
    'x-github-api-version': '2022-11-28'
  };

  const existing = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers });
  let sha;
  if (existing.ok) {
    sha = (await existing.json()).sha;
  } else if (existing.status !== 404) {
    throw new Error(`读取 GitHub 文件失败：${existing.status}`);
  }

  const response = await fetch(api, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `Update diary ${date} from inbox`,
      content: toBase64(markdown),
      branch,
      sha
    })
  });
  if (!response.ok) {
    throw new Error(`写入 GitHub 失败：${response.status}`);
  }
  const data = await response.json();
  return { path, commitUrl: data.commit?.html_url || null };
}

function isAuthorized(request, env) {
  const token = request.headers.get('x-diary-token') || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return Boolean(env.DIARY_TOKEN && token && token === env.DIARY_TOKEN);
}

function requireDate(value) {
  const date = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('日期格式必须是 YYYY-MM-DD');
  }
  return date;
}

function diaryTitle(date) {
  const [year, month, day] = date.split('-').map(Number);
  return `${year}年${month}月${day}日日记`;
}

function fragmentKey(date) {
  return `fragments:${date}`;
}

function draftKey(date) {
  return `draft:${date}`;
}

function makeId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function toBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function json(body, status, request, env) {
  return withCors(new Response(JSON.stringify(body), { status, headers: JSON_HEADERS }), request, env);
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  const origin = request.headers.get('origin') || '';
  const allowed = (env.ALLOWED_ORIGIN || '*').split(',').map((item) => item.trim());
  headers.set('access-control-allow-origin', allowed.includes('*') || allowed.includes(origin) ? origin || '*' : allowed[0]);
  headers.set('access-control-allow-methods', 'GET,POST,DELETE,OPTIONS');
  headers.set('access-control-allow-headers', 'content-type,x-diary-token,authorization');
  headers.set('vary', 'Origin');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
