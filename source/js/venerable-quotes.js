(function () {
  var quotes = [
    "星火燎原耀中州。",
    "一生不利己，憂濟在元元。",
    "從來是瘋魔道癡。",
    "變化萬千心如常。",
    "光陰長河種紅蓮。",
    "江山如畫馬如龍。",
    "踏遍萬里尋歸途。",
    "鴻運齊天福祿多。",
    "一念陰陽倒時差。",
    "萬千生靈繫心間。",
    "煉蠱煉人還煉天。"
  ];

  function updateSidebarQuote() {
    var target = document.querySelector(".author .description");
    if (!target || quotes.length === 0) {
      return;
    }

    target.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateSidebarQuote);
  } else {
    updateSidebarQuote();
  }

  document.addEventListener("pjax:success", updateSidebarQuote);
})();
