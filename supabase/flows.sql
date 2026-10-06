-- Additive migration: existing records and authentication remain unchanged.
create table if not exists public.ba_flow_diagrams (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id),
 project text not null,
 title text not null,
 flow_type text not null default 'User Flow',
 status text not null default 'Draft',
 nodes jsonb not null default '[]',
 edges jsonb not null default '[]',
 versions jsonb not null default '[]',
 comments jsonb not null default '[]',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.ba_flow_diagrams enable row level security;
drop policy if exists "Own flow diagrams" on public.ba_flow_diagrams;
create policy "Own flow diagrams" on public.ba_flow_diagrams
 for all to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());
grant select,insert,update,delete on public.ba_flow_diagrams to authenticated;
create index if not exists ba_flow_diagrams_owner_project on public.ba_flow_diagrams(owner_id,project);
