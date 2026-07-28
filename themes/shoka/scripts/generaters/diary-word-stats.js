'use strict';

const { stripHTML } = require('hexo-util');
const fs = require('hexo-fs');
const path = require('path');

const stopWords = new Set([
  '今天', '昨天', '明天', '然后', '但是', '因为', '所以', '感觉', '就是', '这个', '那个', '一个', '一下',
  '还是', '没有', '不是', '已经', '可以', '应该', '可能', '真的', '现在', '晚上', '上午', '下午', '中午',
  '时候', '自己', '什么', '比较', '其实', '还是', '的话', '一下', '一些', '非常', '觉得', '开始', '继续',
  '起来', '回去', '回来', '出来', '进去', '东西', '事情', '如果', '虽然', '或者', '而且', '目前', '之后',
  '之前', '大概', '一直', '有点', '很多', '这里', '那里', '这样', '还是', '好像', '也许', '不过', '今天',
  '我的', '我们', '你们', '他们', '她们', '到了', '还有', '最后', '知道', '进行', '完成', '需要', '只是',
  '这种', '这种', '这些', '那些', '已经', '不会', '不能', '的话', '一下', '一天', '一会', '一点', '一次',
  '两个', '三个', '很多', '好多', '确实', '来说', '总体', '基本', '主要', '结果', '问题', '地方', '方面',
  'the', 'and', 'for', 'with', 'this', 'that', 'you', 'are', 'was', 'were', 'from', 'have', 'has'
]);

const dictionary = [
  '数学建模', '机器学习', '深度学习', '数据分析', '数据结构', '时序建模', '行人重识别', '医学影像',
  '科研训练', '实验结果', '论文', '科研', '模型', '实验', '代码', '数据', '算法', '训练', '测试',
  '实习', '中控', '项目', '工作', '公司', '导师', '组会', '汇报', '任务', '学习', '复习', '考试',
  '绩点', '英语', '雅思', '六级', '留学', '申请', '新加坡', '帝国理工', '保研', '考研',
  '健身', '减脂', '跑步', '饮食', '睡觉', '熬夜', '早起', '健康', '体重', '身材', '力量训练',
  '朋友', '舍友', '同学', '老师', '父母', '家人', '女朋友', '恋爱', '分手', '情绪', '焦虑', '快乐',
  '开心', '难过', '内耗', '压力', '自律', '计划', '目标', '生活', '成长', '复盘', '记录', '博客',
  '日记', '读书', '阅读', '书评', '小说', '游戏', '王者', '瓦', '抖音', '手机', '视频',
  '杭州', '秦皇岛', '东北大学', '图书馆', '宿舍', '食堂', '灵隐寺', '西湖', '钱塘江',
  '做饭', '鸡胸肉', '蒜蓉粉丝', '肯德基', '麦当劳', '咖啡', '奶茶'
].sort((a, b) => b.length - a.length);

const weakChineseChars = new Set('的了是我你他她它们在有和就都而及与着过么吧啊呀呢吗不也很还又再才会能要去来上下一天后前里这那之于以把被给所己');

function cleanText(text) {
  return stripHTML(text || '')
    .replace(/^---[\s\S]*?---/, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[`*_>#|~-]/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, ' ')
    .replace(/[\u{1f300}-\u{1faff}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function bump(map, word, amount) {
  if (!word || stopWords.has(word)) return;
  map.set(word, (map.get(word) || 0) + (amount || 1));
}

function countDictionaryWords(text, map) {
  dictionary.forEach(word => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matched = text.match(new RegExp(escaped, 'g'));
    if (matched && matched.length) bump(map, word, matched.length);
  });
}

function countEnglishWords(text, map) {
  const matched = text.toLowerCase().match(/[a-z][a-z-]{2,}/g) || [];
  matched.forEach(word => bump(map, word));
}

function countChineseBigrams(text, map) {
  const chunks = text.match(/[\u4e00-\u9fa5]{2,}/g) || [];
  chunks.forEach(chunk => {
    for (let index = 0; index < chunk.length - 1; index++) {
      const word = chunk.slice(index, index + 2);
      if (!stopWords.has(word) && !weakChineseChars.has(word[0]) && !weakChineseChars.has(word[1])) {
        bump(map, word);
      }
    }
  });
}

function topWords(map, limit) {
  return Array.from(map.entries())
    .map(([text, count]) => ({ text, count }))
    .filter(item => item.text.length > 1 && item.count > 1)
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text, 'zh-Hans-CN'))
    .slice(0, limit);
}

hexo.extend.generator.register('diary-word-stats', function() {
  const wordMap = new Map();
  let totalChars = 0;
  let totalDiaries = 0;
  const diaryDir = path.join(hexo.source_dir, '_posts', 'diary');
  const files = fs.existsSync(diaryDir) ? fs.listDirSync(diaryDir).filter(file => /\.md$/i.test(file)) : [];

  files.forEach(file => {
    totalDiaries++;
    const text = cleanText(fs.readFileSync(path.join(diaryDir, file)).toString());
    totalChars += text.length;

    countDictionaryWords(text, wordMap);
    countEnglishWords(text, wordMap);
    countChineseBigrams(text, wordMap);
  });

  const data = {
    generatedAt: new Date().toISOString(),
    totalDiaries,
    totalChars,
    words: topWords(wordMap, 300)
  };

  return {
    path: 'diary-word-stats.json',
    data: JSON.stringify(data)
  };
});
