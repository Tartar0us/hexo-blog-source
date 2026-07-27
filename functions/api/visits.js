import { listVisits } from '../_lib/analytics.js';

export async function onRequestGet({ request, env }) {
  return listVisits(request, env);
}
