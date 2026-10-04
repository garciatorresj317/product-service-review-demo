export function getSupabaseConfig(env = process.env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) return { ready: false, reason: 'Add your Supabase project URL and publishable key to .env.local, then restart the app.' };
  try {
    const parsed = new URL(url);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
    if (parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:')) throw new Error('Invalid protocol');
    if (parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/') throw new Error('Invalid URL');
  } catch {
    return { ready: false, reason: 'NEXT_PUBLIC_SUPABASE_URL must be your Supabase project base URL (HTTPS, or HTTP for a local Supabase instance).' };
  }
  // This app never needs an admin key. Reject both modern secret and legacy service-role keys.
  if (!key.startsWith('sb_publishable_')) {
    return { ready: false, reason: 'Use a Supabase publishable key (sb_publishable_...), not a secret or service-role key.' };
  }
  return { ready: true, url, key };
}
