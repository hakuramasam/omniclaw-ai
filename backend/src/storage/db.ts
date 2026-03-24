import { Pool } from "pg"
import { config } from "../config"

export const db = new Pool({
  connectionString: config.databaseUrl
})

export async function ensureSchema() {
  await db.query(`
    create table if not exists agents (
      id text primary key,
      name text not null,
      status text not null,
      created_at timestamptz default now()
    );

    create table if not exists skills (
      id text primary key,
      name text not null,
      source text not null,
      version text,
      installed_at timestamptz default now()
    );

    create table if not exists a2a_messages (
      id text primary key,
      direction text not null,
      sender text not null,
      recipient text not null,
      message_type text not null,
      payload jsonb not null,
      created_at timestamptz default now()
    );

    create table if not exists tool_runs (
      id text primary key,
      tool text not null,
      input jsonb not null,
      output jsonb,
      status text not null,
      created_at timestamptz default now()
    );

    create table if not exists x402_payments (
      id text primary key,
      link text not null,
      amount text not null,
      chain_id integer not null,
      token_address text not null,
      created_at timestamptz default now(),
      used_at timestamptz
    );
  `)

  await db.query(
    "alter table x402_payments add column if not exists used_at timestamptz"
  )

  await db.query(
    `insert into agents (id, name, status)
     values ($1, $2, $3)
     on conflict (id) do nothing`,
    ["kai", "Kai Agent", "online"]
  )
}
