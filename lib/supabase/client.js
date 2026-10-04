'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseConfig } from './config.mjs';

export function createClient() {
  const config = getSupabaseConfig({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  if (!config.ready) throw new Error(config.reason);
  return createBrowserClient(config.url, config.key);
}
