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

.diary-words-dashboard {
  margin-top: 34px;
  color: var(--ink);
}

.diary-word-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  margin: 18px 0;
}

.word-cloud {
  min-height: 260px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px 16px;
  padding: 22px;
}

.cloud-word {
  color: hsl(var(--hue, 184), 72%, var(--light, 32%));
  font-size: var(--size, 18px);
  font-weight: 800;
  line-height: 1.1;
  white-space: nowrap;
}

.word-rank {
  counter-reset: word-rank;
}

.word-rank-row {
  counter-increment: word-rank;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 74px;
  gap: 12px;
  align-items: center;
  padding: 9px 0;
  border-bottom: 1px solid #edf1f6;
}

.word-rank-row::before {
  content: counter(word-rank);
  color: var(--muted);
  font-weight: 700;
}

.word-rank-name {
  overflow-wrap: anywhere;
  font-weight: 700;
}

.word-rank-bar {
  height: 7px;
  margin-top: 6px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.word-rank-fill {
  display: block;
  height: 100%;
  width: var(--width, 0%);
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}

.word-rank-count,
.word-query-result {
  color: var(--accent-2);
  font-weight: 800;
}

@media (max-width: 860px) {
  .analytics-config,
  .diary-word-toolbar,
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

<div class="analytics-dashboard diary-words-dashboard" id="diary-words-dashboard">
<div class="analytics-hero"><h1 class="analytics-title">日记词频分析</h1><p class="analytics-subtitle">只统计 diary 目录中的日记，不统计人生计划、读书、科研、技术等其他文章。词云和排行榜会在每次部署时自动更新。</p></div>
<div class="metrics-grid"><div class="metric-card"><div class="metric-label">统计日记数</div><div class="metric-value" id="diary-total-posts">-</div></div><div class="metric-card"><div class="metric-label">日记总字符</div><div class="metric-value" id="diary-total-chars">-</div></div><div class="metric-card"><div class="metric-label">入榜词语</div><div class="metric-value" id="diary-total-words">-</div></div><div class="metric-card"><div class="metric-label">最高频词</div><div class="metric-value" id="diary-top-word" style="font-size: 22px;">-</div></div></div>
<div class="diary-word-toolbar"><input class="analytics-input" id="diary-word-query" type="search" autocomplete="off" placeholder="输入词语查看出现次数，比如：科研、健身、实习"><button class="analytics-button" id="diary-word-query-button">查词</button></div>
<div class="analytics-status" id="diary-word-status"></div>
<div class="analytics-layout"><div class="analytics-section"><h2 class="section-title">词云</h2><div class="word-cloud" id="diary-word-cloud">正在加载词云...</div></div><div class="analytics-section"><h2 class="section-title">词频排行榜</h2><div class="word-rank" id="diary-word-rank"></div></div></div>
</div>

<script>
(function () {
  var statusEl = document.getElementById('diary-word-status');
  var queryInput = document.getElementById('diary-word-query');
  var queryButton = document.getElementById('diary-word-query-button');
  var words = [];

  function setText(id, value) {
    document.getElementById(id).textContent = value == null ? '-' : value;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function setStatus(message) {
    statusEl.innerHTML = message || '';
  }

  function renderCloud(items) {
    var cloud = document.getElementById('diary-word-cloud');
    var top = items[0] ? items[0].count : 1;
    cloud.innerHTML = items.slice(0, 90).map(function (item, index) {
      var ratio = item.count / top;
      var size = Math.round(14 + ratio * 30);
      var light = Math.round(46 - ratio * 18);
      var hue = 184 + (index % 5) * 18;
      return '<span class="cloud-word" title="' + escapeHtml(item.count) + ' 次" style="--size:' + size + 'px;--light:' + light + '%;--hue:' + hue + ';">' + escapeHtml(item.text) + '</span>';
    }).join('');
  }

  function renderRank(items) {
    var rank = document.getElementById('diary-word-rank');
    var top = items[0] ? items[0].count : 1;
    rank.innerHTML = items.slice(0, 60).map(function (item) {
      var width = Math.max(8, Math.round(item.count / top * 100));
      return '<div class="word-rank-row"><div><div class="word-rank-name">' + escapeHtml(item.text) + '</div><div class="word-rank-bar"><span class="word-rank-fill" style="--width:' + width + '%;"></span></div></div><div class="word-rank-count">' + item.count + '</div></div>';
    }).join('');
  }

  function queryWord() {
    var value = queryInput.value.trim();
    if (!value) {
      setStatus('输入一个词语，就能看它在日记里出现了多少次。');
      return;
    }
    var exact = words.find(function (item) {
      return item.text === value;
    });
    var fuzzy = words.filter(function (item) {
      return item.text.indexOf(value) > -1 || value.indexOf(item.text) > -1;
    }).slice(0, 8);

    if (exact) {
      setStatus('「' + escapeHtml(value) + '」在日记词频中出现 <span class="word-query-result">' + exact.count + '</span> 次。');
      return;
    }
    if (fuzzy.length) {
      setStatus('没有精确命中「' + escapeHtml(value) + '」，相近词：' + fuzzy.map(function (item) {
        return '<span class="word-query-result">' + escapeHtml(item.text) + ' ' + item.count + '</span>';
      }).join(' / '));
      return;
    }
    setStatus('暂时没有找到「' + escapeHtml(value) + '」。它可能没有出现，或者没有进入当前词表。');
  }

  fetch('/diary-word-stats.json').then(function (response) {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  }).then(function (data) {
    words = data.words || [];
    setText('diary-total-posts', Number(data.totalDiaries || 0).toLocaleString());
    setText('diary-total-chars', Number(data.totalChars || 0).toLocaleString());
    setText('diary-total-words', Number(words.length || 0).toLocaleString());
    setText('diary-top-word', words[0] ? words[0].text : '-');
    renderCloud(words);
    renderRank(words);
    setStatus('已更新：' + new Date(data.generatedAt || Date.now()).toLocaleString());
  }).catch(function (error) {
    setStatus('日记词频数据加载失败：' + error.message);
  });

  queryButton.addEventListener('click', queryWord);
  queryInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') queryWord();
  });
})();
</script>

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
