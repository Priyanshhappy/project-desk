# Editorial Forest update

Approved Theme 1: ivory canvas, forest-green sidebar, orange actions, serif page and section headings, readable table text. Applied to dashboard, project pages, CRUD dialogs, proposals, authentication, navigation and notifications.

Added owner-assigned My Work, Notifications, Settings & email reminders, due/project/milestone detection, approval/blocked follow-up thresholds, issue severity, a secure cron processor, transactional Resend emails, daily summary, delivery history, test email, unique event logs, bounded transport retries using the same provider idempotency key, and record links from emails.

The additive migration is supabase/notifications.sql. Read MAIL-SETUP.md before enabling mail. Production database and Vercel environment variables have not been changed by this ZIP.

Validation: TypeScript, production build, deadline/terminal-status/timezone/sample/toggle tests, cron authentication and mocked email transport tests. Live browser preview was blocked by this environment; authenticated CRUD, PDF rendering and real mail delivery must be verified after configuration.

The original owner-only Supabase schema, CRUD RPC, import/export and proposal PDF engine remain. This update does not introduce a team workspace switcher, new user permissions, instant email alerts, custom digest schedules, snooze/escalation workflows or a new reports module.
