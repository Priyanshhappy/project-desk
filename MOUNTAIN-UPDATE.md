# Project Desk Mountain Update

This package updates the existing application. Authentication, Supabase records,
proposal editor, PDF export, backup import/export and email reminders are retained.

## Run

Run `npm ci`, then `npm run dev`. Copy `.env.example` to `.env.local` and configure
the existing Supabase and email variables for the signed-in workspace.

Open `/preview` for an interactive sample-data preview without signing in.
Preview edits are temporary and cannot save to the live database or send email.

## Flow Builder Setup

Run `supabase/flows.sql` in the existing Supabase SQL editor. This adds one table
with row-level security; it does not alter or delete existing records.

Flows support project selection, colored nodes, connections, node properties,
record linking, pan/zoom, minimap, arrangement, duplication, version snapshots,
review comments and PNG/PDF/JSON exports. Save persists a flow after the migration.
PNG/PDF exports capture the current canvas view; use Fit View before exporting.

## Email Automations

The Automations screen reuses existing notification preferences and scheduled
Resend processing. It supports due-soon tasks, overdue tasks and project timelines,
milestones, pending approvals, blocked work, critical issues and daily summaries.
Enable email and enter the recipient under Automations or Settings.
Follow MAIL-SETUP.md for Resend, verified sender, secrets and Vercel scheduling.
Sample records are excluded from scheduled emails.

The larger custom trigger/condition/action engine from the supplied specification
is not included in this update. Arbitrary rules that create tasks, change project
health or synchronize linked record statuses are not implemented yet.

## Visual Reference

The navy mountain sidebar, pale alpine main background, sunrise date card,
glass-style cards and blue controls follow the approved screenshot. Mountain
artwork is reconstructed from the screenshot; original unobstructed artwork was
not supplied, so this is not a pixel-identical copy of those hidden backgrounds.

## Deploy

`package.json` is at the ZIP root. Extract into a clean folder, configure the same
environment variables, run `npm ci` and `npm run build`, then deploy to Vercel.
Keep your existing production database and configuration.
