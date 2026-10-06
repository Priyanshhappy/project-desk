-- Run AFTER setup.sql. Additive migration; existing project data is untouched.
create table if not exists public.ba_notification_preferences(owner_id uuid primary key references auth.users(id), data jsonb not null default '{}'::jsonb, last_check timestamptz);
create table if not exists public.ba_notification_logs(id bigint generated always as identity primary key, owner_id uuid not null references auth.users(id), event_key text not null, recipient text not null, subject text not null, record_id bigint, status text not null default 'queued', error_message text, provider_message_id text, read_at timestamptz, created_at timestamptz not null default now(), sent_at timestamptz, unique(owner_id,event_key,recipient));
alter table public.ba_notification_preferences enable row level security;
alter table public.ba_notification_logs enable row level security;
drop policy if exists ba_notification_preferences_owner on public.ba_notification_preferences;
create policy ba_notification_preferences_owner on public.ba_notification_preferences for all to authenticated using(owner_id=auth.uid() and public.ba_is_workspace_owner()) with check(owner_id=auth.uid() and public.ba_is_workspace_owner());
drop policy if exists ba_notification_logs_owner on public.ba_notification_logs;
create policy ba_notification_logs_owner on public.ba_notification_logs for select to authenticated using(owner_id=auth.uid() and public.ba_is_workspace_owner());
grant select,insert,update on public.ba_notification_preferences to authenticated;
grant select on public.ba_notification_logs to authenticated;
