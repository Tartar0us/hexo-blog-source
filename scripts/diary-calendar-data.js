'use strict';

function isDiaryPost(post) {
  const source = String(post.source || '').replace(/\\/g, '/');
  if (source.indexOf('_posts/diary/') > -1) return true;

  let matched = false;
  if (post.categories && post.categories.forEach) {
    post.categories.forEach(category => {
      if (String(category.name || category) === '日记') matched = true;
    });
  }
  return matched;
}

function formatDate(date) {
  const value = date && date.toDate ? date.toDate() : new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

hexo.extend.generator.register('diary-calendar-data', function(locals) {
  const days = {};
  let totalWords = 0;
  let totalPosts = 0;
  const root = String(hexo.config.root || '/').replace(/\/?$/, '/');

  locals.posts
    .filter(isDiaryPost)
    .sort('date', 1)
    .forEach(post => {
      const day = formatDate(post.date);
      if (!day) return;

      const item = {
        title: post.title || day,
        date: day,
        path: root + String(post.path || '').replace(/^\/+/, ''),
        words: typeof post.length === 'number' ? post.length : 0,
        excerpt: String(post.excerpt || post.content || '')
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 120)
      };

      if (!days[day]) days[day] = [];
      days[day].push(item);
      totalPosts++;
      totalWords += item.words;
    });

  const dates = Object.keys(days).sort();
  const data = {
    generatedAt: new Date().toISOString(),
    totalPosts,
    totalWords,
    firstDate: dates[0] || '',
    lastDate: dates[dates.length - 1] || '',
    days
  };

  return {
    path: 'diary-calendar.json',
    data: JSON.stringify(data)
  };
});
