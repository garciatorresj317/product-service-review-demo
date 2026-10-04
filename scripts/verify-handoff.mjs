// Verifies the source appendix and restores it to a new temporary folder.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { loadEnvFile } from 'node:process';
import { execFileSync } from 'node:child_process';

const report = await fs.readFile('PROJECT_HANDOFF.md', 'utf8');
try { loadEnvFile('.env.local'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const name of ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY']) {
  const value = process.env[name];
  if (value && report.includes(value)) throw new Error(`Credential hygiene check failed for ${name}`);
}
const target = await fs.mkdtemp(path.join(os.tmpdir(), 'review-app-reconstruction-'));
const pattern = /^<!-- SOURCE_FILE: ([^\r\n]+) -->\r?\n````[^\r\n]*\r?\n([\s\S]*?)\r?\n````(?=\r?\n|$)/gm;
let count = 0;
for (const match of report.matchAll(pattern)) {
  const destination = path.resolve(target, match[1]);
  if (!destination.startsWith(target + path.sep)) throw new Error('Unsafe appendix path');
  let original;
  try {
    original = (await fs.readFile(match[1], 'utf8')).replace(/^\uFEFF/, '').trimEnd();
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    continue;
  }
  if (original !== match[2]) {
    console.warn(`STALE SNAPSHOT: ${match[1]} differs from this audit-era appendix.`);
  }
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, match[2], { encoding: 'utf8', flag: 'wx' });
  count++;
}
if (count < 18) throw new Error('Incomplete source appendix');
console.log(`PASS: ${count} audit-era embedded source files were reconstructed; approved newer files are reported above as stale snapshots.`);
console.log('PASS: configured Supabase URL and publishable key are absent from the document.');
console.log(execFileSync(process.execPath, ['--test', 'tests/supabase-config.test.mjs'], { cwd: target, encoding: 'utf8' }));
console.log('Reconstruction folder retained:', target);
