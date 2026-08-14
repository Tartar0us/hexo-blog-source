'use strict';

const fs = require('fs');
const path = require('path');

function pad(value) {
  return String(value).padStart(2, '0');
}

function today() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    iso: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  };
}

const date = today();
const title = `${date.year}年${date.month}月${date.day}日日记`;
const postPath = path.join(process.cwd(), 'source', '_posts', 'diary', `${title}.md`);
const assetDir = path.join(process.cwd(), 'source', 'assets', 'diary', date.iso);

fs.mkdirSync(path.dirname(postPath), { recursive: true });
fs.mkdirSync(assetDir, { recursive: true });

if (!fs.existsSync(postPath)) {
  fs.writeFileSync(postPath, `---\ncategories:\n  - 日记\ntags:\n  - 成长\n  - 复盘\ntitle: ${title}\ndate: ${date.iso}\n---\n\n## 碎片\n\n\n## 正文\n\n\n## 媒体\n\n`, 'utf8');
}

console.log(`Diary: ${postPath}`);
console.log(`Assets: ${assetDir}`);
console.log(`Image tag: {% diary_image ${date.iso}/image1.jpg 照片说明 %}`);
console.log(`Audio tag: {% diary_audio ${date.iso}/voice1.mp3 录音说明 %}`);
console.log(`Video tag: {% diary_video ${date.iso}/video1.mp4 视频说明 %}`);
