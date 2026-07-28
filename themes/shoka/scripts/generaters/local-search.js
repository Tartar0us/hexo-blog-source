'use strict';

const { stripHTML } = require('hexo-util');

const toArray = function(list) {
  if (!list) return [];
  if (typeof list.map === 'function') {
    return list.map(item => item.name || item.data && item.data.name || item.slug || item.toString());
  }
  return [];
};

const cleanText = function(text) {
  return stripHTML(text || '')
    .replace(/\s+/g, ' ')
    .trim();
};

hexo.extend.generator.register('local-search', function(locals) {
  const posts = locals.posts
    .filter(post => post.published !== false)
    .sort('-date')
    .map(post => {
      const content = cleanText(post.content || post.excerpt || post._content);

      return {
        title: post.title || '未命名',
        path: post.path,
        date: post.date ? post.date.format('YYYY-MM-DD') : '',
        categories: toArray(post.categories),
        tags: toArray(post.tags),
        content: content.slice(0, 6000),
        excerpt: content.slice(0, 180)
      };
    });

  return {
    path: 'search.json',
    data: JSON.stringify(posts)
  };
});
