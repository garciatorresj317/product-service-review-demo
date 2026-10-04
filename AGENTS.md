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
