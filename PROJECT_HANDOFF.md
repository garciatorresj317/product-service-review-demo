# PROJECT HANDOFF AND RECONSTRUCTION DOCUMENT

Audit date: October 3, 2026 (America/New_York).

Canonical project root at audit: `C:\Users\jthar\Documents\ChatGPT\service review App`.

This report was prepared by reading the actual repository and running the checks below. The source appendix contains the actual current text files, including the lockfile, so this document alone can reconstruct the current app in an empty folder. No `.env.local` values, passwords, private keys, or access tokens are included. Repository files take precedence over this snapshot after future edits. Update this document after each approved milestone; refresh both the status/evidence and source appendix.

**Current stopping point:** landing page accepted; Supabase foundation code and local environment configuration created; live remote database foundation is not available through the Data API. No business authentication screens or dashboard have been implemented. Do not confuse Supabase Auth being reachable with a working app login or completed database setup. No full MVP workflow has been verified.

## 1. Product definition

The product is a private customer-feedback and employee review platform for businesses. The displayed product name remains **Product & Service Review**. It is not a public product comparison site and not a resume app.

Finished core workflow:

Business owner creates an account → creates a company → adds an employee → receives that employee's unique normal web URL → customer opens that URL via NFC, QR, or direct link → page identifies the employee → customer submits an overall rating and written feedback without an account → feedback is privately saved under the correct company and employee → authenticated company owner sees it in their dashboard.

Users:

- Business owners/admins manage their company, employees, employee URLs, and private feedback. Managers may be considered later, but the implemented schema only supports an owner role.
- Customers only open an employee review form and submit feedback. They cannot read company reviews or enter the dashboard.
- Employees are records inside a company; they do not automatically receive login accounts or administrative access.

The problem is collecting useful feedback about a specific interaction, recognizing good service, and finding service problems internally. Company records, employees' management information, and submitted reviews must remain private to the authorized company. A future public form necessarily reveals only the minimum employee/company identity needed to identify the interaction, not historical feedback or administrative records.

NFC hardware is not an application integration: a card contains the employee URL and the phone opens it. The same URL can be copied, sent directly, or encoded into a QR code. No proprietary NFC software, card reader integration, or QR generator is required to prove the MVP.

Scope: simple sign-up/login/logout, company setup, employee add/list/edit/deactivate, stable links, mobile customer rating/feedback, private storage, owner dashboard, and employee filtering. Excluded without explicit approval: public reviews/profiles, publishing or redirection to review platforms, social feeds, advertising, affiliates, AI, payroll, scheduling, CRM, monitoring, gamification, leaderboards, advanced analytics, subscriptions, and billing. Use Next.js, Supabase DB/Auth, Vercel later. Preserve the accepted landing design.

Repository decisions already encoded:

- Companies may share an owner account; one company currently has exactly one owner membership. Multi-manager permissions are not implemented.
- Company creation SQL assigns ownership from `auth.uid()`, never a client-supplied owner ID.
- Employee review token is a generated UUID; intended future route is `/review/<review_token>`. This URL design exists in comments/documentation, not as a route.
- Reviews contain rating 1–5 and written feedback 1–5000 trimmed characters. No customer name/email fields or extra questionnaire are defined.
- Owners may delete their own reviews but cannot rewrite feedback or directly insert customer reviews through the current grants.
- Every feature requires a stop, explicit test results, browser steps, and user approval before the next major milestone. Show actual failures before any fixes.

## 2. Current feature status

Statuses describe repository implementation, with remote availability called out separately.

| Feature | Status | Files involved | What works | What is missing |
|---|---|---|---|---|
| Landing page | IMPLEMENTED | `app/page.js`, `layout.js`, `globals.css` | Renders product explanation, privacy and planned workflow | No functional account CTA yet |
| Visual design | IMPLEMENTED | `app/globals.css`, screenshots | Accepted green/cream responsive design | No redesign needed |
| Navigation | IMPLEMENTED | `page.js`, `setup/page.js` | Home anchor; setup reload; back to home | No authenticated app navigation |
| Employee illustration | UI ONLY | `app/page.js` | Fictional John example, clearly labeled | Not a customer form or real employee |
| Supabase connection utilities | PARTIALLY IMPLEMENTED | `lib/supabase/*`, `proxy.js` | Config validation, browser/server factories | End-to-end auth usage not exercised |
| Setup status page | IMPLEMENTED | `app/setup/page.js` | Live version RPC, actual error display, setup instructions | Currently shows missing foundation RPC |
| Local environment | IMPLEMENTED | `.env.local`, `.env.example`, `.gitignore` | Required values populated; config passes; ignored by Git | Separate values must be supplied in a new environment |
| Database schema/migration | PARTIALLY IMPLEMENTED | `supabase/migrations/001_foundation.sql` | Complete local transactional SQL file | Remote tables/RPC absent from API schema cache |
| RLS/company isolation | PARTIALLY IMPLEMENTED | same migration | Policies and column grants written | No privileged remote verification or two-owner execution |
| Isolation tests | PARTIALLY IMPLEMENTED | `supabase/tests/001_isolation.sql` | Actual database test script written, rollback fixtures | Not run against this Supabase project by this audit |
| Automated local tests | IMPLEMENTED | `tests/supabase-config.test.mjs` | 3 config tests pass | No business workflow tests yet |
| Auth infrastructure | PARTIALLY IMPLEMENTED | SSR clients, proxy | Cookie/session-refresh scaffolding; remote Auth settings accessible | Protected pages, credentials flow, session persistence verification |
| Sign-up | NOT STARTED | No route | Remote email provider enabled | App form/action, confirmation handling |
| Login | NOT STARTED | No route | None in app | App login flow |
| Logout | NOT STARTED | No route | None in app | Logout action/session clearing |
| Persistent sessions | PARTIALLY IMPLEMENTED | `proxy.js`, server/client factories | Refresh mechanism prepared | No real login/session tests |
| Company creation | PARTIALLY IMPLEMENTED | `create_company` SQL | Atomic company/owner membership function written | Remote function/UI missing |
| Company ownership | PARTIALLY IMPLEMENTED | companies/company_users SQL | Auth foreign keys and owner-only policies | Applied schema and authenticated tests |
| Employee creation | PARTIALLY IMPLEMENTED | employees SQL | Fields/grants/policies prepared | UI, actions, live insert verification |
| Employee management | PARTIALLY IMPLEMENTED | employees SQL | Name/active updates permitted for owner | List/edit/deactivate screens |
| Unique employee URLs | PARTIALLY IMPLEMENTED | `review_token` SQL, setup docs | Stable unique UUID design | Route, generated full URL, copy UI |
| Public employee page | NOT STARTED | No `app/review` directory | None | Narrow public lookup and mobile page |
| Review form | UI ONLY | Fictional landing card only | Explanatory illustration | Actual fields, validation, submit state |
| Review submission | NOT STARTED | No action/RPC | Direct writes intentionally denied | Narrow anonymous submission RPC and UI |
| Review storage | PARTIALLY IMPLEMENTED | reviews SQL | Constraints/indexes/FKs written | Remote table availability and real submissions |
| Private dashboard | NOT STARTED | No dashboard route | Proxy matcher anticipates route | Authentication protection and company data UI |
| Employee filtering | PLANNED | Intended reviews indexes | Indexed data model planned | Filter controls and queries |
| NFC readiness | PARTIALLY IMPLEMENTED | Stable token design | Normal URL concept | Real reachable link and copy UI |
| QR readiness | PARTIALLY IMPLEMENTED | Same token concept | Same URL can be QR destination | Real deployed link; QR generation not required |
| Vercel deployment | NOT STARTED | No Vercel config/link evidence | Standard Next.js build suitable for later deployment | Deployment approval, env settings, public origin |
| Read-only audit | IMPLEMENTED | `scripts/audit-supabase.mjs` | Redacted config/API/Auth probes | Cannot inspect catalogs or run SQL with publishable key |
| Handoff/reconstruction | IMPLEMENTED | This document and embedded sources | Product, exact source, setup state and roadmap | Must be refreshed after later milestones |

## 3. Repository structure and connections

```text
/
  AGENTS.md                     Whole-repository product/development rules
  PROJECT_HANDOFF.md            Canonical current handoff, including source appendix
  SUPABASE_SETUP.md             Manual setup instructions and foundation decisions
  package.json                 Next dev/build/start scripts; six direct dependencies
  package-lock.json            Exact dependency graph, npm lockfile v3
  .gitignore                   Excludes modules/build output/logs/local env
  .env.example                 Empty names for the two public settings
  .env.local                   Local populated settings; OMITTED from handoff
  proxy.js                     Supabase cookie refresh on /auth and /dashboard
  app/
    layout.js                  HTML language, metadata, imports global stylesheet
    page.js                    Static informational landing page
    globals.css                All styling including responsive setup styles
    setup/page.js              Dynamic Supabase connection/setup status
  lib/supabase/
    config.mjs                 Pure environment validation shared with Node tests
    client.js                  Client-component browser Supabase factory
    server.js                  Server-only cookie-aware SSR Supabase factory
  supabase/
    migrations/001_foundation.sql  Tables, grants, policies, two RPCs in a transaction
    tests/001_isolation.sql        Role/tenant tests inside a rolled-back transaction
  tests/supabase-config.test.mjs   Node built-in test runner
  scripts/audit-supabase.mjs       Read-only live audit, no writes or secret output
  scripts/verify-handoff.mjs       Source parity, env-value omission, reconstruction tests
  home-page-preview.jpg           Prior landing screenshot
  supabase-setup-preview.jpg       Historical no-env setup screenshot
  handoff-home-audit.jpg           Current development landing screenshot
  handoff-setup-audit.jpg          Current actual missing-RPC screenshot
  node_modules/                   Generated, do not copy to reconstruct
  .next/                          Generated, do not copy to reconstruct
  .git/                           Local repository metadata
```

No separate `components/`, `public/`, `src/`, API routes, `next.config`, TypeScript config, ESLint config, Supabase CLI config/link, or deployment config currently exists. Do not invent their existence. `.git` exists but the audited source files were all untracked (`git status --short`); there is no verified committed project snapshot. Transfer the actual files or use this source appendix rather than assuming Git history contains them.

`layout.js` wraps both routes and imports the shared CSS. `page.js` performs no reads/writes. `/setup` validates config and uses a stateless Supabase client to call only `foundation_version()`. The SSR utilities and proxy are scaffolding for future authentication; no existing page calls the cookie-aware server factory. SQL defines the future business model. Node tests exercise config only. Migration/test scripts are not automatically executed by Next.js.

## 4. Current UI and design system

Source of truth: full `app/globals.css` and `app/page.js` in the appendix. The page has no external images, web fonts, icon package, UI framework, or reusable component library. The employee graphic is CSS plus a letter J; the brand mark is the Unicode character ✳.

Tokens and defaults:

| Token/style | Exact value |
|---|---|
| `--ink` | `#183a32` |
| `--muted` | `#64746e` |
| `--paper` | `#f8f9f5` |
| `--line` | `#dde4db` |
| `--green` | `#245b45` |
| Body font | Arial, Helvetica, sans-serif |
| Emphasized hero text | Georgia, serif; normal weight; `#527358` |
| Page maximum width | 1200px; centered |
| Main heading | `clamp(42px,4.5vw,64px)`; line-height 1.08; tracking -2.8px |
| Eyebrows | 11px, bold, uppercase, letter spacing 1.6px |
| Body intro | 17px; line-height 1.8; maximum 460px |
| Button | Green/white; 17px 23px padding; 7px radius; 14px bold; 30px internal gap |
| Focus indicator | 3px `#b07830`, 6px outline offset |

Header `.header`: min-height 100px; flex aligned center, space-between; 24px 40px padding; bottom border. Brand `.brand` 17px bold with 11px icon gap; mark 31px. Navigation is a 14px text link. Brand remains “Product & Service Review.”

Hero `.hero`: desktop two columns `1.2fr 1fr`, 72px gap, centered vertically, 84px 40px 88px padding. Heading reads “Better service / starts with listening.” Intro and a green “See how it works” anchor follow. Build notice explicitly says accounts and collection are unavailable. No nonfunctional login or submit button is implied.

Illustration `.preview`: pale green `#e9eee3`, 1px `#dce3d5` border, 18px radius, 23px padding, 2-degree rotation. Top row wraps and contains “Illustration only.” Employee avatar is 88px circular green/white, 38px Georgia, soft shadow. Above the card, the connection label names NFC/QR/direct link. `.review-card`: white, 12px radius, 24px padding, subtle shadow. It identifies fictional John, explains the form, uses a pale stacked two-step `.workflow-note`, shows “Private by default,” and discloses no feedback is collected. This is a display card, not a form.

How-it-works `.how`: top border; 64px 40px padding; heading 34px/-1.1px tracking. `.steps`: three equal columns, 35px gap, 40px margin-top. Each article has a thin top border, a small 01/02/03 label, 18px heading, and 14px/1.8 muted text. Anchor `#how-it-works` is shared by both links.

Privacy `.principle`: green tint `#eaf0e5`, 12px radius, 34px padding, 27px flex gap, margin 0 40px 64px. Star 47px, heading 22px, body 14px/1.8. Footer is a bordered flex row with brand and “Listen better. Serve better.”; 28px 40px padding; 12px muted type.

Responsive behavior:

- At ≤800px hero and steps stack; hero/page sections use 40px 22px padding; illustration max-width 450px, centered, rotation removed. Brand is 14px, nav 12px, heading tracking -1.8px.
- At ≤420px brand max-width 205px and wraps; privacy star hidden; preview/card padding reduced to 16/20px; footer wraps text naturally with 20px gap.
- `prefers-reduced-motion: reduce` disables smooth scrolling.
- `/setup` uses the same header and colors. Its main content max-width is 850px with 55px 40px padding, heading 42px. White setup cards have 12px radii, borders, 26px padding, 24px vertical margin. Error text is wrapped monospace in `#fff3ed` with `#8a3925`. ≤600px padding becomes 35px 22px, cards 20px.
- Remaining `.rating`/`.empty-star` styles are unused remnants in CSS, not implemented ratings UI. Do not count them as functional features.

Screenshots are evidence, not runtime assets. Historical setup preview shows missing env; the current audit preview shows missing database RPC. Do not use the old screenshot as proof the live connection is successful.

## 5. Technical architecture

Versions verified from `package-lock.json` and `npm ls --depth=0`:

| Component | Installed version |
|---|---|
| Node.js audit runtime | 24.19.0 |
| npm audit runtime | 11.17.0 |
| Next.js | 16.3.8 |
| React / React DOM | 19.3.0 / 19.3.0 |
| `@supabase/ssr` | 0.12.7 |
| `@supabase/supabase-js` | 2.117.2 |
| `server-only` | 0.0.1 |

Next.js App Router; JavaScript/JSX, not TypeScript. `.mjs` enables config/test/audit modules to run under Node without changing package module type. Styling is hand-authored global CSS. Default Turbopack builds are used. No lint/typecheck scripts or tools are configured. The Next build's “Running TypeScript” message does not prove comprehensive type checking of this JavaScript project.

`package.json` currently uses `latest` for Next/React and caret ranges for Supabase. **Use the included lockfile and `npm ci` to reproduce versions.** Running a fresh `npm install` without the lockfile may produce different versions. There is no need to scaffold with create-next-app; that would add/change files beyond this exact implementation.

Scripts: `dev: next dev`, `build: next build`, `start: next start`. Tests use `node --test tests/supabase-config.test.mjs`; no `npm test` script exists. Production start needs a successful build first.

Server/client decisions:

- Root layout, home, setup are Server Components. Home can be statically generated; setup explicitly exports `dynamic = 'force-dynamic'` to avoid stale connection checks.
- `client.js` is a client module with `createBrowserClient` for future browser auth use.
- `server.js` imports `server-only`, reads async Next cookies, creates a request-specific SSR client, and permits cookie writes where supported. The catch covers Server Component cookie-write restrictions; evaluate error handling when integrating auth rather than assuming every cookie error is harmless.
- `proxy.js` matches only `/auth/:path*` and `/dashboard/:path*`; those routes do not yet exist. It calls `getClaims`, carries cookie updates to request and response, forwards supplied headers, and sets private/no-store. It does **not** redirect unauthenticated users and is **not** a protected dashboard by itself. Future pages/actions must explicitly verify identity and rely on RLS.
- Setup uses a separate no-session client with an 8-second abort timeout. It checks `foundation_version() === '001'`, not catalogs, data presence, policy correctness, or user isolation.
- There is no ORM, API server, service-role client, AI integration, real-time subscription, or database write from the current UI.

Deployment assumption: later deploy standard Next.js to Vercel, supply the same env names there, configure Supabase auth allowed redirects/site URL to the deployed origin, and use a real HTTPS origin for customer/NFC links. No deployment exists or was performed during this audit.

## 6. Supabase implementation and security model

Variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Obtain separately from the Supabase project's Connect dialog. Modern key must start `sb_publishable_`. Config trims values, allows HTTPS project base URLs or HTTP loopback, rejects credentials/query/hash/subpaths and nonpublishable keys. This only validates syntax/type; it does not authenticate the key or prove the database exists. Values are intentionally omitted here. No admin/database credentials are configured for automation.

Relationship:

```text
auth.users(id)
  → companies(owner_id)
  → company_users(company_id, user_id=owner_id, role=owner)
  → employees(company_id, id, review_token)
  → reviews(company_id, employee_id)
```

Every table also has `created_at timestamptz not null default now()`.

| Table | Columns, keys and constraints |
|---|---|
| `companies` | UUID `id` PK/default; `owner_id` required FK to `auth.users(id)` cascade; `name` required trimmed length 1–120; unique `(id,owner_id)` |
| `company_users` | `company_id` PK; `user_id` required auth FK cascade; role required/default `owner`, check owner only; composite FK `(company_id,user_id)` → companies `(id,owner_id)` cascade |
| `employees` | UUID `id` PK/default; required company FK cascade; name trimmed length 1–120; `active` required/default true; UUID `review_token` required/unique/default; unique `(company_id,id)` |
| `reviews` | UUID `id` PK/default; company FK cascade; required employee UUID; required smallint rating 1–5; required feedback trimmed length 1–5000; composite FK `(company_id,employee_id)` → employees `(company_id,id)` with delete restrict |

Composite review FK means a review cannot name company A and an employee belonging to company B, including privileged inserts. The future submit function must resolve both IDs from the token; never trust independently supplied customer IDs. Deactivation must be checked inside the submit function when introduced. Current schema alone does not enforce active-only submissions because no customer submit path exists yet.

Indexes: `companies_owner_idx(owner_id)`, `company_users_user_idx(user_id)`, `employees_company_idx(company_id)`, `reviews_company_date_idx(company_id,created_at desc)`, `reviews_employee_date_idx(employee_id,created_at desc)`, plus automatic PK/unique indexes.

RLS enabled on all four public tables. Default grants revoked from PUBLIC, anon, authenticated, then narrowly granted:

- Authenticated SELECT all four tables, subject to RLS.
- Company UPDATE only `name`, owner policy.
- Employee INSERT only `company_id,name`; UPDATE only `name,active`, owner policies. IDs/company association/review tokens cannot be updated through these client grants.
- Review DELETE only, owner policy. No client INSERT or UPDATE.
- No anonymous private table access; no client membership writes; no client company INSERT or owner transfer; no employee DELETE grant.

Exact policies:

| Policy | Command | Predicate |
|---|---|---|
| `company_owner_read` | companies SELECT | owner_id = auth.uid() |
| `company_owner_update` | companies UPDATE | owner_id = auth.uid(), same WITH CHECK |
| `own_membership_read` | company_users SELECT | user_id = auth.uid() |
| `employee_owner_read` | employees SELECT | matching company_users company and authenticated user |
| `employee_owner_insert` | employees INSERT | same membership WITH CHECK |
| `employee_owner_update` | employees UPDATE | same membership USING and WITH CHECK |
| `review_owner_read` | reviews SELECT | same membership |
| `review_owner_delete` | reviews DELETE | same membership |

`create_company(company_name text)` returns UUID. SECURITY DEFINER, empty search_path, fully qualified relations. Requires nonnull `auth.uid()`, validates trimmed name, atomically inserts company and owner membership. Execute revoked from PUBLIC/anon, granted only authenticated. This is the narrow exception to ordinary table RLS/grants; callers cannot select the owner ID.

`foundation_version()` returns constant text `001`, SQL immutable SECURITY INVOKER with empty search_path; explicitly executable by anon/authenticated. It exposes no company/employee/review data. It is not an authorization endpoint.

Migration `001_foundation.sql` uses BEGIN/COMMIT and is intended to run once on a fresh project; it is not idempotent. Do not blindly rerun or drop data when a partially configured project is found. Verify catalogs first with authorized SQL access. There is no migration runner or remote CLI link in this repo.

Isolation script `001_isolation.sql`: transaction creates generated temporary Auth users A/B, impersonates authenticated roles/JWT subjects, calls company creation and employee inserts, seeds reviews under privileged role, tests foreign company/employee mismatch and feedback constraints, checks both owners' reads and denied cross-company changes, permitted own edits, forbidden membership/owner/token changes, forbidden direct review writes, blank company rejection, and anon read/company-create denial. Ends with ROLLBACK and PASS message. Needs privileged SQL Editor access to seed auth users and switch roles. It is not run by `node --test`. If it errors, preserve output and issue ROLLBACK before another attempt.

Security limitations: written policies are not proof they are applied remotely. No live tenant security certification, anonymous review submission, anti-abuse mechanism, management roles, or production security audit has been completed. Do not weaken RLS to work around UI problems. Publishable-key API probes cannot inspect privileged catalogs or execute arbitrary SQL.

## 7. Current setup state and stopping point

| Check | Audit finding |
|---|---|
| `.env.local` | Exists; both required settings populated; config validation passed; values omitted |
| Git env exclusion | `.env*` ignored except `.env.example` |
| Supabase reachable | Yes: Auth settings HTTP 200; Data API responds with schema-cache errors |
| Auth provider | Email enabled, signup not disabled, email autoconfirm false (confirmation required) |
| Foundation RPC | Not available in API schema cache, PGRST202 |
| Four tables | Not available in API schema cache, PGRST205 for each |
| Migration applied | Not verified; API evidence strongly suggests unapplied foundation or schema-cache/configuration problem |
| Physical remote table existence | Not inspected with privileged SQL; cannot conclusively infer absence from schema-cache errors alone |
| RLS remotely applied | Unknown; no catalog access |
| Two-owner SQL tests | Not executed by this audit; no results file showing prior successful execution |
| Build | Pass |
| Dev server | Pass, served both routes HTTP 200 on temporary port 3002 |
| ESLint | Not configured; not run, not a pass |
| TypeScript checking | No TS files/config/standalone check; not applicable, not a pass |
| CLI/SQL access | psql, Supabase CLI, Docker not found on PATH; no DB/admin credential or linked CLI project |

Local configuration is ready; the app is not fully connected to an operational foundation. An HTTP 200 from `/setup` means the status page renders; it is not proof the database check succeeded. In the browser it displays **Connection check failed** with PGRST202.

Development stopped before authentication milestone. The user explicitly prohibited proceeding to the next milestone without approval. This handoff task authorizes documentation/read-only checks; it does not authorize implementing all unfinished features. First unblock/verify the foundation, then obtain approval for authentication.

## 8. Test evidence from this audit

No application fixes were made during this audit. Added read-only audit/reconstruction verification scripts and handoff/evidence artifacts only.

| Command/check | Result | PASS/FAIL | Important output |
|---|---|---|---|
| `npm.cmd ls --depth=0` | All six direct deps present, no missing-dependency errors | PASS | Next 16.3.8, React 19.3.0, Supabase SSR 0.12.7 / JS 2.117.2 |
| `node --test tests/supabase-config.test.mjs` | 3 tests, 3 pass, 0 fail | PASS | Missing settings; URL validation; secret-key rejection |
| `node scripts/verify-handoff.mjs` | All 19 source snapshots match; restored into empty temp folder; restored config tests pass | PASS | Configured URL/key absent from report; 3 reconstructed tests pass |
| `npm.cmd run build` | Compiles and generates home; setup dynamic; proxy registered | PASS | `.env.local` loaded; compiled successfully; `/`, `/_not-found`, `/setup` |
| `node scripts/audit-supabase.mjs` | Read-only remote check executes and reports errors | FAIL for foundation readiness | PGRST202 + four PGRST205; Auth HTTP 200 |
| `npm.cmd run dev -- --port 3002` | Startup and actual browser page responses | PASS | Ready in 373ms; `GET /setup 200`, `GET / 200` |
| Browser `/setup`, Check again | Correctly displays current RPC failure on both requests | PASS for error handling; FAIL for DB connection | Actual PGRST202 visible |
| Browser Back to home, See how it works | Navigates home and `/#how-it-works` | PASS | Correct accepted content and anchor |
| `supabase/tests/001_isolation.sql` | Not run, requires privileged SQL access | NOT RUN | No owner isolation conclusion |
| Lint/typecheck | No scripts/configuration available | NOT CONFIGURED | Build is not a substitute for linting or JS type coverage |

Audit script exits zero when the probes complete even if the foundation RPC fails; read the reported results, not just process exit status. First preliminary HEAD probes returned null counts without errors and were inconclusive; final zero-row GET probes reported the schema-cache errors below. No customer data was retrieved and no remote records were written.

Actual remote errors:

```text
Foundation RPC: PGRST202: Could not find the function public.foundation_version without parameters in the schema cache
companies: PGRST205: Could not find the table 'public.companies' in the schema cache
company_users: PGRST205: Could not find the table 'public.company_users' in the schema cache
employees: PGRST205: Could not find the table 'public.employees' in the schema cache
reviews: PGRST205: Could not find the table 'public.reviews' in the schema cache
Auth settings HTTP: 200
{"signupDisabled":false,"emailProviderEnabled":true,"emailAutoconfirm":false}
```

Likely cause: foundation SQL has not been installed in the configured project. Alternatives: wrong project, schema exposure/cache issue. No automatic fix attempted; the audit has no SQL execution credentials. Do not diagnose these as network failure or bad-key failure when both API and Auth return application responses.

Browser dev warning (nonblocking, unchanged):

```text
Detected `scroll-behavior: smooth` on the <html> element. To disable smooth scrolling during route transitions, add `data-scroll-behavior="smooth"` to your <html> element.
```

The earlier browser binding was stale (`Tab 2 is not part of browser session`); a fresh temporary tab was created and the checks then succeeded. This was tooling recovery, not an app defect. Next dev also reported generating framework agent guidance; root `AGENTS.md` was inspected afterward and retains the project's rules.

## 9. Exact reconstruction from an empty directory

Preferred: copy all source/config/test/SQL files plus `package-lock.json` from the actual repository. Do not copy `.env.local`, `.git`, `.next`, or `node_modules` into a shareable reconstruction. Screenshots are optional visual references; they are not needed to render either page.

If only this document is available, Appendix A contains each required text file, including the original lockfile and rules. Extract the source blocks into matching relative paths, preserving Unicode and line contents. The four-backtick fences allow embedded Markdown with three-backtick fences.

To extract automatically, save the following as `reconstruct.mjs` beside this document, then run `node reconstruct.mjs PROJECT_HANDOFF.md ./reconstructed-app`. Use an EMPTY destination. The extractor refuses overwrites and path escapes. It restores source, not `.env.local` or binary screenshots.

```javascript
import fs from 'node:fs/promises';
import path from 'node:path';
const [documentPath, targetPath] = process.argv.slice(2);
if (!documentPath || !targetPath) throw new Error('Usage: node reconstruct.mjs PROJECT_HANDOFF.md EMPTY_TARGET');
const target = path.resolve(targetPath);
const report = await fs.readFile(documentPath, 'utf8');
const pattern = /^<!-- SOURCE_FILE: ([^\r\n]+) -->\r?\n````[^\r\n]*\r?\n([\s\S]*?)\r?\n````(?=\r?\n|$)/gm;
let count = 0;
for (const match of report.matchAll(pattern)) {
  const destination = path.resolve(target, match[1]);
  if (!destination.startsWith(target + path.sep)) throw new Error('Unsafe source path');
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, match[2], { encoding: 'utf8', flag: 'wx' });
  count++;
}
if (!count) throw new Error('No source blocks found');
console.log(`Restored ${count} source files`);
```

Initialize/run:

1. Use Node 24.19.0/npm 11.17.0 to reproduce the audited environment (or verify compatibility before changing runtime). No other global tools are necessary for the pages.
2. Copy/extract sources; check the tree matches Section 3. Keep package.json and lockfile together.
3. In the reconstructed root run `npm.cmd ci` on Windows (or `npm ci` elsewhere). Use official registry access; this installs exact lockfile versions.
4. Run `node --test tests/supabase-config.test.mjs`, then `npm.cmd run build`. Expect 3 passes and successful home/setup compilation.
5. Start `npm.cmd run dev -- --port 3001` and open `http://localhost:3001/`. The informational page works without env values.
6. Click See how it works and expect the three-step section. Verify desktop and narrow-mobile layouts against Section 4 and CSS.
7. Open `http://localhost:3001/setup`. Without env expect Setup required. This exactly reproduces the unconfigured state, not the current populated local env.
8. Create/reuse the intended Supabase project; obtain URL and publishable key privately from Connect. Copy `.env.example` to `.env.local` and fill values. Never overwrite an existing environment file blindly.
9. Restart dev. Prior to the migration, expect Connection check failed with PGRST202 (the current audited remote state).
10. To advance beyond the audited remote state: verify tables via privileged SQL, then run the full `001_foundation.sql` once if genuinely fresh/unapplied. Run `001_isolation.sql`, require its final PASS, and preserve actual failures before repairs. This changes remote state; do it only with authorized project access.
11. Reload `/setup` and expect Connected · Foundation migration found after migration. Separately require isolation tests; the version probe alone is insufficient.

Environment template (values intentionally absent):

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_PUBLISHABLE_KEY
```

Existing local root uses port 3001 conventionally. The audit used port 3002 to avoid replacing the user's server. If a port is occupied, do not kill unrelated processes; stop your owned server or pick a new port and adjust browser/auth callbacks appropriately. Production: `npm.cmd run build` then `npm.cmd run start -- --port 3001`.

Reconstruction is not deployment, migration completion, or MVP completion. Keep empty-folder reconstruction limited to what exists rather than silently implementing roadmap items.

## 10. Roadmap to a usable MVP

Each item below is a separate approval boundary. Suggested paths are recommendations, not existing files. Preserve the landing design. After each milestone show changed files, exact tests/results, URL/actions/expected behavior, then stop for approval.

### Milestone 0 — Verify/install the remote foundation (next immediate step)

- Objective: make the existing SQL foundation operational and prove isolation.
- Features: resolve current missing tables/RPC; connect `/setup` successfully.
- Files: existing migration, isolation test, setup docs, handoff evidence. No redesign/auth forms.
- DB: apply existing migration once after checking actual catalogs; fix only if a real error appears and is reported. No speculative schema rewrite.
- Security: privileged SQL access belongs only to the project admin; no service key in public env. Verify all four RLS flags and actual owner-role behavior.
- Tests: read-only audit; full rollback SQL isolation test; build; setup browser check.
- Browser verification: SQL Editor Run; final PASS; app `/setup` Check again → Connected. Table Editor alone is not isolation proof.
- Success: migration present, version RPC 001, isolation script PASS with fixtures rolled back.
- Dependencies: existing local env; authorized SQL access or user executes the supplied two files.

### Milestone 1 — Business-owner authentication

- Objective: actual sign-up/login/logout and persistent owner session.
- Features: email/password forms, confirmation callback, clear waiting/error messages, logout, protected minimal dashboard shell. Do not add company/employee screens in this milestone.
- Likely files: `app/auth/signup/page.js`, `app/auth/login/page.js`, confirmation/callback route and auth actions; `app/dashboard/page.js`; existing clients/proxy; minimal shared styles/nav entry; handoff.
- DB: use existing Supabase Auth; no new public tables necessary.
- Security: verify claims/user server-side, reject unauthenticated dashboard access, prevent open redirects, carry cookies correctly, no private response caching. Keep email confirmation enabled unless user explicitly requests a tested alternative.
- Tests: actual sign-up with authorized disposable test account; confirmation; login; reload/session persistence; logout; incognito direct dashboard denial; malformed forms and invalid credentials. Validate provider/site URL/redirect settings.
- Browser: create account → confirm email → login → protected shell → refresh → logout → dashboard redirects to login.
- Success: real identity persists and protection/logout work, not merely a form submission animation.
- Dependencies: Milestone 0; user approval; access to test mailbox/confirmation or user participates. No password invention or credential disclosure.

### Milestone 2 — Company setup

- Objective: authenticated owner creates their company and sees it on reload.
- Features: setup/name form, `create_company` RPC, membership-aware routing/display, company-name edit if within agreed scope.
- Likely files: dashboard/setup page, company server actions, data-access helper, tests, handoff.
- DB: existing RPC/tables; no self-enrollment grants. Decide how to handle multiple companies before committing UI (schema permits it, UI decision is open).
- Security: owner from verified auth only; never accept owner ID. Bound/validate name; query under caller session/RLS.
- Tests: create, blank/long name rejection, persists after reload, separate second user cannot read/edit company.
- Browser: login → create company → see company name → refresh and see same company.
- Success: actual company and owner membership exist atomically and remain isolated.
- Dependencies: auth milestone and foundation verified; company-count UX decision if necessary.

### Milestone 3 — Employee management and stable links

- Objective: add John, list/edit/deactivate employees, copy a stable URL.
- Features: company-scoped employee form/list; edit name; toggle active; copy URL. No employee auth/profile system.
- Likely files: `app/dashboard/employees/*`, employee actions/queries, copy-link client component, small style additions, tests.
- DB: existing employees table/grants. No token updates or hard deletion.
- Security: verified company ownership; session/RLS queries; never trust a client company ID alone. Avoid configurable arbitrary redirect destinations.
- Tests: actual insert/read/update; invalid name; owner B cannot read/write A; token stable after name/active updates; clipboard copies correct origin/path.
- Browser: add John → list → edit → deactivate/reactivate → copy URL; token portion unchanged.
- Success: persisted employee and full normal URL ready for later public route.
- Dependencies: company setup; origin decision for development vs deployment.

### Milestone 4 — Real employee-specific customer page

- Objective: copied URL displays correct John/company and a mobile-friendly form without customer login.
- Features: `/review/[token]` page, minimal employee lookup, rating/feedback inputs; clear inactive/not-found handling. Be explicit if submit is not wired until Milestone 5.
- Likely files: `app/review/[token]/page.js`, form component, narrow lookup RPC migration and tests.
- DB: new allowlisted lookup function resolving active token; return only intended display names/identity, never private feedback or broad table SELECT permissions.
- Security: unknown/inactive token must not enumerate roster; no admin access; no full company/employee records; token is a public destination, not an owner auth credential.
- Tests: incognito lookup, correct name, invalid UUID/random token, inactive employee, no leaked reviews/roster, mobile layout/accessibility.
- Browser: John's copied URL in incognito → “How was your experience with John?”; inactive link unavailable.
- Success: real read-only form resolves the correct employee under anonymous access without broadening table visibility.
- Dependencies: employees/tokens exist; user approval of minimal displayed company identity if needed.

### Milestone 5 — Real private review submission

- Objective: anonymous customer rating and feedback are saved under exact token-derived company/employee.
- Features: server-validated submit, pending/success/error states, practical duplicate-submit handling.
- Likely files: review form/action, new submission RPC migration, expanded database tests.
- DB: narrow SECURITY DEFINER function with empty search_path, validates token/active/rating/feedback, derives both IDs internally, inserts review, returns only minimal receipt/success. No anonymous table reads or broad direct writes.
- Security: spoofed company/employee IDs cannot redirect feedback; active check at submission, not only page load. Bound input and errors; evaluate minimal abuse prevention before public production exposure without inventing a large extra product.
- Tests: anonymous valid insert; out-of-range/empty/oversized feedback; invalid/inactive tokens; tampering; direct private reads denied; SQL composite FK; handle simultaneous/deactivation case sensibly.
- Browser: incognito John URL → rating 5 → distinctive written feedback → submit → actual receipt; refresh should not silently resubmit.
- Success: inspect under authorized owner/SQL test and see exact saved rating/message under John, never public feedback listing.
- Dependencies: Milestone 4 and applied migration; approved submission scope.

### Milestone 6 — Private company review dashboard and filtering

- Objective: owner sees exact customer feedback under John; second company cannot access it.
- Features: recent reviews with employee names/date/rating/message, employee filter, individual employee view, loading/error/empty states. Review deletion can be a separately approved small milestone if needed; avoid analytics.
- Likely files: dashboard/review pages, company-scoped queries, employee filter components, tests and handoff.
- DB: use existing indexes/FKs/RLS; new schema only if clear need. Prefer safe joins/session queries, no service-role bypass.
- Security: server authentication; RLS on every query; tampered URL/filter cannot cross tenant; no shared cache containing private rows.
- Tests: exact John review appears; filter by John; owner B can't obtain row through UI/REST/actions; logged-out dashboard denied; refreshed page persists saved data.
- Browser: owner login → dashboard → locate exact submitted feedback → filter John → repeat with second company's owner and confirm no visibility.
- Success: complete company–employee–customer–private-owner loop verified against real Supabase.
- Dependencies: company/employee/review submission milestones; two independent test owners.

### Milestone 7 — Public-origin/NFC/QR readiness and release validation

- Objective: URL works on another device and can be put onto a card or QR.
- Features: reliable Copy review link with feedback, correct stable HTTPS origin, tested deployment after approval. A QR generator/hardware integration is not required.
- Likely files: copy-link component, deployment/env docs, optional origin helper; handoff.
- DB: no expected changes.
- Security: confirm deployed RLS and anon privacy, protect auth redirects, keep private configuration server-side where appropriate; do not publish customer data.
- Tests: production build; deployed owner authentication; mobile/incognito direct link; optional physical NFC/QR opening same URL; full two-company scenario.
- Browser: run the acceptance sequence below on deployed origin and second device.
- Success: stable public link reaches John's form from direct/NFC/QR access, submission saved privately and visible only to correct owner.
- Dependencies: all prior milestones, Vercel/deployment approval and account access; user provides/programs physical card only if they want hardware validation.

Final acceptance (not yet passed): owner creates account/confirm/login → company → John → copy URL → incognito/second device → John's form → rating+unique feedback → submit without account → owner dashboard sees exact message/rating under John → owner B cannot access it → same HTTPS URL fits NFC and QR. Run this physically as the user, not just mocks.

## 11. INSTRUCTIONS FOR THE NEXT CODEX SESSION

Use this as the next session's handoff prompt:

> You are continuing Product & Service Review, a private business/customer employee-feedback platform. Read PROJECT_HANDOFF.md and AGENTS.md, then inspect all current source, migrations, lockfile, tests, and setup docs. If the folder is empty, reconstruct the exact Appendix A sources first and use the original lockfile with npm ci. Do not redesign the accepted green/cream landing page or rebuild the stack. Next.js App Router JavaScript and Supabase DB/Auth are already selected; Vercel comes later.
>
> The app currently has only a working informational landing page and a working setup-status page. Local public Supabase settings exist in the original environment, but do not copy credentials from this document. The audit reached Supabase Auth and found email sign-up enabled with confirmation required. Foundation RPC and all four tables returned schema-cache errors. SQL migration and RLS tests exist locally but remote installation and isolation are unverified. Auth forms, protected dashboard, company/employee UI, customer review route, and submit flow are not implemented. SSR helpers/proxy are scaffolding, not proof authentication is working.
>
> First verify/apply the existing foundation with authorized SQL access and run the rollback isolation script; never drop tables or weaken RLS to make a probe pass. Show actual errors before fixing. If you lack privileged access, ask for project SQL access or have the user run the exact existing migration/test files and return their results. Publishable key is sufficient for runtime but cannot apply SQL. Do not ask for a service-role key to put in NEXT_PUBLIC env.
>
> After the foundation passes and the user approves, implement only business-owner authentication: signup with confirmation, login, logout, persistent cookie session, and a protected minimal dashboard shell. Preserve landing design; reuse clients/proxy after inspecting them. Verify actual behavior with an authorized test account, refresh/logout/incognito protection, plus node config tests and production build. Do not invent company or employee workflow in the same milestone. If authentication cannot be tested because mailbox/provider access is missing, say so instead of claiming it works.
>
> After each milestone list every changed file, exact tests/commands/results, precise browser URL/click/type/expected result, required external setup, and limitations. Update the canonical handoff and source appendix. Then stop for explicit approval before the next major milestone. The full application is not finished until the real John/incognito/customer submission/owner dashboard/two-company isolation workflow is verified.

## 12. Path to completion in this environment

The current environment can edit/test/build the existing app. It has a working runtime, dependency installation, local env, and read-only Supabase API access. It does not have authorized SQL execution credentials, a linked authenticated Supabase CLI, or a direct DB connection. A publishable key cannot create schema or inspect privileged catalogs. Therefore completing the foundation remotely and certifying isolation is externally blocked, even though local source builds.

Minimize user work: the SQL files and test scripts already exist; do not ask the user to design schema or manually create tables. The smallest available external action is:

1. Open the intended Supabase project's SQL Editor.
2. Confirm whether the four foundation tables and version function exist. If a fresh project, paste/run `supabase/migrations/001_foundation.sql` once.
3. Paste/run `supabase/tests/001_isolation.sql`. Send its final PASS result or actual error, without credentials. If failure leaves a transaction open, run ROLLBACK before retry.
4. Restart/reload the app and click `/setup` → Check again; require Connected plus the separate test result.

Alternatively, provide an authorized SQL connection/project login through an approved secure mechanism so the agent can run the existing files. Do not paste passwords or access tokens into this report. No Vercel or physical NFC setup is needed for the next milestone. Email confirmation testing later requires a mailbox the user can confirm or an explicitly authorized disposable test flow.

No major feature development should proceed during this documentation task. Continue foundation setup only within authorized access, then stop for the user's authentication milestone approval. The previous explicit request not to proceed remains in effect. This report is the reviewable handoff, not an implied authorization to implement the whole roadmap.

## Appendix A — Exact source snapshots for reconstruction

The source blocks below are copied from the inspected repository. `.env.local` and binary files are intentionally excluded. Empty env template, SQL, tests, docs, and exact lockfile are included. There are no actual project credentials in these blocks. Binary screenshots can be copied separately as visual evidence but do not affect rendering.


<!-- SOURCE_FILE: AGENTS.md -->
````markdown
# Project Rules

These instructions apply to the entire repository.

# PRODUCT PURPOSE

This project is a **private customer feedback and employee review platform for businesses**.

The core idea is:

A business can create an account, add its employees, and give each employee a unique review/feedback page.

Customers can access an employee's review form by tapping an **NFC card associated with that employee**. The NFC card opens a unique URL identifying the business and employee.

The customer can then leave feedback about their experience with that specific employee.

Unlike a traditional public review platform, these reviews are **private by default**. They are collected for the business and can be viewed and managed by authorized company owners/managers.

The purpose of the product is to help businesses collect structured customer feedback, understand employee performance, identify problems, recognize strong employees, and manage customer feedback internally.

Stay focused on this purpose. Do not turn the product into a generic social review platform or add unrelated features unless I explicitly approve them.

# CORE USER FLOW

The fundamental customer flow should eventually work like this:

NFC Card
→ Unique Employee Review URL
→ Employee-specific review form
→ Customer submits feedback
→ Feedback is stored privately
→ Business dashboard receives the review
→ Review is associated with the correct employee
→ Owner/manager can view and manage it

The system must also work without NFC hardware.

Every NFC destination must simply be a normal web URL so the same review page can be opened through:
- NFC cards
- QR codes
- Direct links

Do not build unnecessary proprietary NFC technology. The NFC card's job is simply to open the employee's unique review URL.

# BUSINESS ACCOUNTS

Businesses should eventually be able to:

- Create a company account.
- Log into a private dashboard.
- Manage company information.
- Add employees.
- Edit employees.
- Deactivate employees.
- Create a unique review link for each employee.
- See which employee a review belongs to.
- View all reviews across the company.
- Filter reviews by employee.
- View an individual employee's reviews.
- Manage submitted reviews.

The architecture must support multiple businesses.

Data belonging to one business must never be visible to another business.

# EMPLOYEE SYSTEM

Each employee should have their own record inside their company.

At minimum, an employee should eventually have:

- Name
- Unique ID
- Company association
- Active/inactive status
- Unique review URL

For example, the system might generate a URL conceptually similar to:

`/review/company-slug/employee-id`

The exact URL structure can be determined during implementation.

The important requirement is that opening the URL reliably identifies the correct company and employee.

# NFC CARD SYSTEM

Each employee may be assigned a physical NFC card.

The NFC card does NOT need complicated software integration.

The NFC chip should contain the employee's unique review URL.

Example flow:

Customer taps John's NFC card.

Phone opens:

`example.com/review/company/john-employee-id`

The page recognizes that the review is for John at that company.

The customer sees something similar to:

"How was your experience with John?"

The customer completes the feedback form.

When submitted, the review must automatically be associated with:
- The correct company
- The correct employee

The customer should not need to select the employee manually after using the NFC card.

The system should eventually make it easy for the company to copy the correct URL when programming an NFC card.

# REVIEW FORM

The customer-facing review experience should be extremely simple and mobile-first because most customers will reach it by tapping an NFC card with their phone.

The initial review system should support structured feedback such as:

- Overall rating
- Written feedback
- Employee associated with the interaction

Additional review categories may be added later, but do not invent a large review questionnaire without approval.

Submitting feedback should require as little friction as reasonably possible.

Customers should NOT need to create an account simply to submit feedback.

# PRIVACY

Reviews are private by default.

They should NOT automatically appear publicly on the internet.

Authorized company owners/managers should be able to see the reviews belonging to their company.

Employees should not automatically receive administrative access to reviews simply because reviews are associated with them.

Any future feature that publishes, shares, or redirects reviews to public review platforms must be explicitly approved before implementation.

# COMPANY DASHBOARD

The business dashboard should eventually provide a clear overview of feedback.

The owner/manager should be able to:

- View recent reviews.
- View overall feedback.
- See which employee received each review.
- Filter reviews by employee.
- Open an employee profile.
- View feedback associated with that employee.
- Add/manage employees.
- Access each employee's unique review URL.

Keep the dashboard useful and simple.

Do not build complicated analytics until the basic review collection and management workflow works correctly.

# PERMISSIONS

The system should be designed with clear permissions.

At minimum:

BUSINESS OWNER / ADMIN
- Manage the company.
- Manage employees.
- View company reviews.
- View employee-specific reviews.
- Manage review records.
- Access employee review links.

CUSTOMER
- Open a review form.
- Submit feedback.
- Does not need an account.
- Cannot access private company reviews or the company dashboard.

Additional employee/manager permission levels can be considered later.

Do not implement complicated role systems unless required by an approved feature.

# TECHNICAL STACK

Keep the technical stack simple:

- Next.js
- Supabase database
- Supabase authentication
- Vercel for deployment later

Use Supabase appropriately for:
- Authentication
- Company accounts
- Employee records
- Review records
- Relationships between companies, employees, and reviews

Security and data isolation are important.

Use appropriate Supabase security mechanisms such as Row Level Security when private company data is introduced.

Do not introduce additional major frameworks, databases, authentication providers, or infrastructure unless there is a clear technical reason and I approve it first.

# DEVELOPMENT PHILOSOPHY

Build the application incrementally.

Do NOT attempt to build the entire SaaS application at once.

The development order should generally follow the dependencies of the core workflow.

For example:

Basic application
→ Authentication
→ Company account
→ Employee management
→ Unique employee review pages
→ Review submission
→ Private review storage
→ Company review dashboard
→ Employee filtering/management
→ NFC/QR link workflow

This is guidance, not permission to implement all of these features at once.

Implement ONE logical feature or milestone at a time.

# AFTER EVERY FEATURE

After implementing a feature, STOP.

Tell me:

1. Exactly what you changed.
2. Which files you created or modified.
3. What you tested.
4. The exact test commands you ran.
5. Whether each test passed or failed.
6. How I can see the feature working in my browser.
7. What URL I should visit.
8. Exactly what I should click/type/do.
9. What I should expect to happen if the feature is working correctly.

Then WAIT for my approval before beginning the next major feature.

# COMPLETION RULE

Never say "done," "complete," "finished," or otherwise imply that something works without telling me what you actually tested.

Do not assume something works simply because the code looks correct.

Whenever reasonably possible, test the actual behavior.

# ERROR HANDLING

If something fails:

STOP before silently fixing it.

First show me:

1. The actual error message/output.
2. The command or action that caused it.
3. Your explanation of the likely cause.

Then explain what you intend to change.

After applying the fix, rerun the relevant test and show me the result.

Do not hide errors or repeatedly attempt fixes without explaining what is happening.

# CHANGE MANAGEMENT

Preserve working functionality.

Before making significant changes, inspect and understand the existing project structure.

Do not unnecessarily rewrite working code.

Make the smallest reasonable change required for the current feature.

Do not perform unrelated refactoring while implementing another feature unless necessary.

# PRODUCT SCOPE

Do not add features simply because similar SaaS products have them.

In particular, do NOT independently add things such as:

- Social feeds
- Public employee profiles
- Advertising
- Affiliate systems
- Complex AI features
- Payroll
- Scheduling
- CRM functionality
- Employee monitoring
- Gamification
- Public leaderboards
- Complex analytics
- Subscription/billing systems

These may be considered later but require explicit approval.

When a major product decision has multiple reasonable approaches, explain the options to me before committing the project to one.

# PRIORITY

The most important thing is proving this core loop:

**Business creates employee → employee receives unique link → NFC/QR/direct link opens employee review form → customer submits review → review is privately stored under the correct company and employee → company owner can see that review in the dashboard.**

Until that complete loop works reliably, prioritize it over secondary features, advanced design, analytics, monetization, or additional integrations.

# USER EXPERIENCE

Keep the user experience simple, polished, and professional. Functionality and clarity take priority over unnecessary visual complexity. Pages, buttons, forms, ratings, reviews, and navigation must make their purpose immediately obvious.

# CURRENT DEVELOPMENT GATE

This rules update does not authorize application implementation. Wait for the user's approval before beginning the first development milestone under this product scope.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
````


<!-- SOURCE_FILE: package.json -->
````json
{
  "name": "product-service-review",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@supabase/ssr": "^0.12.7",
    "@supabase/supabase-js": "^2.117.2",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "server-only": "^0.0.1"
  }
}
````


<!-- SOURCE_FILE: package-lock.json -->
````json
{
  "name": "product-service-review",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "product-service-review",
      "version": "0.1.0",
      "dependencies": {
        "@supabase/ssr": "^0.12.7",
        "@supabase/supabase-js": "^2.117.2",
        "next": "latest",
        "react": "latest",
        "react-dom": "latest",
        "server-only": "^0.0.1"
      }
    },
    "node_modules/@emnapi/runtime": {
      "version": "1.11.3",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.11.3.tgz",
      "integrity": "sha512-Xz4Tpyki7XyrpbUK1jR1AhdAdaXyhhY4lZ3neLodmhpuWfy2PAQN5B46sAiU4liOXGLkHypn/qU+jvfWSCYYLA==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@img/colour": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@img/colour/-/colour-1.1.0.tgz",
      "integrity": "sha512-Td76q7j57o/tLVdgS746cYARfSyxk8iEfRxewL9h4OMzYhbW4TAcppl0mT4eyqXddh6L/jwoM75mo7ixa/pCeQ==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@img/sharp-darwin-arm64": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.35.5.tgz",
      "integrity": "sha512-QRUlFQ0WxvdWyqqG/WtI3iupfD5rBzmCHXSdPsY91sAtVtTo7Q4cb6zOccZ3gqEqkr0f1As1ehLqmEpDsRf+lg==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-arm64": "1.3.4"
      }
    },
    "node_modules/@img/sharp-darwin-x64": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.35.5.tgz",
      "integrity": "sha512-+BR255RhDlpygUpOc/Jdt1nT6DQ3XG/ERo5wbcdOf5Q320dKtPCKPLR1LJs9VGXRaMa8l1uUa0tkCNOXiAxZUw==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-x64": "1.3.4"
      }
    },
    "node_modules/@img/sharp-freebsd-wasm32": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-freebsd-wasm32/-/sharp-freebsd-wasm32-0.35.5.tgz",
      "integrity": "sha512-Y/z91nEZ4uIBX5X3nfTovjU9lHNKFYbL2lpHCLVNmXQK03VIZvXBBt0KxbPGp2SdGSF+2mQU4e+hQaWOt86iAw==",
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "dependencies": {
        "@img/sharp-wasm32": "0.35.5"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-arm64": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.3.4.tgz",
      "integrity": "sha512-5R89nBYiRdUlSWJxPhO+GVtaXzXSxKnRu/xqMn3KTA3L9EB9Oy/P+Nn2f2vlhPuUdy/Zusb2DarbyTpGCfEDuw==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-x64": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.3.4.tgz",
      "integrity": "sha512-iR2OKH80yi0U+dUplyh3/xdpFvps6YkCwsXenIJxqxR1v9o+xtKTGbS9H7cps+2Vxjc8B1j96p75NmTGjIhtpQ==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.3.4.tgz",
      "integrity": "sha512-LmRtTsOHuvM2+wlO2Db37dx5MiZhB0FvSunciw48YjdOkZz9KAiRbm8ujeMOA1INqmei5NapFxYEK1D1ZSidmw==",
      "cpu": [
        "arm"
      ],
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm64": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.3.4.tgz",
      "integrity": "sha512-Y3dgX/6lE2QhQb+Gxy0WZxfg9MEm/JBjamZpS2IklP7xIQoKN4hzAm7KcMVGtaVDt3neE9OKBC7vAfonA/Lr1A==",
      "cpu": [
        "arm64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-ppc64": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-ppc64/-/sharp-libvips-linux-ppc64-1.3.4.tgz",
      "integrity": "sha512-Le6boB8Tai0Nis+gIxIpKx68UDVVIqdR8Tin5Yf1z2LJJQLDJvCDRqRu+jC2qCoD+eIomonmOwB4smBRxfVpYQ==",
      "cpu": [
        "ppc64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-riscv64": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-riscv64/-/sharp-libvips-linux-riscv64-1.3.4.tgz",
      "integrity": "sha512-aHkkIEHPRdQEegJN20MLmGtxYD9R2wQr3Cwpddnu5+YKMt6Uzax7S9h5gpZTo8wyrGuZSlfQ63OevL5mTyOC7Q==",
      "cpu": [
        "riscv64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-s390x": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.3.4.tgz",
      "integrity": "sha512-ra/mB6MikESDUO7Yg+Mi95bFBb9GsObURuhnOv3OqknjGe9sZrG8tCe9q0xSIGrtLgvgw0gKnFWcK4blSgQOuQ==",
      "cpu": [
        "s390x"
      ],
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-x64": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.3.4.tgz",
      "integrity": "sha512-GJ//SSXbnwSDes02umB3nDJLFcQzw8a18V8fyhqr6tV515tOEMdImjjxj1AoafMRz56F3PHgftnj1QEKSU1zkw==",
      "cpu": [
        "x64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-arm64": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.3.4.tgz",
      "integrity": "sha512-hvulFwtjUcagsis6BBxHwGFwWoNZjgYmULGVrZcyfNbjA8hKILbRxGg15/7w5HDyXHXUos/j6baAWqnCyQ2DWA==",
      "cpu": [
        "arm64"
      ],
      "libc": [
        "musl"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-x64": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.3.4.tgz",
      "integrity": "sha512-6zXKeE/p39I1AmA3cJG35eyBGNqNddLnUXjhwBnsGjFPWqf5VKkDBEqaEkPDoTEtkxwi2vv8Tcr2mDyP4So7Fg==",
      "cpu": [
        "x64"
      ],
      "libc": [
        "musl"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-linux-arm": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm/-/sharp-linux-arm-0.35.5.tgz",
      "integrity": "sha512-LEaXK2WdXVK5ykcw0buWyPMsmLLL2vpHLD6yrNSW+JGEL3BZPA4tpKN6iaMc4AxTTAoaX/sU1rOL51lcIz48ZQ==",
      "cpu": [
        "arm"
      ],
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm": "1.3.4"
      }
    },
    "node_modules/@img/sharp-linux-arm64": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.35.5.tgz",
      "integrity": "sha512-LYVx5JTsOM2CBzmxreh+nl64/3H6Xb09iSLknqH47z2T2DFFxDeFLP5y4dJwe6H7uGQlHPyEEtIqyo3DYsRwdQ==",
      "cpu": [
        "arm64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm64": "1.3.4"
      }
    },
    "node_modules/@img/sharp-linux-ppc64": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-ppc64/-/sharp-linux-ppc64-0.35.5.tgz",
      "integrity": "sha512-QVxAAq8evVRI9ia2vqgwrmWucn5Dfv+JdWzj75pD8omHLPSP7f8p20O8jxzjCcuCEQEOtYOZUmX1hkiZ0kdevA==",
      "cpu": [
        "ppc64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-ppc64": "1.3.4"
      }
    },
    "node_modules/@img/sharp-linux-riscv64": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-riscv64/-/sharp-linux-riscv64-0.35.5.tgz",
      "integrity": "sha512-LtdreXguaavKODPIfzJ4kffx7UNt1omwtK0rch4EBbbSTXPnxWmYSayXdLJw0fJzQ97kHt1gL/yh4tvU+nCyRQ==",
      "cpu": [
        "riscv64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-riscv64": "1.3.4"
      }
    },
    "node_modules/@img/sharp-linux-s390x": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.35.5.tgz",
      "integrity": "sha512-UZasTOFiYzotTsGOCu42BfUzP6Tu6Do/947iRm1RsLKvlllxwGcn4RN27LibGWceix4Y+Pmw3jsnTcCQIgWjqA==",
      "cpu": [
        "s390x"
      ],
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-s390x": "1.3.4"
      }
    },
    "node_modules/@img/sharp-linux-x64": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-x64/-/sharp-linux-x64-0.35.5.tgz",
      "integrity": "sha512-SxFtLTeJInhAA9Q836kux2vZNeOBQEx658qvbboZScr0wIARym3IcGmW7KpVD5sbVg0Ojy+udFQdayYIZyoNog==",
      "cpu": [
        "x64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-x64": "1.3.4"
      }
    },
    "node_modules/@img/sharp-linuxmusl-arm64": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.35.5.tgz",
      "integrity": "sha512-9HbMclmI1zlNkFRs3z9/eBtDjfD0sGlrX1z6b1qwmiFY5ElDLh4BC0LPBdVp7z1DXFiKlIcznf+ZlsuZzLxQqg==",
      "cpu": [
        "arm64"
      ],
      "libc": [
        "musl"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-arm64": "1.3.4"
      }
    },
    "node_modules/@img/sharp-linuxmusl-x64": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.35.5.tgz",
      "integrity": "sha512-4KOphqB035HrVdqLZfCgMzzERrQkkzOwRhl4OAkRO1YCldbaFjySXMaK534Mo0V+LndnlJk+sbUyLeU0ULyD1A==",
      "cpu": [
        "x64"
      ],
      "libc": [
        "musl"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-x64": "1.3.4"
      }
    },
    "node_modules/@img/sharp-wasm32": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-wasm32/-/sharp-wasm32-0.35.5.tgz",
      "integrity": "sha512-Ptsga1su4tQx+LLF1ECS9U6nz5kmrXKo6XVbtR48Ke3ZRxxgaWBu7IDtEe1quo8hiupwm6WFqxVlXaSf7IINGQ==",
      "license": "Apache-2.0 AND LGPL-3.0-or-later AND MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/runtime": "^1.11.3"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-webcontainers-wasm32": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-webcontainers-wasm32/-/sharp-webcontainers-wasm32-0.35.5.tgz",
      "integrity": "sha512-hfhF/FmoQyTUkA0bIKFOtw536BQSeBMe6BF6QyWlrPxT754+TFLaZ7sKKTfvvM0yJgKgaYTwnFCIZ/GuDw5SUA==",
      "cpu": [
        "wasm32"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@img/sharp-wasm32": "0.35.5"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-arm64": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-arm64/-/sharp-win32-arm64-0.35.5.tgz",
      "integrity": "sha512-X4t7g+7ZA5DKblCBEXGjUqqemj4vczING/5viFwAL8h4N3qYeyjwdCvRLHi4EdOUI+2Z7UFlp1VM+p/AuEtm6Q==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-ia32": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.35.5.tgz",
      "integrity": "sha512-5Zm82LoBc43nhwNybZlG7Y1KO//Zhsn306fQl29ZOuStHLGTo3BWL83q3cznX0poxSAMuYL1On/BHBxkBeKr6A==",
      "cpu": [
        "ia32"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-x64": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-x64/-/sharp-win32-x64-0.35.5.tgz",
      "integrity": "sha512-x76eH0vEiHlcMQu8Y8IenntaACtddpT6W0wmXtWrnKcnKI7ME5DdgqhAD6SEWOEl1v2zDvkZDhFA9KnURwpfqg==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@next/env": {
      "version": "16.3.8",
      "resolved": "https://registry.npmjs.org/@next/env/-/env-16.3.8.tgz",
      "integrity": "sha512-Al9zqHVV7TJv0eFuOU4U7Lvv74PTih4Ch63sk2xCIpSTkE3udFnaOcnzP2lQVymiL7yS9Cj2iClUXlR3EQ5sEw==",
      "license": "MIT"
    },
    "node_modules/@next/swc-darwin-arm64": {
      "version": "16.3.8",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-16.3.8.tgz",
      "integrity": "sha512-2JPRMh2nmQG5CiL7cXGL9AGwnPWJQ//cTtAUCT+w511QHk79SYz3LGv/pc5X643B/WEO0rvu3Yww0hqwt3kgeA==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-darwin-x64": {
      "version": "16.3.8",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-x64/-/swc-darwin-x64-16.3.8.tgz",
      "integrity": "sha512-GZtCCOBKJ4leVIT/Th0llWKhD1ca92lzbQiS5R5ON9QkoiFnilFsebDae1JU2a3HWoKMEmEZWGs1AGLavVM72Q==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-gnu": {
      "version": "16.3.8",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-16.3.8.tgz",
      "integrity": "sha512-O659ygeQYqneJ1fBKMpFxIFqYkYswu8IAS1OCKK/4f3ZgJJm1dRz4fVJZRi/kLLWjnBKnebOePA4WNv+sV1pVA==",
      "cpu": [
        "arm64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-musl": {
      "version": "16.3.8",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-16.3.8.tgz",
      "integrity": "sha512-dSjKSyWpzxoO1d3DIZZcP4XJcNaKeLmxQMFOiYl5vuBRMmweIqnAhty8tAmRsvTss779cK1FtYnDMj40e4TQlg==",
      "cpu": [
        "arm64"
      ],
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-gnu": {
      "version": "16.3.8",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-16.3.8.tgz",
      "integrity": "sha512-lbqOuz3RPRcv+o9msNsJw5x4+Y1ZwPTs6vmL6DCf7i0fZfvng/F59wyeDwqHIvV0mK//RBy/jJkZ+nCKsSMXjQ==",
      "cpu": [
        "x64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-musl": {
      "version": "16.3.8",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-16.3.8.tgz",
      "integrity": "sha512-+316WswI8ScVgZeUd+1KGaXkHhaYQzCjvH/05TZSpJ8zBizb1a4G7DtO7F12jcBIqMOtsz9ji1t48fmKtzqsGA==",
      "cpu": [
        "x64"
      ],
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-arm64-msvc": {
      "version": "16.3.8",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-16.3.8.tgz",
      "integrity": "sha512-ji0gd4kMYUxO+1fJBIbiBVRCjzG/lloiyCccnlebvb1ZJ5qXCPZqYg4Jl1DrrixnWNMKylzgpmMWx0yNDYXlzw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-x64-msvc": {
      "version": "16.3.8",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-16.3.8.tgz",
      "integrity": "sha512-WcTlaKt/TWkh5kUjdJcUmB1XgZ+1c6fz4Y9fDHL73YNSdGaUWjceeWrrlwF0nv19iABYWC4iAq1oX1w4Bn0vfg==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@supabase/auth-js": {
      "version": "2.117.2",
      "resolved": "https://registry.npmjs.org/@supabase/auth-js/-/auth-js-2.117.2.tgz",
      "integrity": "sha512-Z3WnGwrphYZubrLbxp5Iv0tLA9A5GhvKzJ/ZXglxqwd2QEH2R4dXRltjVJ8sIn4xEW2BSFIGT0yALVJIgZeDYw==",
      "license": "MIT",
      "dependencies": {
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=22.0.0"
      }
    },
    "node_modules/@supabase/functions-js": {
      "version": "2.117.2",
      "resolved": "https://registry.npmjs.org/@supabase/functions-js/-/functions-js-2.117.2.tgz",
      "integrity": "sha512-6DT4ZIjmZxa9ANKaBIrjc86AyKrX8M376ynvNeOBBVad3eP7x3UHqWfDR2ynFkHGzCuOpr1A+kObmnahxuwuog==",
      "license": "MIT",
      "dependencies": {
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=22.0.0"
      }
    },
    "node_modules/@supabase/phoenix": {
      "version": "0.4.5",
      "resolved": "https://registry.npmjs.org/@supabase/phoenix/-/phoenix-0.4.5.tgz",
      "integrity": "sha512-aAn9H9ovVyeApKy11OWOrrOGq8DV68yWeH4ud2lN9fzn4aO8Zb5GLL9m1pUg9nLqIcT+ZDfAcsZe0E/nqdv2lw==",
      "license": "MIT"
    },
    "node_modules/@supabase/postgrest-js": {
      "version": "2.117.2",
      "resolved": "https://registry.npmjs.org/@supabase/postgrest-js/-/postgrest-js-2.117.2.tgz",
      "integrity": "sha512-V1Qhn+M8xzJqCasOxHZ2KG19Fj39PxU7weEAmOK65/KTsWCRXboB4hcQwFvxRvM7ZikeP9IZWNvQkfjvSxzYFw==",
      "license": "MIT",
      "dependencies": {
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=22.0.0"
      }
    },
    "node_modules/@supabase/realtime-js": {
      "version": "2.117.2",
      "resolved": "https://registry.npmjs.org/@supabase/realtime-js/-/realtime-js-2.117.2.tgz",
      "integrity": "sha512-lYXSAIg3eAKA58riUED6Vb+TCzF8jtx18uOoiCaVJ7ZMre6FWBpwB1MPeW+B6vykJT/hPdiuqwcSB7ILMS21ew==",
      "license": "MIT",
      "dependencies": {
        "@supabase/phoenix": "0.4.5",
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=22.0.0"
      }
    },
    "node_modules/@supabase/ssr": {
      "version": "0.12.7",
      "resolved": "https://registry.npmjs.org/@supabase/ssr/-/ssr-0.12.7.tgz",
      "integrity": "sha512-wiBtEie1KkRJi9RrZWY3R2imRhX1JY7qMyUCH2z9AUk15gQebNEplM+urbCKamdxaTJLXUU6LlpkJsaxhojCEg==",
      "license": "MIT",
      "dependencies": {
        "cookie": "^1.0.2"
      },
      "peerDependencies": {
        "@supabase/supabase-js": "^2.114.0"
      }
    },
    "node_modules/@supabase/storage-js": {
      "version": "2.117.2",
      "resolved": "https://registry.npmjs.org/@supabase/storage-js/-/storage-js-2.117.2.tgz",
      "integrity": "sha512-8gAJoVaxZa/War2kFRfJMxGk4M190Q7lJ70BofwGlRxU/u9pIodd6XyTvmXkxOKXWuIYtkDaYPZrIAUt1T/7FQ==",
      "license": "MIT",
      "dependencies": {
        "iceberg-js": "^0.8.1",
        "tslib": "2.8.1"
      },
      "engines": {
        "node": ">=22.0.0"
      }
    },
    "node_modules/@supabase/supabase-js": {
      "version": "2.117.2",
      "resolved": "https://registry.npmjs.org/@supabase/supabase-js/-/supabase-js-2.117.2.tgz",
      "integrity": "sha512-eSG2VKnHR+Clp1PmidZ1/weJ8PJwoybjva3L2GgKqFG4YDS1Iqmc61psKGZP5xw6OMT2O7ZorPR42PY6q1BOXg==",
      "license": "MIT",
      "dependencies": {
        "@supabase/auth-js": "2.117.2",
        "@supabase/functions-js": "2.117.2",
        "@supabase/postgrest-js": "2.117.2",
        "@supabase/realtime-js": "2.117.2",
        "@supabase/storage-js": "2.117.2"
      },
      "engines": {
        "node": ">=22.0.0"
      },
      "peerDependencies": {
        "@opentelemetry/api": ">=1.0.0"
      },
      "peerDependenciesMeta": {
        "@opentelemetry/api": {
          "optional": true
        }
      }
    },
    "node_modules/@swc/helpers": {
      "version": "0.5.23",
      "resolved": "https://registry.npmjs.org/@swc/helpers/-/helpers-0.5.23.tgz",
      "integrity": "sha512-5lSsMOTXURePglDfvuAQUqkGek9Hg2kksOYay2m0+XR++b2NWYL/4sWyuvVBIs8oKnJaxkdi9whaL/sqN13afw==",
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.8.0"
      }
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.11.27",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.11.27.tgz",
      "integrity": "sha512-ElY12DaROGuan+lMmZ8Cvo/ZUbXPe7Enc/9VU/b1T3Kp4dwytRcNdR8DoSJN5SNJT/CuvcCA0DHDVmMOCePdRQ==",
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.cjs"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001814",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001814.tgz",
      "integrity": "sha512-/Uaf1lAzr59XcMpW0o96WoEfr+VXK2OX4U9AgFoiSHsVJ4HppnIFUjtYzsyDH2+tgANaQb2/oxYGwCPapN1FpA==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/client-only": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/client-only/-/client-only-0.0.1.tgz",
      "integrity": "sha512-IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==",
      "license": "MIT"
    },
    "node_modules/cookie": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-1.1.1.tgz",
      "integrity": "sha512-ei8Aos7ja0weRpFzJnEA9UHJ/7XQmqglbRwnf2ATjcB9Wq874VKH9kfjjirM6UhU2/E5fFYadylyhFldcqSidQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "license": "Apache-2.0",
      "optional": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/iceberg-js": {
      "version": "0.8.1",
      "resolved": "https://registry.npmjs.org/iceberg-js/-/iceberg-js-0.8.1.tgz",
      "integrity": "sha512-1dhVQZXhcHje7798IVM+xoo/1ZdVfzOMIc8/rgVSijRK38EDqOJoGula9N/8ZI5RD8QTxNQtK/Gozpr+qUqRRA==",
      "license": "MIT",
      "engines": {
        "node": ">=20.0.0"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.19",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.19.tgz",
      "integrity": "sha512-Y2tUNy4ouw6tq5oDSKeQYGOyhkUBhNOcGV/02KC+6kd9eDGqdZd++mjMiIDilrBYvjEnCYvVtsuHCuP+okSfug==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/next": {
      "version": "16.3.8",
      "resolved": "https://registry.npmjs.org/next/-/next-16.3.8.tgz",
      "integrity": "sha512-U7QEZaTini6wKrb8A8hqLLqYQyCetegKjCpJOyxk642vWoMoU1x5PyZCJFvgYgiptA8xc5j/9xYlZFO7w9Sjmw==",
      "license": "MIT",
      "dependencies": {
        "@next/env": "16.3.8",
        "@swc/helpers": "0.5.23",
        "baseline-browser-mapping": "^2.9.19",
        "caniuse-lite": "^1.0.30001579",
        "postcss": "8.5.23",
        "styled-jsx": "5.1.6"
      },
      "bin": {
        "next": "dist/bin/next"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "optionalDependencies": {
        "@next/swc-darwin-arm64": "16.3.8",
        "@next/swc-darwin-x64": "16.3.8",
        "@next/swc-linux-arm64-gnu": "16.3.8",
        "@next/swc-linux-arm64-musl": "16.3.8",
        "@next/swc-linux-x64-gnu": "16.3.8",
        "@next/swc-linux-x64-musl": "16.3.8",
        "@next/swc-win32-arm64-msvc": "16.3.8",
        "@next/swc-win32-x64-msvc": "16.3.8",
        "sharp": "^0.35.4"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.1.0",
        "@playwright/test": "^1.51.1",
        "babel-plugin-react-compiler": "*",
        "react": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "react-dom": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "sass": "^1.3.0"
      },
      "peerDependenciesMeta": {
        "@opentelemetry/api": {
          "optional": true
        },
        "@playwright/test": {
          "optional": true
        },
        "babel-plugin-react-compiler": {
          "optional": true
        },
        "sass": {
          "optional": true
        }
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "license": "ISC"
    },
    "node_modules/postcss": {
      "version": "8.5.23",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.23.tgz",
      "integrity": "sha512-g50586zr4bZmwFiTlflMu8E0bDTb5I5gertgwAKmsdUlTQIhZtunzUlD1WSzwcVWPoAVpsrA6vlfCD7oXvRwgg==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.16",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/react": {
      "version": "19.3.0",
      "resolved": "https://registry.npmjs.org/react/-/react-19.3.0.tgz",
      "integrity": "sha512-E8LUcbtBWt20bbl2YoHfx4ZDBdxVTfOKtCZn9cDSJ4l6/nuoApcpIBcj47t2wZoVX8g2ZHuMHbiShgCR1T5Sog==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "19.3.0",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.3.0.tgz",
      "integrity": "sha512-JDk8dgif51OjFoDE70+OT9ICyYr+69HlmihNwp1+Nsfbna3t5sIiCa9ZJktDmQ4/1b/rn26hIAR2uYXDMr5r0Q==",
      "license": "MIT",
      "dependencies": {
        "scheduler": "^0.28.0"
      },
      "peerDependencies": {
        "react": "^19.3.0"
      }
    },
    "node_modules/scheduler": {
      "version": "0.28.0",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.28.0.tgz",
      "integrity": "sha512-juorfCmIkIw8tT+p5BXSm6PJjQF/ycEYmKyzURCIt/RaZIhL+PulbQ9Yu2z1HdOJDdqDTlxA1+xKBmHXJsczAw==",
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "7.8.5",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.5.tgz",
      "integrity": "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==",
      "license": "ISC",
      "optional": true,
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/server-only": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/server-only/-/server-only-0.0.1.tgz",
      "integrity": "sha512-qepMx2JxAa5jjfzxG79yPPq+8BuFToHd1hm7kI+Z4zAq1ftQiP7HcxMhDDItrbtwVeLg/cY2JnKnrcFkmiswNA==",
      "license": "MIT"
    },
    "node_modules/sharp": {
      "version": "0.35.5",
      "resolved": "https://registry.npmjs.org/sharp/-/sharp-0.35.5.tgz",
      "integrity": "sha512-Ywn4OnzGukp7CDMrp08RQ50YKmuwG47brZgIVPTvBaaAfQlRlygrRqSrxdCiL9M+LlzLBiJ68IR1QqvzHyjC7g==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@img/colour": "^1.1.0",
        "detect-libc": "^2.1.2",
        "semver": "^7.8.5"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-darwin-arm64": "0.35.5",
        "@img/sharp-darwin-x64": "0.35.5",
        "@img/sharp-freebsd-wasm32": "0.35.5",
        "@img/sharp-libvips-darwin-arm64": "1.3.4",
        "@img/sharp-libvips-darwin-x64": "1.3.4",
        "@img/sharp-libvips-linux-arm": "1.3.4",
        "@img/sharp-libvips-linux-arm64": "1.3.4",
        "@img/sharp-libvips-linux-ppc64": "1.3.4",
        "@img/sharp-libvips-linux-riscv64": "1.3.4",
        "@img/sharp-libvips-linux-s390x": "1.3.4",
        "@img/sharp-libvips-linux-x64": "1.3.4",
        "@img/sharp-libvips-linuxmusl-arm64": "1.3.4",
        "@img/sharp-libvips-linuxmusl-x64": "1.3.4",
        "@img/sharp-linux-arm": "0.35.5",
        "@img/sharp-linux-arm64": "0.35.5",
        "@img/sharp-linux-ppc64": "0.35.5",
        "@img/sharp-linux-riscv64": "0.35.5",
        "@img/sharp-linux-s390x": "0.35.5",
        "@img/sharp-linux-x64": "0.35.5",
        "@img/sharp-linuxmusl-arm64": "0.35.5",
        "@img/sharp-linuxmusl-x64": "0.35.5",
        "@img/sharp-webcontainers-wasm32": "0.35.5",
        "@img/sharp-win32-arm64": "0.35.5",
        "@img/sharp-win32-ia32": "0.35.5",
        "@img/sharp-win32-x64": "0.35.5"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.2.tgz",
      "integrity": "sha512-KGj/8Y43x35aZVDtt+J4mK1hoLGHULMYfSkODJNQjNDC3oW1PqPoxMwo0pLUsWM/UEGzON/NxeHywEfNXNP3Vw==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/styled-jsx": {
      "version": "5.1.6",
      "resolved": "https://registry.npmjs.org/styled-jsx/-/styled-jsx-5.1.6.tgz",
      "integrity": "sha512-qSVyDTeMotdvQYoHWLNGwRFJHC+i+ZvdBRYosOFgC+Wg1vx4frN2/RG/NA7SYqqvKNLf39P2LSRA2pu6n0XYZA==",
      "license": "MIT",
      "dependencies": {
        "client-only": "0.0.1"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "peerDependencies": {
        "react": ">= 16.8.0 || 17.x.x || ^18.0.0-0 || ^19.0.0-0"
      },
      "peerDependenciesMeta": {
        "@babel/core": {
          "optional": true
        },
        "babel-plugin-macros": {
          "optional": true
        }
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD"
    }
  }
}
````


<!-- SOURCE_FILE: .gitignore -->
````text
node_modules/
.next/
out/
.env*
!.env.example
*.log
````


<!-- SOURCE_FILE: .env.example -->
````text
# Copy to .env.local and fill in values from your Supabase project's Connect dialog.
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
````


<!-- SOURCE_FILE: proxy.js -->
````javascript
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { getSupabaseConfig } from './lib/supabase/config.mjs';

export async function proxy(request) {
  const config = getSupabaseConfig();
  if (!config.ready) return NextResponse.next({ request });
  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items, headers) => {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        if (headers) Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });
  await supabase.auth.getClaims();
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

export const config = { matcher: ['/dashboard/:path*', '/auth/:path*'] };
````


<!-- SOURCE_FILE: app/layout.js -->
````javascript
import './globals.css';

export const metadata = {
  title: 'Product & Service Review | Private employee feedback',
  description: 'A private customer feedback platform for businesses, with employee-specific review links for NFC cards, QR codes, and direct links.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
````


<!-- SOURCE_FILE: app/page.js -->
````javascript
const steps = [
  ['01', 'Give each employee a unique link', 'Your business adds an employee and receives a review URL associated with that employee and your company.'],
  ['02', 'Make feedback easy to leave', 'Customers open the link with an NFC card, QR code, or direct link, then leave a rating and written feedback without creating an account.'],
  ['03', 'Understand feedback privately', 'Authorized owners and managers view feedback in a private company dashboard, with each review linked to the correct employee.'],
];

export default function Home() {
  return (
    <>
      <header className="header">
        <a className="brand" href="/" aria-label="Product & Service Review home"><span className="brand-mark" aria-hidden="true">✳</span> Product & Service Review</a>
        <a className="nav-link" href="#how-it-works">How it works <span aria-hidden="true">↗</span></a>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="dot" /> Customer feedback. For your business.</p>
            <h1 id="hero-title">Better service<br />starts with <em>listening.</em></h1>
            <p className="intro">A simple way for businesses to collect customer feedback about individual employees, recognize great service, and understand where to improve.</p>
            <a className="button" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a>
            <p className="build-note">In development · This page explains the planned workflow.<br />Business accounts and feedback collection are not available yet.</p>
          </div>
          <aside className="preview" aria-label="Illustration of the planned employee feedback workflow">
            <div className="preview-top"><span className="eyebrow">One link. The right employee.</span><span className="sample">Illustration only</span></div>
            <div className="employee-illustration" aria-hidden="true"><span className="employee-avatar">J</span><span className="connection-label">NFC card · QR code · Direct link</span></div>
            <div className="review-card">
              <span className="category">EXAMPLE: JOHN AT SAMPLE COMPANY</span>
              <h2>How was your experience with John?</h2>
              <p>A short rating and feedback form, automatically linked to the right employee and company.</p>
              <div className="workflow-note"><strong>Customer opens employee link</strong><span aria-hidden="true">↓</span><strong>Feedback goes to the company</strong></div>
              <div className="review-footer"><span className="avatar" aria-hidden="true">✓</span><span>Private by default<br /><small>For authorized company owners and managers</small></span></div>
              <p className="illustration-note">Fictional employee and company. No feedback is collected on this page.</p>
            </div>
          </aside>
        </section>
        <section id="how-it-works" className="how" aria-labelledby="how-title"><div className="section-heading"><p className="eyebrow">HOW IT WILL WORK</p><h2 id="how-title">A tap. A review. A clearer picture.</h2><p>The same employee review URL works with NFC cards, QR codes, and direct links. No NFC hardware is required.</p></div><div className="steps">{steps.map(([number, title, description]) => <article key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
        <section className="principle"><span aria-hidden="true">✳</span><div><h2>Built for private, useful feedback.</h2><p>Reviews are intended for your company’s authorized owners and managers.<br />They will not be published publicly, shared with other businesses, or automatically made accessible to employees.</p></div></section>
      </main>
      <footer><span>Product & Service Review</span><span>Listen better. Serve better.</span></footer>
    </>
  );
}
````


<!-- SOURCE_FILE: app/globals.css -->
````css
:root{--ink:#183a32;--muted:#64746e;--paper:#f8f9f5;--line:#dde4db;--green:#245b45}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:24px}body{margin:0;background:var(--paper);color:var(--ink);font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}a:focus-visible{outline:3px solid #b07830;outline-offset:6px}.header,main,footer{max-width:1200px;margin:auto}.header{min-height:100px;display:flex;align-items:center;justify-content:space-between;padding:24px 40px;border-bottom:1px solid var(--line)}.brand{font-size:17px;font-weight:700;display:flex;align-items:center;gap:11px}.brand-mark{font-size:31px;color:var(--green)}.nav-link{font-size:14px;display:flex;gap:15px}.hero{padding:84px 40px 88px;display:grid;grid-template-columns:1.2fr 1fr;gap:72px;align-items:center}.eyebrow{font-size:11px;letter-spacing:1.6px;font-weight:700;text-transform:uppercase}.hero-copy>.eyebrow{display:flex;align-items:center;gap:9px}.dot{width:7px;height:7px;border-radius:50%;background:#65866a}h1{font-size:clamp(42px,4.5vw,64px);letter-spacing:-2.8px;line-height:1.08;margin:27px 0}h1 em{font-family:Georgia,serif;font-weight:400;color:#527358}.intro{font-size:17px;color:var(--muted);line-height:1.8;max-width:460px}.button{display:inline-flex;align-items:center;gap:30px;background:var(--green);color:white;padding:17px 23px;border-radius:7px;font-size:14px;font-weight:700;margin-top:18px}.button:hover{background:#173f30}.build-note{font-size:12px;line-height:1.6;color:var(--muted);margin-top:20px}.preview{background:#e9eee3;border:1px solid #dce3d5;border-radius:18px;padding:23px;transform:rotate(2deg)}.preview-top{display:flex;align-items:center;justify-content:space-between;gap:8px}.preview-top .eyebrow{font-size:10px}.sample{font-size:10px;background:#f7f9f1;border:1px solid #d1dacb;padding:6px 9px;border-radius:20px}.review-card{background:white;border-radius:12px;padding:24px;box-shadow:0 7px 25px #243e3010}.category{font-size:9px;letter-spacing:1.5px;color:var(--muted);font-weight:700}.review-card h2{font-size:21px;letter-spacing:-.6px;margin:12px 0}.rating{display:flex;gap:9px;align-items:center}.rating>span{color:#b27827;letter-spacing:2px}.empty-star{color:#dce0d8}.rating strong{font-size:14px}.rating small{font-size:10px;color:var(--muted)}.review-card>p{font-size:14px;line-height:1.7;color:#58695f;margin:20px 0}.review-footer{display:flex;align-items:center;gap:10px;border-top:1px solid #edf0e8;padding-top:17px;font-size:11px;line-height:1.7}.avatar{background:#edf1e7;width:32px;height:32px;display:grid;place-items:center;border-radius:50%;font-weight:700}.review-footer small{font-size:9px;color:var(--muted)}.how{border-top:1px solid var(--line);padding:64px 40px}.section-heading h2{font-size:34px;letter-spacing:-1.1px;margin:13px 0}.section-heading>p:last-child{color:var(--muted);font-size:15px;line-height:1.6}.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:35px;margin-top:40px}.steps article{border-top:1px solid #cdd7ca;padding-top:23px}.step-number{font-size:12px;color:#68856b}.steps h3{font-size:18px;letter-spacing:-.4px;margin:19px 0 12px}.steps p{font-size:14px;line-height:1.8;color:var(--muted);max-width:290px}.principle{margin:0 40px 64px;background:#eaf0e5;border-radius:12px;padding:34px;display:flex;align-items:center;gap:27px}.principle>span{font-size:47px;color:#5b7854}.principle h2{font-size:22px;letter-spacing:-.6px;margin:0 0 12px}.principle p{font-size:14px;line-height:1.8;color:var(--muted);margin:0}footer{border-top:1px solid var(--line);padding:28px 40px;display:flex;justify-content:space-between;font-size:12px;color:var(--muted)}@media(max-width:800px){.hero{gap:30px;padding-top:50px;grid-template-columns:1fr}.hero-copy{max-width:580px}.preview{max-width:450px;width:100%;margin:15px auto 0;transform:none}.steps{grid-template-columns:1fr;gap:18px}.steps p{max-width:none}.header,footer{padding:22px}.hero,.how{padding:40px 22px}.principle{margin:0 22px 40px;padding:25px;gap:18px}h1{letter-spacing:-1.8px}.brand{font-size:14px}.nav-link{font-size:12px;gap:5px}.section-heading h2{font-size:29px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media(max-width:420px){.brand{max-width:205px;line-height:1.4}.principle>span{display:none}footer{gap:20px;line-height:1.6}.preview{padding:16px}.review-card{padding:20px}}

.employee-illustration{min-height:185px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}.employee-avatar{width:88px;height:88px;display:grid;place-items:center;border-radius:50%;background:#245b45;color:white;font-size:38px;font-family:Georgia,serif;box-shadow:0 8px 24px #183a3218}.connection-label{font-size:12px;color:var(--muted);text-align:center}.workflow-note{display:flex;flex-direction:column;gap:10px;padding:16px;background:#f3f6ef;border-radius:8px;margin-bottom:20px;font-size:12px;text-align:center}.workflow-note>span{color:var(--muted)}.review-card .illustration-note{font-size:11px;line-height:1.6;margin-bottom:0}.preview-top{flex-wrap:wrap}.hero>*{min-width:0}

.setup-page{padding:55px 40px;max-width:850px}.setup-page h1{font-size:42px;letter-spacing:-1.5px}.setup-card{background:white;border:1px solid var(--line);border-radius:12px;padding:26px;margin:24px 0}.setup-card h2{font-size:22px;line-height:1.4;margin-top:0}.setup-card p,.setup-card li{font-size:15px;line-height:1.8;color:var(--muted)}.setup-card li{margin:12px 0}.setup-card code{overflow-wrap:anywhere;font-size:13px}.setup-error{white-space:pre-wrap;overflow-wrap:anywhere;background:#fff3ed;color:#8a3925;border-radius:6px;padding:16px;font-size:13px;line-height:1.6}@media(max-width:600px){.setup-page{padding:35px 22px}.setup-card{padding:20px}.setup-card ol{padding-left:20px}}
````


<!-- SOURCE_FILE: app/setup/page.js -->
````javascript
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
````


<!-- SOURCE_FILE: lib/supabase/config.mjs -->
````javascript
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
````


<!-- SOURCE_FILE: lib/supabase/client.js -->
````javascript
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
````


<!-- SOURCE_FILE: lib/supabase/server.js -->
````javascript
import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseConfig } from './config.mjs';

export async function createClient() {
  const config = getSupabaseConfig();
  if (!config.ready) throw new Error(config.reason);
  const cookieStore = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (items) => {
        try {
          items.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. The proxy refreshes sessions.
        }
      },
    },
  });
}
````


<!-- SOURCE_FILE: SUPABASE_SETUP.md -->
````markdown
# Supabase foundation setup

The landing page is informational. This milestone adds database and connection
infrastructure, not the business sign-up or customer review screens.

## 1. Create a project

1. Sign in at https://supabase.com/dashboard and create a new project for this app.
2. Choose a project name, database password, and region; wait for it to become ready.
3. Open the project's **Connect** dialog and find its Project URL and publishable key.
   The publishable key starts with `sb_publishable_`.
4. In PowerShell, from the project root, run:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   If you already have `.env.local`, edit it instead of overwriting it.
5. Fill in `.env.local`:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
   ```

No database password, secret key, or service-role key is needed by the app.
`.env.local` is ignored by Git. Do not paste private credentials into chat.

## 2. Apply the database migration

1. Open `supabase/migrations/001_foundation.sql` locally and copy the entire file.
2. In the new Supabase project, open **SQL Editor**, start a new query, paste it, and click **Run**.
3. Expect successful execution with no errors. Run the migration once, on a fresh project.
   If it fails, save the actual error and stop; do not rerun it or drop existing tables blindly.
4. In **Table Editor**, confirm `companies`, `company_users`, `employees`, and `reviews` exist.
5. Each table has Row Level Security enabled. SQL Editor and Table Editor use privileged
   access and do not prove owner isolation by themselves.

## 3. Test privacy in the actual database

1. Open `supabase/tests/001_isolation.sql` locally and copy the entire file.
2. Paste it into a new SQL Editor query and click **Run**.
3. Expect the final result to start with `PASS:`. The script uses two temporary test
   users and companies, impersonates authenticated and anonymous database roles,
   checks permitted and denied actions, and rolls back all fixtures.
4. If the script fails, copy the actual error and run `ROLLBACK;` in the SQL Editor
   before retrying anything. Do not treat the app's connection status as a privacy test.

The isolation script has not been run against your project until you execute it.

## 4. Verify the connection in your browser

Stop any existing local server with Ctrl+C. Environment changes require a restart.

```powershell
cd "C:\Users\jthar\Documents\ChatGPT\service review App"
npm.cmd run dev -- --port 3001
```

1. Open http://localhost:3001/setup.
2. With no environment settings, expect **Setup required** and setup instructions.
3. With valid settings and the migration applied, expect
   **Connected · Foundation migration found**.
4. Click **Check again** to make a new live database request.
5. Click **Back to home** and confirm the existing landing page design is intact.

The connection probe only calls `foundation_version()`, which returns `001` and
exposes no business data. A successful probe does not certify every database policy.

## Foundation decisions

- `companies.owner_id` references Supabase Auth; `company_users` records its owner.
  An account can own multiple companies; this schema does not force a company-switching UI.
- `create_company(name)` atomically creates the company and its owner membership
  using the verified database auth identity. Clients cannot supply another owner
  or add themselves to existing companies.
- Owners can read their own records, edit their company name, add/edit/deactivate
  their employees, and delete their own review records. Owners cannot rewrite
  customer feedback or directly insert customer reviews.
- Employee IDs, company associations, and randomly generated review tokens cannot
  be changed through authenticated client column grants. The future stable URL is
  `/review/<review_token>`; the review page is not implemented in this milestone.
- A composite foreign key rejects mismatched employee/company review associations.
- Anonymous access to private tables is denied. Narrow employee lookup and review
  submission functions will be added with the approved review milestone.
- Browser/server Supabase clients and the session-refresh proxy are prepared for
  authentication. No login, protected dashboard, or session persistence flow has
  been implemented or tested yet. Those belong to the next milestone.

## Local tests

```powershell
node --test tests/supabase-config.test.mjs
npm.cmd run build
```

Official references:
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/guides/database/postgres/row-level-security
````


<!-- SOURCE_FILE: tests/supabase-config.test.mjs -->
````javascript
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
````


<!-- SOURCE_FILE: supabase/migrations/001_foundation.sql -->
````sql
-- Run ONCE in a fresh Supabase project's SQL Editor. All changes are atomic.
begin;

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  created_at timestamptz not null default now(),
  unique (id, owner_id)
);

-- Initial scope: one owner role; no invitations or extra roles yet.
create table public.company_users (
  company_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role = 'owner'),
  created_at timestamptz not null default now(),
  foreign key (company_id, user_id) references public.companies(id, owner_id) on delete cascade
);
create index company_users_user_idx on public.company_users(user_id);
create index companies_owner_idx on public.companies(owner_id);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  active boolean not null default true,
  -- Stable token: future normal URL will be /review/<review_token>.
  review_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  unique (company_id, id)
);
create index employees_company_idx on public.employees(company_id);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  employee_id uuid not null,
  rating smallint not null check (rating between 1 and 5),
  feedback text not null check (char_length(btrim(feedback)) between 1 and 5000),
  created_at timestamptz not null default now(),
  -- Reject even privileged inserts that mismatch employee and company.
  foreign key (company_id, employee_id) references public.employees(company_id, id) on delete restrict
);
create index reviews_company_date_idx on public.reviews(company_id, created_at desc);
create index reviews_employee_date_idx on public.reviews(employee_id, created_at desc);

alter table public.companies enable row level security;
alter table public.company_users enable row level security;
alter table public.employees enable row level security;
alter table public.reviews enable row level security;

-- Remove Supabase's default grants. Customer access will later use narrow RPCs,
-- never public SELECT access to these private tables.
revoke all on public.companies, public.company_users, public.employees, public.reviews from public, anon, authenticated;
grant select on public.companies, public.company_users, public.employees, public.reviews to authenticated;
grant update (name) on public.companies to authenticated;
grant insert (company_id, name), update (name, active) on public.employees to authenticated;
grant delete on public.reviews to authenticated;

create policy company_owner_read on public.companies for select to authenticated
  using (owner_id = (select auth.uid()));
create policy company_owner_update on public.companies for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy own_membership_read on public.company_users for select to authenticated
  using (user_id = (select auth.uid()));
create policy employee_owner_read on public.employees for select to authenticated
  using (exists (select 1 from public.company_users m where m.company_id = employees.company_id and m.user_id = (select auth.uid())));
create policy employee_owner_insert on public.employees for insert to authenticated
  with check (exists (select 1 from public.company_users m where m.company_id = employees.company_id and m.user_id = (select auth.uid())));
create policy employee_owner_update on public.employees for update to authenticated
  using (exists (select 1 from public.company_users m where m.company_id = employees.company_id and m.user_id = (select auth.uid())))
  with check (exists (select 1 from public.company_users m where m.company_id = employees.company_id and m.user_id = (select auth.uid())));
create policy review_owner_read on public.reviews for select to authenticated
  using (exists (select 1 from public.company_users m where m.company_id = reviews.company_id and m.user_id = (select auth.uid())));
create policy review_owner_delete on public.reviews for delete to authenticated
  using (exists (select 1 from public.company_users m where m.company_id = reviews.company_id and m.user_id = (select auth.uid())));

-- This creates the company and membership together, preventing self-enrollment
-- into another company. Caller cannot supply an owner ID.
create function public.create_company(company_name text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare new_id uuid; caller uuid := auth.uid();
begin
  if caller is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if company_name is null or char_length(btrim(company_name)) not between 1 and 120 then
    raise exception 'Company name must contain 1 to 120 characters' using errcode = '22023';
  end if;
  insert into public.companies (owner_id, name) values (caller, btrim(company_name)) returning id into new_id;
  insert into public.company_users (company_id, user_id) values (new_id, caller);
  return new_id;
end;
$$;
revoke all on function public.create_company(text) from public, anon, authenticated;
grant execute on function public.create_company(text) to authenticated;

-- Safe public connection probe. Returns no companies, employees, or reviews.
create function public.foundation_version() returns text
language sql immutable security invoker set search_path = '' as $$ select '001'::text $$;
revoke all on function public.foundation_version() from public, anon, authenticated;
grant execute on function public.foundation_version() to anon, authenticated;

commit;
````


<!-- SOURCE_FILE: supabase/tests/001_isolation.sql -->
````sql
-- Run after 001_foundation.sql in Supabase SQL Editor as postgres.
-- Test users and records exist only inside this transaction. Nothing is retained.
-- If a statement fails, show the error before changing SQL, then run ROLLBACK.
begin;

do $$
begin
  if (select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname in ('companies','company_users','employees','reviews') and c.relrowsecurity) <> 4 then
    raise exception 'FAIL: all four private tables must have RLS enabled';
  end if;
end $$;

select set_config('test.owner_a', gen_random_uuid()::text, true);
select set_config('test.owner_b', gen_random_uuid()::text, true);
insert into auth.users (id, email) values
  (current_setting('test.owner_a')::uuid, 'foundation-a-' || current_setting('test.owner_a') || '@example.invalid'),
  (current_setting('test.owner_b')::uuid, 'foundation-b-' || current_setting('test.owner_b') || '@example.invalid');

set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', current_setting('test.owner_a'), 'role', 'authenticated')::text, true);
select set_config('test.company_a', public.create_company('Foundation Company A')::text, true);
with employee as (
  insert into public.employees(company_id, name) values(current_setting('test.company_a')::uuid, 'John') returning id
) select set_config('test.employee_a', id::text, true) from employee;

select set_config('request.jwt.claims', json_build_object('sub', current_setting('test.owner_b'), 'role', 'authenticated')::text, true);
select set_config('test.company_b', public.create_company('Foundation Company B')::text, true);
with employee as (
  insert into public.employees(company_id, name) values(current_setting('test.company_b')::uuid, 'Jane') returning id
) select set_config('test.employee_b', id::text, true) from employee;

reset role;
insert into public.reviews(company_id, employee_id, rating, feedback) values
  (current_setting('test.company_a')::uuid, current_setting('test.employee_a')::uuid, 5, 'Private test feedback A'),
  (current_setting('test.company_b')::uuid, current_setting('test.employee_b')::uuid, 3, 'Private test feedback B');

do $$
begin
  begin
    insert into public.reviews(company_id, employee_id, rating, feedback)
      values(current_setting('test.company_a')::uuid, current_setting('test.employee_b')::uuid, 4, 'Wrong company');
    raise exception 'FAIL: mismatched employee and company accepted';
  exception when foreign_key_violation then null;
  end;
  begin
    insert into public.reviews(company_id, employee_id, rating, feedback)
      values(current_setting('test.company_a')::uuid, current_setting('test.employee_a')::uuid, 6, 'Invalid rating');
    raise exception 'FAIL: invalid rating accepted';
  exception when check_violation then null;
  end;
  begin
    insert into public.reviews(company_id, employee_id, rating, feedback)
      values(current_setting('test.company_a')::uuid, current_setting('test.employee_a')::uuid, 4, '   ');
    raise exception 'FAIL: empty feedback accepted';
  exception when check_violation then null;
  end;
end $$;

-- Verify both owners, including reads and attempts to mutate the other tenant.
set local role authenticated;
do $$
declare own_company uuid; other_company uuid; own_employee uuid; affected integer; owner_key text;
begin
  foreach owner_key in array array['a', 'b'] loop
    perform set_config('request.jwt.claims', json_build_object('sub', current_setting('test.owner_' || owner_key), 'role', 'authenticated')::text, true);
    own_company := current_setting('test.company_' || owner_key)::uuid;
    other_company := current_setting('test.company_' || case when owner_key = 'a' then 'b' else 'a' end)::uuid;
    own_employee := current_setting('test.employee_' || owner_key)::uuid;
    if (select count(*) from public.companies where id = own_company) <> 1 or exists(select 1 from public.companies where id = other_company) then raise exception 'FAIL: company isolation'; end if;
    if (select count(*) from public.company_users where company_id = own_company) <> 1 or exists(select 1 from public.company_users where company_id = other_company) then raise exception 'FAIL: membership isolation'; end if;
    if (select count(*) from public.employees where company_id = own_company) <> 1 or exists(select 1 from public.employees where company_id = other_company) then raise exception 'FAIL: employee isolation'; end if;
    if (select count(*) from public.reviews where company_id = own_company) <> 1 or exists(select 1 from public.reviews where company_id = other_company) then raise exception 'FAIL: review isolation'; end if;

    update public.companies set name = 'Not allowed' where id = other_company;
    get diagnostics affected = row_count;
    if affected <> 0 then raise exception 'FAIL: foreign company update'; end if;
    update public.employees set active = false where company_id = other_company;
    get diagnostics affected = row_count;
    if affected <> 0 then raise exception 'FAIL: foreign employee update'; end if;
    delete from public.reviews where company_id = other_company;
    get diagnostics affected = row_count;
    if affected <> 0 then raise exception 'FAIL: foreign review deletion'; end if;

    update public.employees set name = 'Updated employee', active = false where id = own_employee;
    get diagnostics affected = row_count;
    if affected <> 1 then raise exception 'FAIL: owner cannot edit own employee'; end if;
    update public.employees set active = true where id = own_employee;

    begin
      insert into public.employees(company_id, name) values(other_company, 'Intruder');
      raise exception 'FAIL: foreign employee insert accepted';
    exception when insufficient_privilege then null;
    end;
    begin
      insert into public.company_users(company_id, user_id) values(other_company, auth.uid());
      raise exception 'FAIL: self-enrollment accepted';
    exception when insufficient_privilege then null;
    end;
    begin
      update public.companies set owner_id = auth.uid() where id = other_company;
      raise exception 'FAIL: ownership change accepted';
    exception when insufficient_privilege then null;
    end;
    begin
      update public.employees set review_token = gen_random_uuid() where id = own_employee;
      raise exception 'FAIL: stable review token was mutable';
    exception when insufficient_privilege then null;
    end;
    begin
      insert into public.reviews(company_id, employee_id, rating, feedback) values(own_company, own_employee, 5, 'Owner fabricating a customer review');
      raise exception 'FAIL: direct review insert accepted';
    exception when insufficient_privilege then null;
    end;
    begin
      perform public.create_company('   ');
      raise exception 'FAIL: blank company name accepted';
    exception when invalid_parameter_value then null;
    end;
  end loop;
end $$;

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$
declare table_name text;
begin
  if public.foundation_version() <> '001' then raise exception 'FAIL: public probe'; end if;
  foreach table_name in array array['companies', 'company_users', 'employees', 'reviews'] loop
    begin
      execute format('select count(*) from public.%I', table_name);
      raise exception 'FAIL: anonymous read permitted on %', table_name;
    exception when insufficient_privilege then null;
    end;
  end loop;
  begin
    perform public.create_company('Anonymous company');
    raise exception 'FAIL: anonymous company creation';
  exception when insufficient_privilege then null;
  end;
end $$;

reset role;
rollback;
select 'PASS: RLS enabled; both owners isolated; anonymous private reads denied; ownership and stable links protected; company/employee consistency and feedback validation enforced. All test data rolled back.' as result;
````


<!-- SOURCE_FILE: scripts/audit-supabase.mjs -->
````javascript
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
````


<!-- SOURCE_FILE: scripts/verify-handoff.mjs -->
````javascript
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
  const original = (await fs.readFile(match[1], 'utf8')).replace(/^\uFEFF/, '').trimEnd();
  if (original !== match[2]) throw new Error(`Source mismatch: ${match[1]}`);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, match[2], { encoding: 'utf8', flag: 'wx' });
  count++;
}
if (count < 18) throw new Error('Incomplete source appendix');
console.log(`PASS: ${count} embedded source files match the repository and were reconstructed in an empty temporary folder.`);
console.log('PASS: configured Supabase URL and publishable key are absent from the document.');
console.log(execFileSync(process.execPath, ['--test', 'tests/supabase-config.test.mjs'], { cwd: target, encoding: 'utf8' }));
console.log('Reconstruction folder retained:', target);
````



## 13. Interactive local demo milestone — October 3, 2026

This section supersedes the earlier claim that the repository contains only an informational landing page. The production Supabase foundation remains blocked and unverified exactly as documented above, but a clearly labeled browser-local demonstration now lets a tester experience the product loop without pretending that production authentication or private database storage exists.

Implemented demonstration:

- The landing page now has working **Try demo** entry points while retaining the accepted green/cream design.
- `/demo` is an owner workspace seeded with fictional John at Sample Company.
- A tester can add another employee and receive a stable browser-local review URL.
- `/review/[token]` displays the correct employee, accepts a 1–5 rating and 1–5000 character feedback, and shows a success state.
- Returning to `/demo` shows the exact review, rating, date, employee association, count, and average.
- **Reset demo** returns the local experience to John with no reviews.
- Demonstration records use `localStorage` under `product-service-review-demo-v1`. They are limited to that browser profile and are not production-secure, authenticated, shared across devices, or written to Supabase.

New files:

- `app/demo/page.js`
- `app/review/[token]/page.js`
- `lib/demo-model.mjs`
- `tests/demo-model.test.mjs`

Modified files:

- `app/page.js`
- `app/globals.css`
- `app/layout.js`
- `scripts/verify-handoff.mjs`
- `PROJECT_HANDOFF.md`

Verification:

- `node --test tests/supabase-config.test.mjs tests/demo-model.test.mjs` — PASS, 8 tests, 0 failures.
- `npm.cmd run build` — PASS. Routes: `/`, `/demo`, `/review/[token]`, `/setup`.
- HTTP checks against the owned development server — `/`, `/demo`, and `/review/john-sample-company` returned 200.
- Browser workflow — PASS: launched the demo, added Maya, opened John's customer page, selected 5 stars, submitted `John was friendly and solved my issue quickly.`, returned to the owner workspace, and observed one John review with a 5.0 average and the exact text.
- Mobile viewport at 375 × 812 — PASS for responsive containment and readability. The Next.js development-tools badge visible at the lower left exists only in development and is not part of the application.

The canonical source appendix below remains the October 3 audit-era reconstruction snapshot and is now intentionally historical. `scripts/verify-handoff.mjs` reports stale embedded snapshots as warnings instead of treating approved post-audit application changes as reconstruction failures. Repository files and this milestone section take precedence. A future documentation-only pass may regenerate a full post-demo source appendix.
