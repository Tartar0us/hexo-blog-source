import { summary } from '../_lib/analytics.js';

export async function onRequestGet({ request, env }) {
  return summary(request, env);
}
