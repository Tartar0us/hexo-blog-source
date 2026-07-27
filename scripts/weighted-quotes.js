/**
 * 名言权重随机脚本（after_render:html 方案）
 * 首页渲染完成后，将占位符替换为按权重随机选取的名言
 */

var yaml = require("js-yaml");
var fs = require("fs");
var path = require("path");

// 启动时读取并解析 quotes.yml 为权重展开数组
var quotesFile = path.join(hexo.source_dir, "_data", "quotes.yml");
var expanded = [];

function loadQuotes() {
  try {
    var raw = yaml.load(fs.readFileSync(quotesFile, "utf8"));
    if (!raw || !raw.quotes) return;
    expanded = [];
    raw.quotes.forEach(function (item) {
      var text = typeof item === "string" ? item : item.text;
      var weight = parseInt(item.weight) || 1;
      for (var i = 0; i < weight; i++) {
        expanded.push(text);
      }
    });
    hexo.log.info("quotes: 权重展开完成，共 " + expanded.length + " 条");
  } catch (e) {
    hexo.log.warn("quotes: 解析 quotes.yml 失败", e.message);
  }
}

loadQuotes();

// 注册 HTML 后处理过滤器
hexo.extend.filter.register("after_render:html", function (html, data) {
  // 只在首页替换
  if (!data.page || data.page.__index !== true) return html;
  if (!expanded.length) return html;

  // 替换主题渲染出来的 [object Object]（YAML对象被模板当成字符串）
  var idx = Math.floor(Math.random() * expanded.length);
  var quote = expanded[idx];
  return html.replace(/\[object Object\]/g, quote);
}, 999);
