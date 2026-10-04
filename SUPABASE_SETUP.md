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
