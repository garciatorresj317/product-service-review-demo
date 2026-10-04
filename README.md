# Product & Service Review demo

An interactive Next.js demonstration of an employee-specific customer feedback workflow.

## Try the demo

Public demo:

```text
https://garciatorresj317.github.io/product-service-review-demo/demo/
```

1. Open `/demo` in the running app.
2. Use the included **John** employee record or add another employee.
3. Select **Open review page** or copy the employee link.
4. Choose a rating, enter written feedback, and submit it.
5. Return to the owner workspace to see the review under the correct employee.

The sample NFC destination is:

```text
https://garciatorresj317.github.io/product-service-review-demo/review/john-sample-company/
```

Do not write a `localhost` or private Wi-Fi address to a card intended for other people.

## Important demo limitation

This is a browser-local demonstration. Employees and reviews are stored in `localStorage`, so the review and owner workspace must be opened in the same browser profile to share demo data. It does not yet save feedback to a live company database or authenticate owners.

## Run locally

Requirements: Node.js 22 or newer and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000/demo`.

No Supabase settings are required for the interactive demo. The `/setup` route and Supabase foundation files are groundwork for the later database-backed application.

## Verification

```bash
node --test tests/supabase-config.test.mjs tests/demo-model.test.mjs
npm run build
```

## Environment safety

`.env.local`, build output, and installed dependencies are excluded by `.gitignore`. Copy `.env.example` to `.env.local` only when working on the Supabase-backed milestones. Never commit private credentials.
