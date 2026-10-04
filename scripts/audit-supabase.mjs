// Read-only audit. Never signs in, creates records, applies SQL, or prints keys.
import { loadEnvFile } from 'node:process';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '../lib/supabase/config.mjs';

try { loadEnvFile('.env.local'); } catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const config = getSupabaseConfig();
console.log(`Environment configuration: ${config.ready ? 'PASS (values withheld)' : config.reason}`);
if (!config.ready) process.exit(1);
const safe = value => String(value).replaceAll(config.key, '[redacted key]').replaceAll(config.url, '[project URL]');
const client = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false } });
const version = await client.rpc('foundation_version').abortSignal(AbortSignal.timeout(10000));
console.log('Foundation RPC:', version.error ? safe(`${version.error.code}: ${version.error.message}`) : JSON.stringify(version.data));
for (const table of ['companies', 'company_users', 'employees', 'reviews']) {
  const result = await client.from(table).select(table === 'company_users' ? 'company_id' : 'id').limit(0).abortSignal(AbortSignal.timeout(10000));
  // A zero-row GET inspects availability/grants without retrieving customer records.
  console.log(`${table}:`, result.error ? safe(`${result.error.code}: ${result.error.message}`) : 'anonymous zero-row query accepted; actual row visibility and owner isolation still unverified');
}
try {
  const response = await fetch(`${config.url}/auth/v1/settings`, { headers: { apikey: config.key }, signal: AbortSignal.timeout(10000) });
  const settings = await response.json();
  console.log('Auth settings HTTP:', response.status);
  if (response.ok) console.log(JSON.stringify({ signupDisabled: settings.disable_signup, emailProviderEnabled: settings.external?.email, emailAutoconfirm: settings.mailer_autoconfirm }));
  else console.log(safe(settings.msg || settings.message || 'Auth settings request failed'));
} catch (error) { console.log('Auth settings error:', safe(error.message)); }
console.log('SQL migrations, RLS catalogs, and two-owner tests require privileged SQL access; not verified by this publishable-key audit.');
