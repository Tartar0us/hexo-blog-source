import { track } from '../_lib/analytics.js';

export async function onRequestPost({ request, env }) {
  return track(request, env);
}
