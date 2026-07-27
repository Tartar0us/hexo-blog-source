---
title: 网站统计
date: 2025-09-20
type: "stats"
layout: "page"
---

<style>
.analytics-dashboard {
  --panel: #ffffff;
  --ink: #1e293b;
  --muted: #64748b;
  --line: #d8e0ea;
  --accent: #2563eb;
  --accent-2: #0f766e;
  --soft: #eef5ff;
  color: var(--ink);
}

.analytics-dashboard * {
  box-sizing: border-box;
}

.analytics-hero {
  padding: 28px 0 18px;
  border-bottom: 1px solid var(--line);
}

.analytics-title {
  margin: 0 0 8px;
  font-size: 30px;
  letter-spacing: 0;
}

.analytics-subtitle {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.analytics-config {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 10px;
  margin: 22px 0;
  align-items: center;
}

.analytics-input {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: var(--ink);
}

.analytics-button {
  height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.analytics-button.secondary {
  background: #334155;
}

.analytics-button:disabled {
  opacity: .55;
  cursor: wait;
}

.analytics-status {
  min-height: 22px;
  color: var(--muted);
  font-size: 14px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 18px 0;
}

.metric-card,
.analytics-section {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
}

.metric-card {
  padding: 16px;
}

.metric-label {
  color: var(--muted);
  font-size: 13px;
}

.metric-value {
  margin-top: 8px;
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
}

.analytics-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 14px;
  margin-top: 16px;
}

.analytics-section {
  padding: 16px;
}

.section-title {
  margin: 0 0 12px;
  font-size: 18px;
}

.table-wrap {
  overflow-x: auto;
}

.visit-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

.visit-table th,
.visit-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #edf1f6;
  text-align: left;
  vertical-align: top;
  font-size: 13px;
}

.visit-table th {
  color: #475569;
  font-weight: 700;
  background: #f8fafc;
}

.visit-table code {
  white-space: nowrap;
}

.ranking {
  display: grid;
  gap: 10px;
}

.rank-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #edf1f6;
}

.rank-row:last-child {
  border-bottom: 0;
}

.rank-name {
  overflow-wrap: anywhere;
  color: #334155;
}

.rank-count {
  color: var(--accent-2);
  font-weight: 800;
}

.setup-note {
  margin-top: 18px;
  padding: 14px 16px;
  border: 1px solid #c7d2fe;
  border-radius: 8px;
  background: var(--soft);
  color: #334155;
  line-height: 1.8;
}

@media (max-width: 860px) {
  .analytics-config,
  .metrics-grid,
  .analytics-layout {
    grid-template-columns: 1fr;
  }
}
</style>

<div class="analytics-dashboard" id="visitor-dashboard">
<div class="analytics-hero"><h1 class="analytics-title">网站访问统计</h1><p class="analytics-subtitle">查看最近访客、访问页面、来源、地区和设备。访客身份以浏览器生成的访客 ID 区分；如果没有登录系统，网站无法知道访问者真实姓名。</p></div>
<div class="analytics-config"><input class="analytics-input" id="analytics-token" type="password" autocomplete="current-password" placeholder="管理员口令"><button class="analytics-button" id="analytics-load">查看数据</button><button class="analytics-button secondary" id="analytics-save">保存口令</button></div>
<div class="analytics-status" id="analytics-status"></div>
<div class="metrics-grid"><div class="metric-card"><div class="metric-label">总浏览量</div><div class="metric-value" id="metric-pageviews">-</div></div><div class="metric-card"><div class="metric-label">独立访客</div><div class="metric-value" id="metric-visitors">-</div></div><div class="metric-card"><div class="metric-label">今日浏览</div><div class="metric-value" id="metric-today-pageviews">-</div></div><div class="metric-card"><div class="metric-label">今日访客</div><div class="metric-value" id="metric-today-visitors">-</div></div></div>
<div class="analytics-layout"><div class="analytics-section"><h2 class="section-title">最近访问</h2><div class="table-wrap"><table class="visit-table"><thead><tr><th>时间</th><th>访客</th><th>页面</th><th>地区</th><th>设备</th><th>来源</th></tr></thead><tbody id="recent-visits"><tr><td colspan="6">输入管理员口令后加载数据。</td></tr></tbody></table></div></div><div class="analytics-section"><h2 class="section-title">热门页面</h2><div class="ranking" id="top-pages"></div><h2 class="section-title" style="margin-top: 22px;">来源</h2><div class="ranking" id="top-referrers"></div><h2 class="section-title" style="margin-top: 22px;">地区</h2><div class="ranking" id="top-countries"></div></div></div>
<div class="setup-note">当前统计后端已连接 Cloudflare Worker。前端脚本会自动记录全站访问；本页只用管理员口令查询数据。</div>
</div>

<script>
(function () {
  var githubPagesEndpoint = 'https://tartarous-visitor-analytics.tartarous-blog-3010383177.workers.dev';
  var endpoint = window.VISITOR_ANALYTICS_ENDPOINT || (/\.github\.io$/i.test(window.location.hostname) ? githubPagesEndpoint : '');
  var tokenInput = document.getElementById('analytics-token');
  var statusEl = document.getElementById('analytics-status');
  var loadButton = document.getElementById('analytics-load');
  var saveButton = document.getElementById('analytics-save');
  var tokenKey = 'tartarous_analytics_admin_token';

  function text(id, value) {
    document.getElementById(id).textContent = value == null ? '-' : Number(value).toLocaleString();
  }

  function setStatus(message) {
    statusEl.textContent = message || '';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function shortVisitor(value) {
    return value ? value.slice(0, 8) + '...' : '-';
  }

  function renderRanking(id, rows) {
    var el = document.getElementById(id);
    if (!rows || !rows.length) {
      el.innerHTML = '<div class="rank-row"><span class="rank-name">暂无数据</span><span class="rank-count">0</span></div>';
      return;
    }
    el.innerHTML = rows.map(function (row) {
      return '<div class="rank-row"><span class="rank-name">' + escapeHtml(row.name || 'Direct') + '</span><span class="rank-count">' + row.count + '</span></div>';
    }).join('');
  }

  function renderVisits(visits) {
    var tbody = document.getElementById('recent-visits');
    if (!visits || !visits.length) {
      tbody.innerHTML = '<tr><td colspan="6">暂无访问记录。</td></tr>';
      return;
    }
    tbody.innerHTML = visits.map(function (visit) {
      var time = new Date(visit.createdAt).toLocaleString();
      var place = [visit.country, visit.region, visit.city].filter(Boolean).join(' / ') || '-';
      var device = [visit.device, visit.os, visit.browser].filter(Boolean).join(' / ') || '-';
      var referrer = visit.referrer ? visit.referrer.replace(/^https?:\/\//, '') : 'Direct';
      return '<tr>' +
        '<td><code>' + escapeHtml(time) + '</code></td>' +
        '<td><code>' + escapeHtml(shortVisitor(visit.visitorId)) + '</code></td>' +
        '<td>' + escapeHtml(visit.path || '/') + '</td>' +
        '<td>' + escapeHtml(place) + '</td>' +
        '<td>' + escapeHtml(device) + '</td>' +
        '<td>' + escapeHtml(referrer) + '</td>' +
      '</tr>';
    }).join('');
  }

  async function loadData() {
    var token = tokenInput.value.trim();
    if (!token) {
      setStatus('请先输入管理员口令。');
      return;
    }
    if (endpoint.indexOf('YOUR-WORKER-SUBDOMAIN') !== -1) {
      setStatus('还没有配置 Worker 地址。请先部署 analytics-worker，并在 _config.shoka.yml 里替换地址。');
      return;
    }

    loadButton.disabled = true;
    setStatus('正在加载访问数据...');
    try {
      var apiBase = endpoint ? endpoint.replace(/\/$/, '') : '';
      var response = await fetch(apiBase + '/api/summary', {
        headers: { 'x-admin-token': token }
      });
      var data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || '加载失败');

      text('metric-pageviews', data.totals.pageviews);
      text('metric-visitors', data.totals.visitors);
      text('metric-today-pageviews', data.totals.todayPageviews);
      text('metric-today-visitors', data.totals.todayVisitors);
      renderVisits(data.recent);
      renderRanking('top-pages', data.topPages);
      renderRanking('top-referrers', data.referrers);
      renderRanking('top-countries', data.countries);
      setStatus('已更新：' + new Date().toLocaleString());
    } catch (error) {
      setStatus('加载失败：' + error.message);
    } finally {
      loadButton.disabled = false;
    }
  }

  try {
    tokenInput.value = localStorage.getItem(tokenKey) || '';
  } catch (error) {}

  loadButton.addEventListener('click', loadData);
  saveButton.addEventListener('click', function () {
    try {
      localStorage.setItem(tokenKey, tokenInput.value.trim());
      setStatus('口令已保存在当前浏览器。');
    } catch (error) {
      setStatus('当前浏览器不允许保存口令。');
    }
  });
})();
</script>
