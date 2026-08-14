'use strict';

function attrs(args) {
  return args.join(' ').trim();
}

function mediaPath(name) {
  const value = String(name || '').trim();
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('/')) return value;
  return `/assets/diary/${value}`;
}

hexo.extend.tag.register('diary_image', function(args) {
  const src = mediaPath(args.shift());
  const alt = attrs(args) || 'diary image';
  return `<figure class="diary-media diary-image"><img src="${src}" alt="${alt}" loading="lazy"><figcaption>${alt}</figcaption></figure>`;
});

hexo.extend.tag.register('diary_audio', function(args) {
  const src = mediaPath(args.shift());
  const title = attrs(args) || 'diary audio';
  return `<figure class="diary-media diary-audio"><figcaption>${title}</figcaption><audio controls preload="metadata" src="${src}"></audio></figure>`;
});

hexo.extend.tag.register('diary_video', function(args) {
  const src = mediaPath(args.shift());
  const title = attrs(args) || 'diary video';
  return `<figure class="diary-media diary-video"><video controls preload="metadata" src="${src}"></video><figcaption>${title}</figcaption></figure>`;
});
