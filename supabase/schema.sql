-- ASAP-SOS Supabase schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query) once
-- after creating your project. Requires the PostGIS-free haversine approach
-- below (no extensions needed) for broad compatibility on the free tier.

-- ── Profiles ────────────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now(),
  suspended_until timestamptz,
  suspension_reason text
);

alter table profiles enable row level security;

create policy "Profiles are viewable by the owner"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Broadcasts ──────────────────────────────────────────────────────────
create table if not exists broadcasts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  message text,
  video_url text,
  range text check (range in ('nearby', 'wide')) default 'nearby',
  category text default 'general',
  lat double precision,
  lng double precision,
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '6 hours')
);

alter table broadcasts enable row level security;

create policy "Broadcasts are readable by any signed-in user"
  on broadcasts for select
  using (auth.role() = 'authenticated');

create policy "Users can insert their own broadcasts"
  on broadcasts for insert
  with check (auth.uid() = user_id);

-- Suspended users cannot create new broadcasts.
create or replace function public.check_not_suspended()
returns trigger as $$
declare
  until timestamptz;
begin
  select suspended_until into until from profiles where id = new.user_id;
  if until is not null and until > now() then
    raise exception 'Account suspended until %', until;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists enforce_not_suspended on broadcasts;
create trigger enforce_not_suspended
  before insert on broadcasts
  for each row execute procedure public.check_not_suspended();

-- ── Reports (false-alarm flagging) ─────────────────────────────────────
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  broadcast_id uuid references broadcasts(id) on delete cascade,
  reporter_id uuid references profiles(id) on delete cascade,
  reason text,
  created_at timestamptz default now(),
  unique (broadcast_id, reporter_id)
);

alter table reports enable row level security;

create policy "Users can insert reports"
  on reports for insert
  with check (auth.uid() = reporter_id);

create policy "Users can read report counts"
  on reports for select
  using (auth.role() = 'authenticated');

-- ── Nearby broadcasts RPC (haversine distance, no PostGIS needed) ──────
create or replace function nearby_broadcasts(in_lat double precision, in_lng double precision, in_radius_km double precision default 5)
returns setof broadcasts as $$
  select *
  from broadcasts
  where expires_at > now()
    and (
      range = 'wide'
      or (
        lat is not null and lng is not null
        and (
          6371 * acos(
            least(1, greatest(-1,
              cos(radians(in_lat)) * cos(radians(lat)) *
              cos(radians(lng) - radians(in_lng)) +
              sin(radians(in_lat)) * sin(radians(lat))
            ))
          )
        ) <= in_radius_km
      )
    )
  order by created_at desc
  limit 100;
$$ language sql stable;

-- ── Storage bucket for broadcast videos ────────────────────────────────
-- Create manually in Supabase Dashboard → Storage → New bucket:
--   name: broadcast-videos, public: true (so video_url links work directly)
