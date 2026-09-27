-- Profils et rôle administrateur.
-- Le rôle ne se modifie qu'en SQL (tableau de bord Supabase) : aucune policy
-- d'écriture n'est ouverte, pour empêcher toute élévation de privilèges.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Création automatique du profil à la création d'un compte.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- L'utilisateur connecté est-il administrateur ? Utilisée par les policies RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  )
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create policy "Lecture de son profil (ou de tous pour l'admin)"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));
