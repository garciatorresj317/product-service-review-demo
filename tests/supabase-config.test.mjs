import test from 'node:test';
import assert from 'node:assert/strict';
import { getSupabaseConfig } from '../lib/supabase/config.mjs';

const configured = { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test' };
test('missing settings are explicit and do not expose configured values', () => {
  const result = getSupabaseConfig({ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'secret-value' });
  assert.equal(result.ready, false);
  assert.equal(JSON.stringify(result).includes('secret-value'), false);
});
test('allows HTTPS and local Supabase, rejects insecure remote and malformed URLs', () => {
  for (const url of ['https://example.supabase.co', 'http://127.0.0.1:54321']) assert.equal(getSupabaseConfig({ ...configured, NEXT_PUBLIC_SUPABASE_URL: url }).ready, true);
  for (const url of ['bad-url', 'http://remote.example', 'https://user:password@example.com', 'https://example.com/rest/v1', 'https://example.com?key=x']) assert.equal(getSupabaseConfig({ ...configured, NEXT_PUBLIC_SUPABASE_URL: url }).ready, false);
});
test('rejects secret and legacy service-role keys without exposing them', () => {
  for (const key of ['sb_secret_private', 'eyJhbGciOiJIUzI1NiJ9.service-role.signature']) {
    const result = getSupabaseConfig({ ...configured, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key });
    assert.equal(result.ready, false);
    assert.equal(JSON.stringify(result).includes(key), false);
  }
});
