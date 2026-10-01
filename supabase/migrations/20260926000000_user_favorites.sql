create table if not exists public.user_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  listing_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

alter table public.user_favorites enable row level security;

create policy "Users can read their own saved homes"
  on public.user_favorites for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can save their own homes"
  on public.user_favorites for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own saved homes"
  on public.user_favorites for delete
  to authenticated
  using ((select auth.uid()) = user_id);