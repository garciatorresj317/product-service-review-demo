import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '../../lib/supabase/config.mjs';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Supabase setup | Product & Service Review' };

export default async function SetupPage() {
  const config = getSupabaseConfig();
  let state = 'Setup required';
  let message = config.reason;
  let errorOutput;
  if (config.ready) {
    const client = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false } });
    try {
      const { data, error } = await client.rpc('foundation_version').abortSignal(AbortSignal.timeout(8000));
      if (error) {
        state = 'Connection check failed';
        message = 'The database check did not pass. Confirm your project settings and run the foundation migration.';
        errorOutput = `${error.code ? `${error.code}: ` : ''}${error.message}`.replaceAll(config.key, '[redacted key]');
      } else if (data !== '001') {
        state = 'Unexpected database version';
        message = 'The connected database did not report the expected foundation version (001).';
      } else {
        state = 'Connected · Foundation migration found';
        message = 'The app reached Supabase and called the foundation version function successfully. Run the SQL isolation tests separately; this connection check does not prove data isolation.';
      }
    } catch (error) {
      state = 'Connection check failed';
      message = 'The database request could not complete. Check the project URL and network connection, then reload.';
      errorOutput = `${error.name || 'Error'}: ${error.message || 'The Supabase request could not complete.'}`.replaceAll(config.key, '[redacted key]');
    }
  }
  return (
    <>
      <header className="header"><Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">✳</span> Product & Service Review</Link><Link className="nav-link" href="/">Back to home</Link></header>
      <main className="setup-page">
        <p className="eyebrow">MILESTONE 1 / SUPABASE FOUNDATION</p>
        <h1>Database setup</h1>
        <section className="setup-card" aria-labelledby="status-heading"><h2 id="status-heading">{state}</h2><p>{message}</p>{errorOutput && <pre className="setup-error">{errorOutput}</pre>}<a className="button" href="/setup">Check again <span aria-hidden="true">↻</span></a></section>
        <section className="setup-card"><h2>Connect your Supabase project</h2><ol><li>Create a Supabase project for this app.</li><li>Copy <code>.env.example</code> to <code>.env.local</code>. Add your project URL and publishable key from Supabase’s Connect dialog.</li><li>In Supabase’s SQL Editor, run <code>supabase/migrations/001_foundation.sql</code>.</li><li>Run <code>supabase/tests/001_isolation.sql</code> in the SQL Editor. It checks access rules using temporary test data and rolls everything back.</li><li>Restart the local app and click <strong>Check again</strong>.</li></ol><p>Keep private keys out of the app. This milestone uses only the project URL and publishable key.</p></section>
        <p className="build-note">This milestone prepares the connection and database. Sign-up, company setup, employee forms, and review submission will be added in later milestones.</p>
      </main>
    </>
  );
}
