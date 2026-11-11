-- Rode no SQL Editor do Supabase
create table votes (
  id bigint generated always as identity primary key,
  category text not null, choice text not null check (char_length(choice) <= 80),
  voter_id text not null, created_at timestamptz default now(),
  unique (category, voter_id)
);
alter table votes enable row level security;
create policy "qualquer pessoa vota" on votes for insert with check (true);
-- sem policy de select: ninguém lê votos individuais; só a view agregada abaixo
create view results as
  select category, lower(choice) as k, min(choice) as choice, count(*)::int as votos
  from votes group by category, lower(choice);
grant select on results to anon;
