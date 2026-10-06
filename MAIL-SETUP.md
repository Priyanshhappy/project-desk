# Theme 1 and email setup

## Run locally (Windows PowerShell)

Open the folder containing package.json. This ZIP puts package.json at the top level, avoiding the previous nested-folder ENOENT problem.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Keep your existing Supabase URL, publishable/anon key and WORKSPACE_OWNER_EMAIL. Never paste secret keys into chat or commit .env.local.

## Enable reminders after deployment

1. In the existing Supabase project's SQL Editor run `supabase/notifications.sql`. Do not reset or recreate your project. `setup.sql` is only for a new installation.
2. Create a Resend account and verify a sending domain using its DNS records. Your receiving Gmail address can stay the same; a new mailbox is unnecessary. The sender is an address on your verified domain, for example `notifications@yourdomain.com`.
3. Add these server-side environment variables to your existing Vercel project:
   - `SUPABASE_SERVICE_ROLE_KEY`: existing Supabase project's service-role key. Keep it server-only.
   - `RESEND_API_KEY`: sending API key from Resend.
   - `RESEND_FROM_EMAIL`: `Project Desk <notifications@yourdomain.com>`.
   - `CRON_SECRET`: a long random secret.
   - `APP_URL`: your production workspace URL, e.g. `https://project-desk-six.vercel.app`.
4. Redeploy the app.
5. Open Settings & email reminders, save your recipient address and enable reminders. Click Send test email, then verify receipt in your inbox/spam folder.
6. Check Vercel's Cron Jobs page after production deployment. The configured schedule is daily at 03:30 UTC / 09:00 IST. Hobby timing may run within that hour; this is not an instant alert service. For frequent checks use a suitable Vercel plan and adjust the cron expression.

## Behaviour

- Existing data, auth, CRUD, PDF builder and import/export are retained.
- Theme 1 applies ivory surfaces, forest-green navigation and orange actions throughout the workspace; optional dark appearance remains available.
- Date-only deadlines remain valid for the entire date in the configured timezone. Overdue starts the next local day.
- Task/milestone due-soon defaults to 2 days. Approval/blocked follow-up defaults to 3 days.
- Completed/resolved/closed/rejected/cancelled and sample records are excluded.
- Each reminder is sent once per event/deadline/recipient. Daily brief repeats outstanding actionable items once per local day.
- Email off keeps in-app events. The live notification center shows currently actionable records immediately; scheduled delivery history records processor results.
- Changing a due date allows a fresh reminder for the new deadline. Changing a record update time resets blocked/approval aging. Historical reminder logs remain visible even after completion.
- My Work matches the existing assignee text `Priyanshu Negi`; the app remains an owner-only workspace, not a new multi-user system.
- Provider acceptance is displayed as acceptance, not proof of delivery. Failed requests appear with their reason; check configuration and provider status.
- A reminder URL opens the linked record after sign-in.

## Validation and limits

Live Supabase migration, authenticated CRUD and real email delivery require your account configuration. The migration has not been applied to your production database and no emails have been sent from this workspace. Sender verification must be checked in Resend. Digest timing is the fixed cron time (timezone controls date classification, not cron scheduling).

Official references:
https://vercel.com/docs/cron-jobs/usage-and-pricing
https://vercel.com/docs/cron-jobs/manage-cron-jobs
https://resend.com/docs/api-reference/emails/send-email
