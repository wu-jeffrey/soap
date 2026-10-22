CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  cat TEXT NOT NULL DEFAULT '',
  aliases TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  sort INTEGER NOT NULL DEFAULT 0,
  deleted_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  updated_by TEXT
);

-- Append-only history: one row per write, holding the state AFTER the action.
CREATE TABLE IF NOT EXISTS revisions (
  rev INTEGER PRIMARY KEY AUTOINCREMENT,
  template_id TEXT NOT NULL,
  action TEXT NOT NULL,          -- create | update | delete | restore
  title TEXT,
  cat TEXT,
  aliases TEXT,
  body TEXT,
  editor TEXT,
  at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_revisions_tpl ON revisions(template_id);

-- One row per person allowed to write; adding a user later = adding a row.
CREATE TABLE IF NOT EXISTS editors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  salt TEXT NOT NULL,
  token_hash TEXT NOT NULL,      -- sha256(salt + passphrase), hex
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
