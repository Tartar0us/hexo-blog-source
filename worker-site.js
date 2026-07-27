import { listVisits, summary, track } from './functions/_lib/analytics.js';

function responseWithCors(status) {
  return new Response(null, {
    status,
    headers: {
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'content-type,authorization,x-admin-token',
      'access-control-max-age': '86400'
    }
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return responseWithCors(204);

    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/api/track') return track(request, env);
    if (request.method === 'GET' && url.pathname === '/api/summary') return summary(request, env);
    if (request.method === 'GET' && url.pathname === '/api/visits') return listVisits(request, env);

    return env.ASSETS.fetch(request);
  }
};
