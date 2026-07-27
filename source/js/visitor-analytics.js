(function () {
  'use strict';

  var endpoint =
    window.VISITOR_ANALYTICS_ENDPOINT ||
    (document.querySelector('meta[name="visitor-analytics-endpoint"]') || {}).content ||
    '';

  if (endpoint.indexOf('YOUR-WORKER-SUBDOMAIN') !== -1) return;
  if (/^(localhost|127\.0\.0\.1|192\.168\.)/.test(window.location.hostname)) return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  var storageKey = 'tartarous_visitor_id';

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'v-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  }

  function visitorId() {
    try {
      var current = localStorage.getItem(storageKey);
      if (current) return current;
      current = uuid();
      localStorage.setItem(storageKey, current);
      return current;
    } catch (error) {
      return uuid();
    }
  }

  function title() {
    var h1 = document.querySelector('h1[itemprop="name headline"], h1.title, h1');
    return h1 ? h1.textContent.trim() : document.title;
  }

  function payload(eventName) {
    return {
      event: eventName || 'pageview',
      visitorId: visitorId(),
      path: window.location.pathname,
      url: window.location.href,
      title: title(),
      referrer: document.referrer || '',
      language: navigator.language || '',
      screen: window.screen ? window.screen.width + 'x' + window.screen.height : '',
      viewport: window.innerWidth + 'x' + window.innerHeight,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      userAgent: navigator.userAgent || '',
      ts: new Date().toISOString()
    };
  }

  function send(eventName) {
    var body = JSON.stringify(payload(eventName));
    var apiBase = endpoint ? endpoint.replace(/\/$/, '') : '';
    var url = apiBase + '/api/track';

    if (navigator.sendBeacon) {
      try {
        var blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon(url, blob)) return;
      } catch (error) {}
    }

    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: body,
      keepalive: true,
      mode: 'cors'
    }).catch(function () {});
  }

  function trackPageview() {
    send('pageview');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackPageview);
  } else {
    trackPageview();
  }

  document.addEventListener('pjax:success', function () {
    setTimeout(trackPageview, 80);
  });
})();
