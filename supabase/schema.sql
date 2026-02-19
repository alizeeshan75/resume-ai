-- ============================================================
-- Resume AI — Supabase Schema
-- Paste this entire file into Supabase SQL Editor and run it.
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS and
-- DROP POLICY IF EXISTS before recreating policies.
-- ============================================================

-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------

-- profiles (extends auth.users 1-to-1)
create table if not exists public.profiles (
  id                  uuid references auth.users(id) on delete cascade primary key,
  bio                 text,
  skills              text[]    default '{}',
  languages           text[]    default '{}',
  social_links        jsonb,
  subscription_status text      not null default 'free',
  region_preference   text      not null default 'US',
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- experiences
create table if not exists public.experiences (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references public.profiles(id) on delete cascade not null,
  company     text    not null,
  role        text    not null,
  description text[]  default '{}',
  start_date  date    not null,
  end_date    date,
  is_current  boolean default false,
  location    text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- education
create table if not exists public.education (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  school     text not null,
  degree     text not null,
  field      text not null,
  gpa        text,
  honors     text,
  start_date date not null,
  end_date   date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- resumes
create table if not exists public.resumes (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  title           text not null,
  template_id     text not null default 'modern',
  content         jsonb not null,
  target_region   text not null,
  target_industry text not null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- resume_versions
create table if not exists public.resume_versions (
  id           uuid primary key default gen_random_uuid(),
  resume_id    uuid references public.resumes(id) on delete cascade not null,
  content      jsonb not null,
  version_note text,
  created_at   timestamptz default now()
);

-- interview_sessions
create table if not exists public.interview_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  resume_id       uuid references public.resumes(id) on delete set null,
  job_title       text not null,
  job_description text,
  transcript      jsonb not null,
  overall_score   float,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- generation_logs
create table if not exists public.generation_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  prompt_type text  not null,
  input_data  jsonb not null,
  output_data jsonb not null,
  region      text,
  industry    text,
  model_used  text  not null default 'gemini-2.0-flash',
  tokens_used int,
  latency_ms  int,
  created_at  timestamptz default now()
);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

alter table public.profiles          enable row level security;
alter table public.experiences       enable row level security;
alter table public.education         enable row level security;
alter table public.resumes           enable row level security;
alter table public.resume_versions   enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.generation_logs   enable row level security;

-- Drop existing policies so this script is re-runnable
drop policy if exists "Users own their profile"           on public.profiles;
drop policy if exists "Users own their experiences"       on public.experiences;
drop policy if exists "Users own their education"         on public.education;
drop policy if exists "Users own their resumes"           on public.resumes;
drop policy if exists "Users own their resume versions"   on public.resume_versions;
drop policy if exists "Users own their interview sessions" on public.interview_sessions;

create policy "Users own their profile"
  on public.profiles for all
  using (auth.uid() = id);

create policy "Users own their experiences"
  on public.experiences for all
  using (auth.uid() = (select id from public.profiles where id = experiences.profile_id));

create policy "Users own their education"
  on public.education for all
  using (auth.uid() = (select id from public.profiles where id = education.profile_id));

create policy "Users own their resumes"
  on public.resumes for all
  using (auth.uid() = user_id);

create policy "Users own their resume versions"
  on public.resume_versions for all
  using (auth.uid() = (select user_id from public.resumes where id = resume_versions.resume_id));

create policy "Users own their interview sessions"
  on public.interview_sessions for all
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Auto-create profile row on signup
-- ------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
