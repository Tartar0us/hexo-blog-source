'use strict';

function getSymbols(post) {
  return post && typeof post.length === 'number' ? post.length : 0;
}

hexo.extend.helper.register('exactSymbolsCountTotal', function(site) {
  let total = 0;
  site.posts.forEach(post => {
    total += getSymbols(post);
  });
  return String(total);
});
