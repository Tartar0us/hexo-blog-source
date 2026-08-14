'use strict';

const fs = require('fs');
const path = require('path');

function pad(value) {
  return String(value).padStart(2, '0');
}

function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function resolveInput() {
  const arg = process.argv[2];
  if (arg) return path.resolve(process.cwd(), arg);
  return path.join(process.cwd(), 'source', '_drafts', 'mobile', `${todayIso()}.md`);
}

function resolveOutput() {
  const arg = process.argv[3];
  if (arg) return path.resolve(process.cwd(), arg);
  return path.join(process.cwd(), 'source', '_drafts', 'ai', `${todayIso()}-diary.md`);
}

async function callAi(content) {
  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.AI_API_URL || process.env.OPENAI_BASE_URL;
  const model = process.env.AI_MODEL || 'gpt-4.1-mini';

  if (!apiKey || !apiUrl) {
    return [
      '# 今日记录整理',
      '',
      '> 没有配置 AI_API_KEY / AI_API_URL，所以先生成了本地整理模板。',
      '',
      '## 原始碎片',
      '',
      content.trim(),
      '',
      '## 日记草稿',
      '',
      '今天可以从这些碎片里整理出：发生了什么、情绪如何、有什么具体行动、明天要调整什么。'
    ].join('\n');
  }

  const endpoint = apiUrl.replace(/\/$/, '') + '/chat/completions';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: '你是一个克制、诚实、贴近用户语气的日记整理助手。保留用户的具体细节和口吻，不要写成公众号腔，不要美化成空话。'
        },
        {
          role: 'user',
          content: `请把下面的当天碎片整理成一篇中文日记草稿，结构包含：正文、今天的关键词、明天提醒。\n\n${content}`
        }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error && data.error.message ? data.error.message : `AI request failed: ${response.status}`);
  return data.choices[0].message.content;
}

async function main() {
  const input = resolveInput();
  const output = resolveOutput();
  if (!fs.existsSync(input)) {
    fs.mkdirSync(path.dirname(input), { recursive: true });
    fs.writeFileSync(input, `# ${todayIso()} 手机碎片\n\n- \n`, 'utf8');
    console.log(`Created fragment file: ${input}`);
    return;
  }

  const content = fs.readFileSync(input, 'utf8');
  const result = await callAi(content);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, result.trim() + '\n', 'utf8');
  console.log(`AI diary draft: ${output}`);
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
