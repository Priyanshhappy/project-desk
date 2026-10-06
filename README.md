# Project Desk — Vercel edition

**Already deployed? Read UPDATE-NOTES.md. This layout update requires a source redeploy only; keep your existing Supabase setup.**

Your personal business analyst workspace: projects, requirements, stories, tasks, issues, changes, milestones, notes and proposal PDFs.

## Deploy in 10 minutes

1. Extract this ZIP. Upload the contents of **vercel-project-desk** to a GitHub repository (package.json should be at the repository root).
2. Create a Supabase project, or use an existing one. In **SQL Editor**, run **supabase/setup.sql**. It creates separate `ba_workspace_*` tables and owner-only access policies.
3. In Supabase **Authentication → Users → Add user**, create the owner account with email **priyanknegi41@gmail.com** and a password. Use this email to sign in to Project Desk. Disable public sign-ups if you do not need them.
4. From Supabase project settings, copy your project URL and public anon/publishable key. In Vercel, import the GitHub repository, select **Next.js**, and set these environment variables for the environments you deploy:

| Variable | Value |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | Your Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Your Supabase public anon or publishable key |
| WORKSPACE_OWNER_EMAIL | priyanknegi41@gmail.com |

5. Deploy. If you add/change environment variables after deployment, redeploy so the browser bundle gets the new values.
6. Open the deployed website and sign in with the owner email and password.
7. To restore your existing workspace, open **PN avatar → Import workspace backup** and choose **workspace-backup.json** from this ZIP. It includes 62 records from the current workspace. Import into an empty workspace **before** using Load samples. Existing data is never overwritten by import.

Vercel does not deploy this ZIP directly: extract it and import the source repository. A working Supabase project and the three variables above are required. No Supabase credentials are included in this archive.

### A different owner email

Before running the SQL, replace the default email in `setup.sql`, create that same Supabase user and set `WORKSPACE_OWNER_EMAIL` to match. If SQL has already been run, use SQL Editor:

```sql
update public.ba_workspace_config
set owner_email = 'your-email@example.com'
where singleton = true;
```

## Local development

Use Node.js 22 LTS.

```sh
npm ci
cp .env.example .env.local
# Fill your Supabase values in .env.local.
npm run dev
```

Open http://localhost:3000. For validation: `npm run check` and `npm run build`.

## What's included

- Pending tasks, clear save/session errors, and one automatic token refresh in the Vercel edition.
- Unsaved form recovery after interrupted saves/reloads; duplicate task creation is prevented when retrying the same form submission.
- Interactive dashboard cards, module dock, global search (Cmd/Ctrl K), notifications, quick create and light/dark appearance.
- Waplia-style purple/navy PDF cover, with editable document title, project name, subtitle/reference, date, prepared by and prepared company.
- Optional client name, company, email, phone and address. Leave unknown details blank; blank details do not appear on the cover.
- Proposal body written by you with headings, bold/italic, lists, tables, paragraph spacing and explicit toolbar page breaks. Pasted dividers remain ordinary lines. The cover is attached as the first PDF page.
- Profile menu import/export for JSON workspace backups.

The Waplia logo is a recreated SVG based on the reference screenshot. Replace `public/branding/waplia-logo.svg` with your official logo if needed. The content pages and actual cover use the same PDF generator as the live preview.

## Data and sign-in

Supabase persists records across deployments. Both the server and database require the configured owner email. The browser uses the public Supabase key; database row policies control access. Do not substitute a service-role secret in a `NEXT_PUBLIC_*` variable.

If a save fails, keep the form open and retry. Reloading offers **Restore draft**. If your session expires, sign in again. A database-not-ready message means the SQL setup step is still needed.

The included backup is a snapshot. You can export newer data from the original workspace via **PN avatar → Export workspace backup**, then import that JSON into a fresh empty Vercel workspace.

## Verification performed

TypeScript and optimized Next.js production build; proposal paste/spacing, explicit line breaks and page-break checks; PostgreSQL-compatible checks for backup import, refusal to overwrite existing data, Pending task creation/update, retry deduplication, activity logging and owner access policies. Proposal PDF output was rendered and inspected. Actual Vercel hosting and live Supabase credentials must be configured in your own accounts.
