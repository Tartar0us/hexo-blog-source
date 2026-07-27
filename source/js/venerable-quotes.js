(function () {
  var quotes = [
    "落魄谷中寒風吹，春秋蟬鳴少年歸。",
    "盪魂山處石人淚，定仙遊走魔向北。",
    "逆流河上萬仙退，愛情不敵堅持淚。",
    "宿命天成命中敗，仙尊悔而我不悔。",
    "星火燎原耀中州，異人霸業就此收。",
    "一生不利己，憂濟在元元。",
    "鴻運齊天福祿多，天下不過一掌中。",
    "面朝黃土背朝天，萬千生靈繫心間。",
    "江山如畫馬如龍，青衫入世顯儀容。",
    "光陰長河種紅蓮，韶光重回淚已乾。",
    "變化萬千心如常，男兒何須把貌藏。",
    "魂牽夢繞風雲盪，心圓土方三界壇。",
    "從來是瘋魔道癡，俯仰問陰陽乾坤。",
    "大漠孤舟騎行忙，天外孤魂千段長。",
    "早歲已知世事艱，仍許飛鴻盪雲間。",
    "今朝劍指疊雲處，煉蠱煉人還煉天。"
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
