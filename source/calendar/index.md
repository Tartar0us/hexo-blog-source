---
title: 日记日历
date: 2026-08-14
type: "calendar"
layout: "page"
---

<style>
#diary-calendar-app {
  --cal-bg: #fff;
  --cal-ink: #263238;
  --cal-muted: #7b8794;
  --cal-line: #e6edf3;
  --cal-soft: #fff5f0;
  --cal-accent: #f08a64;
  --cal-accent-strong: #df7048;
  --cal-green: #2f8f83;
  color: var(--cal-ink);
}

#diary-calendar-app * {
  box-sizing: border-box;
}

#diary-calendar-app .calendar-shell {
  max-width: 980px;
  margin: 0 auto;
}

#diary-calendar-app .calendar-top {
  display: flex !important;
  justify-content: space-between;
  align-items: flex-end;
  gap: 18px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--cal-line);
  padding-bottom: 18px;
}

#diary-calendar-app .calendar-title {
  margin: 0 0 6px;
  font-size: 30px;
  letter-spacing: 0;
}

#diary-calendar-app .calendar-range {
  margin: 0;
  color: var(--cal-muted);
  font-size: 15px;
}

#diary-calendar-app .calendar-monthbar {
  display: grid !important;
  grid-template-columns: 40px minmax(150px, auto) 40px;
  align-items: center;
  gap: 8px;
}

#diary-calendar-app .calendar-nav {
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  padding: 0 !important;
  border: 1px solid var(--cal-line) !important;
  border-radius: 50% !important;
  background: #fff !important;
  color: var(--cal-ink) !important;
  font-size: 24px !important;
  line-height: 1 !important;
  box-shadow: none !important;
  cursor: pointer;
}

#diary-calendar-app .calendar-nav:hover {
  border-color: var(--cal-accent) !important;
  color: var(--cal-accent-strong) !important;
}

#diary-calendar-app #calendar-current {
  min-width: 150px;
  text-align: center;
  font-size: 22px;
  font-weight: 800;
}

#diary-calendar-app .calendar-metrics {
  display: grid !important;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin: 18px 0;
}

#diary-calendar-app .calendar-metric {
  padding: 14px 16px;
  border: 1px solid var(--cal-line);
  border-radius: 8px;
  background: #fff;
}

#diary-calendar-app .calendar-metric span {
  display: block;
  color: var(--cal-ink);
  font-size: 24px;
  font-weight: 800;
  line-height: 1.1;
}

#diary-calendar-app .calendar-metric small {
  display: block;
  margin-top: 6px;
  color: var(--cal-muted);
  font-size: 13px;
}

#diary-calendar-app .calendar-panel {
  border: 1px solid var(--cal-line);
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

#diary-calendar-app .calendar-grid {
  display: grid !important;
  grid-template-columns: repeat(7, minmax(0, 1fr)) !important;
}

#diary-calendar-app #calendar-weekdays {
  border-bottom: 1px solid var(--cal-line);
  background: #fafafa;
}

#diary-calendar-app .calendar-weekday {
  padding: 12px 4px;
  text-align: center;
  color: var(--cal-muted);
  font-size: 13px;
  font-weight: 800;
}

#diary-calendar-app #calendar-days {
  background: var(--cal-line);
  gap: 1px;
}

#diary-calendar-app .calendar-day {
  position: relative;
  display: flex !important;
  flex-direction: column;
  justify-content: space-between;
  min-height: 112px;
  width: 100% !important;
  margin: 0 !important;
  padding: 10px !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: #fff !important;
  color: var(--cal-ink) !important;
  text-align: left !important;
  box-shadow: none !important;
  cursor: pointer;
}

#diary-calendar-app .calendar-day:hover {
  background: #fffaf7 !important;
}

#diary-calendar-app .calendar-day.is-blank {
  background: #fbfcfd !important;
  cursor: default;
}

#diary-calendar-app .calendar-day-number {
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
}

#diary-calendar-app .calendar-day-meta {
  min-height: 32px;
}

#diary-calendar-app .calendar-diary-count {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--cal-soft);
  color: var(--cal-accent-strong);
  font-size: 12px;
  font-weight: 800;
}

#diary-calendar-app .calendar-day small {
  display: block;
  margin-top: 5px;
  color: var(--cal-muted);
  font-size: 12px;
}

#diary-calendar-app .calendar-day.has-diary::after {
  content: "";
  position: absolute;
  top: 11px;
  right: 11px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cal-green);
}

#diary-calendar-app .calendar-day.is-today {
  outline: 2px solid var(--cal-accent);
  outline-offset: -2px;
}

#diary-calendar-app .calendar-day.is-selected {
  background: var(--cal-soft) !important;
}

#diary-calendar-app .calendar-list {
  margin-top: 18px;
  border: 1px solid var(--cal-line);
  border-radius: 8px;
  background: #fff;
  padding: 18px;
}

#diary-calendar-app .calendar-list h3 {
  margin: 0 0 12px;
  font-size: 20px;
}

#diary-calendar-app .calendar-entry {
  padding: 14px 0;
  border-top: 1px solid #edf1f6;
}

#diary-calendar-app .calendar-entry:first-child {
  border-top: 0;
}

#diary-calendar-app .calendar-entry a {
  color: var(--cal-ink);
  font-weight: 800;
}

#diary-calendar-app .calendar-entry-meta {
  display: flex !important;
  gap: 12px;
  margin: 6px 0;
  color: var(--cal-muted);
  font-size: 13px;
}

#diary-calendar-app .calendar-entry p {
  margin: 0;
  color: #4b5563;
  line-height: 1.7;
}

#diary-calendar-app .calendar-empty {
  padding: 16px;
  border-radius: 8px;
  background: #fafafa;
  color: var(--cal-muted);
}

@media (max-width: 780px) {
  #diary-calendar-app .calendar-top {
    align-items: stretch;
    flex-direction: column;
  }

  #diary-calendar-app .calendar-monthbar,
  #diary-calendar-app .calendar-metrics {
    width: 100%;
  }

  #diary-calendar-app .calendar-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  #diary-calendar-app .calendar-day {
    min-height: 72px;
    padding: 7px !important;
  }

  #diary-calendar-app .calendar-day-number {
    font-size: 15px;
  }

  #diary-calendar-app .calendar-diary-count {
    padding: 0;
    background: transparent;
    font-size: 11px;
  }

  #diary-calendar-app .calendar-day small {
    display: none;
  }
}
</style>

<div class="diary-calendar-app" id="diary-calendar-app">
  <div class="calendar-shell">
    <div class="calendar-top">
      <div>
        <h2 class="calendar-title">日记日历</h2>
        <p class="calendar-range" id="calendar-summary">正在加载日记...</p>
      </div>
      <div class="calendar-monthbar">
        <button class="calendar-nav" type="button" id="calendar-prev" aria-label="上个月">‹</button>
        <strong id="calendar-current">-</strong>
        <button class="calendar-nav" type="button" id="calendar-next" aria-label="下个月">›</button>
      </div>
    </div>
    <div class="calendar-metrics">
      <div class="calendar-metric"><span id="calendar-total-posts">-</span><small>篇日记</small></div>
      <div class="calendar-metric"><span id="calendar-total-words">-</span><small>总字数</small></div>
      <div class="calendar-metric"><span id="calendar-month-posts">-</span><small>本月日记</small></div>
      <div class="calendar-metric"><span id="calendar-month-words">-</span><small>本月字数</small></div>
    </div>
    <div class="calendar-panel">
      <div class="calendar-grid" id="calendar-weekdays"></div>
      <div class="calendar-grid" id="calendar-days"></div>
    </div>
    <section class="calendar-list">
      <h3 id="calendar-selected-title">最近日记</h3>
      <div id="calendar-selected-list"></div>
    </section>
  </div>
</div>

<script>
(function () {
  var weekdays = ['一', '二', '三', '四', '五', '六', '日'];
  var monthCursor = new Date();
  var calendarData = null;

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function keyOf(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }

  function monthKey(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1);
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function number(value) {
    return Number(value || 0).toLocaleString();
  }

  function setText(id, value) {
    document.getElementById(id).textContent = value;
  }

  function renderWeekdays() {
    document.getElementById('calendar-weekdays').innerHTML = weekdays.map(function (day) {
      return '<div class="calendar-weekday">' + day + '</div>';
    }).join('');
  }

  function monthStats(targetMonth) {
    var posts = 0;
    var words = 0;
    Object.keys(calendarData.days).forEach(function (date) {
      if (date.indexOf(targetMonth) !== 0) return;
      calendarData.days[date].forEach(function (post) {
        posts += 1;
        words += post.words || 0;
      });
    });
    return { posts: posts, words: words };
  }

  function renderList(title, posts) {
    var list = document.getElementById('calendar-selected-list');
    setText('calendar-selected-title', title);
    if (!posts.length) {
      list.innerHTML = '<div class="calendar-empty">这一天还没有日记。</div>';
      return;
    }
    list.innerHTML = posts.map(function (post) {
      return '<article class="calendar-entry"><a href="' + post.path + '">' + escapeHtml(post.title) + '</a><div class="calendar-entry-meta"><time>' + post.date + '</time><span>' + number(post.words) + ' words</span></div><p>' + escapeHtml(post.excerpt) + '</p></article>';
    }).join('');
  }

  function renderMonth() {
    var year = monthCursor.getFullYear();
    var month = monthCursor.getMonth();
    var first = new Date(year, month, 1);
    var last = new Date(year, month + 1, 0);
    var startOffset = (first.getDay() + 6) % 7;
    var cells = [];
    var currentMonth = monthKey(monthCursor);
    var stats = monthStats(currentMonth);

    setText('calendar-current', year + '年' + (month + 1) + '月');
    setText('calendar-month-posts', number(stats.posts));
    setText('calendar-month-words', number(stats.words));

    for (var blank = 0; blank < startOffset; blank++) {
      cells.push('<div class="calendar-day is-blank" aria-hidden="true"></div>');
    }

    for (var day = 1; day <= last.getDate(); day++) {
      var date = new Date(year, month, day);
      var key = keyOf(date);
      var posts = calendarData.days[key] || [];
      var words = posts.reduce(function (sum, post) { return sum + (post.words || 0); }, 0);
      var classes = ['calendar-day'];
      if (posts.length) classes.push('has-diary');
      if (key === keyOf(new Date())) classes.push('is-today');
      cells.push('<button type="button" class="' + classes.join(' ') + '" data-date="' + key + '"><span class="calendar-day-number">' + day + '</span><span class="calendar-day-meta">' + (posts.length ? '<span class="calendar-diary-count">' + posts.length + '篇</span>' : '') + (words ? '<small>' + number(words) + ' words</small>' : '') + '</span></button>');
    }

    document.getElementById('calendar-days').innerHTML = cells.join('');
  }

  function showRecent() {
    var posts = [];
    Object.keys(calendarData.days).sort().reverse().some(function (date) {
      calendarData.days[date].forEach(function (post) { posts.push(post); });
      return posts.length >= 8;
    });
    renderList('最近日记', posts.slice(0, 8));
  }

  document.getElementById('calendar-prev').addEventListener('click', function () {
    monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1);
    renderMonth();
  });

  document.getElementById('calendar-next').addEventListener('click', function () {
    monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1);
    renderMonth();
  });

  document.getElementById('calendar-days').addEventListener('click', function (event) {
    var button = event.target.closest('[data-date]');
    if (!button) return;
    var date = button.getAttribute('data-date');
    Array.prototype.forEach.call(document.querySelectorAll('#calendar-days .calendar-day'), function (day) {
      day.classList.remove('is-selected');
    });
    button.classList.add('is-selected');
    renderList(date, calendarData.days[date] || []);
  });

  renderWeekdays();
  fetch('/diary-calendar.json').then(function (response) {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  }).then(function (data) {
    calendarData = data;
    var last = data.lastDate ? new Date(data.lastDate + 'T00:00:00') : new Date();
    monthCursor = new Date(last.getFullYear(), last.getMonth(), 1);
    setText('calendar-summary', data.firstDate + ' 到 ' + data.lastDate);
    setText('calendar-total-posts', number(data.totalPosts));
    setText('calendar-total-words', number(data.totalWords));
    renderMonth();
    showRecent();
  }).catch(function (error) {
    setText('calendar-summary', '日历数据加载失败：' + error.message);
  });
})();
</script>
