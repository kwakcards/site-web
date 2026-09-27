-- Extensions et fonctions utilitaires communes.

create extension if not exists pg_trgm with schema extensions;
create extension if not exists unaccent with schema extensions;
create extension if not exists citext with schema extensions;

-- unaccent() n'est pas IMMUTABLE : cette enveloppe (dictionnaire explicite)
-- permet de l'utiliser dans une colonne générée et un index de recherche.
create or replace function public.immutable_unaccent(value text)
returns text
language sql
immutable
parallel safe
strict
set search_path = ''
as $$
  select extensions.unaccent('extensions.unaccent'::regdictionary, value)
$$;

-- Tient à jour la colonne updated_at à chaque modification.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
