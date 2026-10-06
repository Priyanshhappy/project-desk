# Project Desk Enterprise Redesign

## What changed

This update is a UI/UX redesign of the existing Project Desk application. It does not replace the existing data model, authentication flow, Supabase setup, API routes, save RPC, proposal generation, import/export, or CRUD behavior.

### Enterprise shell
- Replaced the floating bottom dock with a fixed dark enterprise sidebar.
- Added grouped navigation for Dashboard, Projects, Workspace modules, and Proposals.
- Added collapsible desktop navigation and compact tablet behavior.
- Reworked the top header into a compact productivity toolbar.
- Preserved dark/light appearance switching.

### Global productivity
- Expanded global `Ctrl/Cmd + K` search to include milestones and notes as well as existing modules.
- Expanded the global `+ New` menu to include milestones and notes.
- Improved notification logic to surface overdue work, blocked tasks, critical issues, client clarification, and pending change approval.

### Dashboard
- Reduced summary metrics to four operational KPIs: Active Projects, Open Tasks, Pending Changes, Open Issues.
- Added Project Health with progress, phase, deadline, and derived On Track / At Risk / Delayed labels.
- Added Needs Attention with clickable overdue, blocked, critical, clarification, and pending approval records.
- Added My Work using real open task records.
- Added Upcoming Milestones using real milestone records.
- Kept Recent Activity connected to the existing activity records.

### Visual system
- Applied the requested navy sidebar / neutral workspace / blue accent palette.
- Reduced oversized spacing, rounding, and decorative effects.
- Increased information density and table scanability.
- Added responsive rules for desktop, tablet, and mobile layouts.

## Backend safety

No database migration is required for this redesign.

The following were intentionally left unchanged:
- `supabase/setup.sql`
- `ba_workspace_records` table structure
- `ba_save_records` RPC
- authentication and owner policies
- `/api/records`
- `/api/import`
- proposal PDF logic
- existing record kinds and existing stored data

## Not added yet

A standalone Clients module and persistent user/assignee identity model are not present in the existing backend schema. They were not faked with mock data. If you want these as true modules, add them as a separate backward-compatible migration after deciding the desired data model and relationships.

## Local verification

Run after extracting:

```bash
npm ci
npm run check
npm run build
```

The sandbox used for this update could not complete `npm ci` because dependency installation timed out, so a full production build could not be executed here. Static TSX parsing did not report syntax errors in the modified files.
