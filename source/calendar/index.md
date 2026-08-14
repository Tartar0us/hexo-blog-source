---
title: 日记日历
date: 2026-08-14
type: "calendar"
layout: "page"
---

<div class="diary-calendar-app" id="diary-calendar-app">
  <div class="diary-calendar-head">
    <div>
      <h2>日记日历</h2>
      <p id="calendar-summary">正在加载日记...</p>
    </div>
    <div class="diary-calendar-controls">
      <button type="button" id="calendar-prev" aria-label="上个月">‹</button>
      <strong id="calendar-current">-</strong>
      <button type="button" id="calendar-next" aria-label="下个月">›</button>
    </div>
  </div>
  <div class="diary-calendar-stats">
    <div><span id="calendar-total-posts">-</span><small>篇日记</small></div>
    <div><span id="calendar-total-words">-</span><small>总字数</small></div>
    <div><span id="calendar-month-posts">-</span><small>本月日记</small></div>
    <div><span id="calendar-month-words">-</span><small>本月字数</small></div>
  </div>
  <div class="diary-calendar-grid" id="calendar-weekdays"></div>
  <div class="diary-calendar-grid diary-calendar-days" id="calendar-days"></div>
  <section class="diary-calendar-list">
    <h3 id="calendar-selected-title">最近日记</h3>
    <div id="calendar-selected-list"></div>
  </section>
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
      return '<article class="calendar-entry"><a href="' + post.path + '">' + escapeHtml(post.title) + '</a><div><time>' + post.date + '</time><span>' + number(post.words) + ' words</span></div><p>' + escapeHtml(post.excerpt) + '</p></article>';
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
      cells.push('<button type="button" class="calendar-day is-blank" tabindex="-1"></button>');
    }

    for (var day = 1; day <= last.getDate(); day++) {
      var date = new Date(year, month, day);
      var key = keyOf(date);
      var posts = calendarData.days[key] || [];
      var words = posts.reduce(function (sum, post) { return sum + (post.words || 0); }, 0);
      var classes = ['calendar-day'];
      if (posts.length) classes.push('has-diary');
      if (key === keyOf(new Date())) classes.push('is-today');
      cells.push('<button type="button" class="' + classes.join(' ') + '" data-date="' + key + '"><span>' + day + '</span><strong>' + (posts.length ? posts.length : '') + '</strong><small>' + (words ? number(words) : '') + '</small></button>');
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
