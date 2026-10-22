create table if not exists house_members (
  user_id text primary key,
  email text not null unique,
  name text not null,
  role text not null,
  created_at timestamptz not null default now()
);

create table if not exists house_orders (
  id text primary key,
  user_id text not null,
  payload text not null,
  status text not null,
  created_at timestamptz not null default now()
);

create index if not exists house_orders_user_idx on house_orders (user_id);

create table if not exists pass_calls (
  menu_item_id text primary key,
  note text not null default '',
  called_at timestamptz not null default now()
);
