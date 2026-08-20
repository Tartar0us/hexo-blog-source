---
title: 日记收件箱
date: 2026-08-20 10:00:00
type: diary-inbox
comments: false
---

<div id="diary-inbox-app" class="diary-inbox-shell">
  <section class="diary-inbox-hero">
    <div>
      <p class="diary-inbox-kicker">Mobile Diary Inbox</p>
      <h1>日记收件箱</h1>
      <p id="diaryInboxStatus" class="diary-inbox-status">正在读取本机设置...</p>
    </div>
    <button id="diaryInboxSettingsToggle" class="diary-inbox-icon-button" type="button" title="设置" aria-label="设置">⚙</button>
  </section>

  <section id="diaryInboxSettings" class="diary-inbox-panel diary-inbox-settings" hidden>
    <label>
      <span>Worker 地址</span>
      <input id="diaryInboxEndpoint" type="url" inputmode="url" placeholder="https://your-worker.workers.dev">
    </label>
    <button id="diaryInboxSaveSettings" class="diary-inbox-primary" type="button">保存设置</button>
  </section>

  <section class="diary-inbox-grid">
    <form id="diaryInboxForm" class="diary-inbox-panel diary-inbox-compose">
      <div class="diary-inbox-form-row">
        <label>
          <span>日期</span>
          <input id="diaryInboxDate" type="date" required>
        </label>
        <label>
          <span>类别</span>
          <select id="diaryInboxType">
            <option value="fragment">碎片</option>
            <option value="thought">想法</option>
            <option value="task">任务</option>
            <option value="quote">原话</option>
          </select>
        </label>
      </div>
      <div class="diary-inbox-form-row">
        <label>
          <span>状态</span>
          <select id="diaryInboxMood">
            <option value="">不标记</option>
            <option value="calm">平静</option>
            <option value="focused">专注</option>
            <option value="tired">疲惫</option>
            <option value="bright">高能</option>
            <option value="heavy">低落</option>
          </select>
        </label>
        <label>
          <span>标签</span>
          <input id="diaryInboxTags" type="text" placeholder="学习, 实习, 生活">
        </label>
      </div>
      <label>
        <span>记录</span>
        <textarea id="diaryInboxText" rows="8" placeholder="先随便写，乱一点也可以。"></textarea>
      </label>
      <div class="diary-inbox-actions">
        <button class="diary-inbox-primary" type="submit">收进今天</button>
        <button id="diaryInboxLoad" class="diary-inbox-secondary" type="button">刷新</button>
      </div>
    </form>

    <section class="diary-inbox-panel">
      <div class="diary-inbox-panel-head">
        <h2>当天碎片</h2>
        <button id="diaryInboxGenerate" class="diary-inbox-secondary" type="button">生成草稿</button>
      </div>
      <div id="diaryInboxFragments" class="diary-inbox-fragments"></div>
    </section>
  </section>

  <section class="diary-inbox-panel diary-inbox-draft-panel">
    <div class="diary-inbox-panel-head">
      <h2>AI 草稿</h2>
      <button id="diaryInboxPublish" class="diary-inbox-primary" type="button">同步到仓库</button>
    </div>
    <textarea id="diaryInboxDraft" rows="16" spellcheck="false" placeholder="生成后的 Markdown 会在这里出现，也可以直接改。"></textarea>
  </section>
</div>

<script>
(function () {
  const DEFAULT_ENDPOINT = 'https://tartarous-diary-inbox.tartarous-blog-3010383177.workers.dev';
  const storage = {
    endpoint: 'tartarous_diary_inbox_endpoint'
  };
  const $ = (id) => document.getElementById(id);
  const state = { fragments: [] };
  const els = {
    status: $('diaryInboxStatus'),
    settings: $('diaryInboxSettings'),
    settingsToggle: $('diaryInboxSettingsToggle'),
    endpoint: $('diaryInboxEndpoint'),
    saveSettings: $('diaryInboxSaveSettings'),
    form: $('diaryInboxForm'),
    date: $('diaryInboxDate'),
    type: $('diaryInboxType'),
    mood: $('diaryInboxMood'),
    tags: $('diaryInboxTags'),
    text: $('diaryInboxText'),
    load: $('diaryInboxLoad'),
    generate: $('diaryInboxGenerate'),
    publish: $('diaryInboxPublish'),
    fragments: $('diaryInboxFragments'),
    draft: $('diaryInboxDraft')
  };

  function today() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
  }

  function setStatus(text, tone) {
    els.status.textContent = text;
    els.status.dataset.tone = tone || '';
  }

  function settings() {
    return {
      endpoint: localStorage.getItem(storage.endpoint) || DEFAULT_ENDPOINT
    };
  }

  function applySettingsToInputs() {
    const saved = settings();
    els.endpoint.value = saved.endpoint;
    setStatus('已连接日记收件箱', 'ok');
  }

  async function api(path, options) {
    const saved = settings();
    if (!saved.endpoint) {
      els.settings.hidden = false;
      throw new Error('缺少 Worker 地址');
    }
    const response = await fetch(saved.endpoint.replace(/\/$/, '') + path, {
      ...options,
      headers: {
        'content-type': 'application/json',
        ...(options && options.headers ? options.headers : {})
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error) {
      throw new Error(data.error || '请求失败');
    }
    return data;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function renderFragments() {
    if (!state.fragments.length) {
      els.fragments.innerHTML = '<p class="diary-inbox-empty">这一天还没有收进碎片。</p>';
      return;
    }
    els.fragments.innerHTML = state.fragments.map((item) => `
      <article class="diary-inbox-fragment">
        <div class="diary-inbox-fragment-meta">
          <span>${escapeHtml(item.type || 'fragment')}</span>
          ${item.mood ? `<span>${escapeHtml(item.mood)}</span>` : ''}
          ${Array.isArray(item.tags) && item.tags.length ? `<span>${escapeHtml(item.tags.join(' / '))}</span>` : ''}
        </div>
        <p>${escapeHtml(item.text)}</p>
      </article>
    `).join('');
  }

  async function loadFragments() {
    setStatus('正在读取当天碎片...', '');
    const data = await api('/api/fragments?date=' + encodeURIComponent(els.date.value));
    state.fragments = data.fragments || [];
    renderFragments();
    setStatus(`已读取 ${state.fragments.length} 条碎片`, 'ok');
  }

  els.settingsToggle.addEventListener('click', () => {
    els.settings.hidden = !els.settings.hidden;
  });

  els.saveSettings.addEventListener('click', () => {
    localStorage.setItem(storage.endpoint, els.endpoint.value.trim());
    applySettingsToInputs();
  });

  els.form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = els.text.value.trim();
    if (!text) {
      setStatus('先写一点内容再收进来', 'warn');
      return;
    }
    try {
      setStatus('正在保存...', '');
      await api('/api/fragments', {
        method: 'POST',
        body: JSON.stringify({
          date: els.date.value,
          type: els.type.value,
          mood: els.mood.value,
          tags: els.tags.value.split(/[，,]/).map((tag) => tag.trim()).filter(Boolean),
          text
        })
      });
      els.text.value = '';
      await loadFragments();
    } catch (error) {
      setStatus(error.message, 'warn');
    }
  });

  els.load.addEventListener('click', () => {
    loadFragments().catch((error) => setStatus(error.message, 'warn'));
  });

  els.generate.addEventListener('click', async () => {
    try {
      setStatus('正在整理成草稿...', '');
      const data = await api('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ date: els.date.value })
      });
      els.draft.value = data.markdown || '';
      setStatus(data.aiError || '草稿已生成', data.aiError ? 'warn' : 'ok');
    } catch (error) {
      setStatus(error.message, 'warn');
    }
  });

  els.publish.addEventListener('click', async () => {
    try {
      if (!els.draft.value.trim()) {
        setStatus('草稿为空，先生成或粘贴 Markdown', 'warn');
        return;
      }
      setStatus('正在同步到 GitHub 源码仓库...', '');
      const data = await api('/api/publish', {
        method: 'POST',
        body: JSON.stringify({ date: els.date.value, markdown: els.draft.value })
      });
      setStatus(data.commitUrl ? '已同步到仓库' : '已保存草稿', 'ok');
    } catch (error) {
      setStatus(error.message, 'warn');
    }
  });

  els.date.addEventListener('change', () => {
    loadFragments().catch(() => renderFragments());
  });

  const manifest = document.createElement('link');
  manifest.rel = 'manifest';
  manifest.href = '/diary-inbox/manifest.json';
  document.head.appendChild(manifest);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/diary-inbox/sw.js').catch(() => {});
  }

  els.date.value = today();
  applySettingsToInputs();
  renderFragments();
})();
</script>

<style>
.diary-inbox-shell {
  --inbox-ink: #2f3033;
  --inbox-muted: #76716c;
  --inbox-line: #ece4dc;
  --inbox-paper: #fffdf9;
  --inbox-soft: #faf2ea;
  --inbox-accent: #e97958;
  --inbox-accent-dark: #c95438;
  max-width: 1060px;
  margin: 0 auto;
  padding: 28px 16px 64px;
  color: var(--inbox-ink);
}
.diary-inbox-hero,
.diary-inbox-panel {
  background: var(--inbox-paper);
  border: 1px solid var(--inbox-line);
  border-radius: 8px;
  box-shadow: 0 18px 48px rgba(58, 43, 32, 0.08);
}
.diary-inbox-hero {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  padding: 24px;
  margin-bottom: 16px;
}
.diary-inbox-kicker {
  margin: 0 0 8px;
  color: var(--inbox-accent-dark);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}
.diary-inbox-hero h1,
.diary-inbox-panel h2 {
  margin: 0;
  letter-spacing: 0;
}
.diary-inbox-hero h1 {
  font-size: 32px;
}
.diary-inbox-status {
  margin: 10px 0 0;
  color: var(--inbox-muted);
}
.diary-inbox-status[data-tone="ok"] {
  color: #3b7a52;
}
.diary-inbox-status[data-tone="warn"] {
  color: #b4472f;
}
.diary-inbox-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 0.9fr);
  gap: 16px;
}
.diary-inbox-panel {
  padding: 18px;
  margin-bottom: 16px;
}
.diary-inbox-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.diary-inbox-shell label {
  display: grid;
  gap: 7px;
  margin-bottom: 12px;
  font-weight: 700;
}
.diary-inbox-shell label span {
  font-size: 14px;
  color: var(--inbox-muted);
}
.diary-inbox-shell input,
.diary-inbox-shell select,
.diary-inbox-shell textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--inbox-line);
  border-radius: 8px;
  background: #fff;
  color: var(--inbox-ink);
  font: inherit;
  padding: 11px 12px;
  outline: none;
}
.diary-inbox-shell textarea {
  resize: vertical;
  line-height: 1.75;
}
.diary-inbox-shell input:focus,
.diary-inbox-shell select:focus,
.diary-inbox-shell textarea:focus {
  border-color: var(--inbox-accent);
  box-shadow: 0 0 0 3px rgba(233, 121, 88, 0.14);
}
.diary-inbox-actions,
.diary-inbox-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.diary-inbox-primary,
.diary-inbox-secondary,
.diary-inbox-icon-button {
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  min-height: 42px;
}
.diary-inbox-primary {
  background: var(--inbox-accent);
  color: #fff;
  padding: 0 18px;
}
.diary-inbox-secondary,
.diary-inbox-icon-button {
  background: var(--inbox-soft);
  color: var(--inbox-accent-dark);
  padding: 0 14px;
}
.diary-inbox-icon-button {
  width: 42px;
  padding: 0;
}
.diary-inbox-fragments {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}
.diary-inbox-fragment {
  border: 1px solid var(--inbox-line);
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}
.diary-inbox-fragment p {
  margin: 8px 0 0;
  line-height: 1.7;
  white-space: pre-wrap;
}
.diary-inbox-fragment-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.diary-inbox-fragment-meta span {
  border-radius: 999px;
  background: var(--inbox-soft);
  color: var(--inbox-accent-dark);
  font-size: 12px;
  padding: 4px 8px;
}
.diary-inbox-empty {
  color: var(--inbox-muted);
  margin: 0;
}
.diary-inbox-draft-panel textarea {
  min-height: 360px;
  margin-top: 14px;
  font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
  font-size: 14px;
}
@media (max-width: 780px) {
  .diary-inbox-shell {
    padding: 16px 10px 40px;
  }
  .diary-inbox-hero,
  .diary-inbox-panel {
    padding: 16px;
  }
  .diary-inbox-grid,
  .diary-inbox-form-row {
    grid-template-columns: 1fr;
  }
  .diary-inbox-panel-head,
  .diary-inbox-actions {
    align-items: stretch;
    flex-direction: column;
  }
  .diary-inbox-primary,
  .diary-inbox-secondary {
    width: 100%;
  }
}
</style>
