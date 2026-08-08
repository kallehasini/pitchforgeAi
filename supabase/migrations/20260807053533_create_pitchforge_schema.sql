/*
# PitchForge AI — core schema

1. New Tables
- `projects`: an uploaded README/document and its AI-extracted structured analysis.
  - id (uuid pk), user_id (uuid, defaults to auth.uid()), name (text), source_type (text: readme|pdf|docx|txt),
    source_filename (text), raw_text (text), extracted_json (jsonb), health_scores (jsonb),
    audience_optimizations (jsonb), created_at, updated_at.
- `decks`: a generated pitch deck for a project, scoped to an audience.
  - id (uuid pk), project_id (uuid fk -> projects), user_id (uuid, defaults to auth.uid()),
    audience (text: hackathon_judge|angel_investor|vc|government),
    slides (jsonb), presenter_notes (jsonb), elevator_pitches (jsonb), investor_questions (jsonb),
    created_at.
- `payments`: mock x402 payment records for pitch generation.
  - id (uuid pk), user_id (uuid, defaults to auth.uid()), project_id (uuid fk -> projects),
    deck_id (uuid fk -> decks nullable), amount (numeric), currency (text), status (text: pending|completed|failed),
    x402_challenge (text), created_at, completed_at.
- `blockchain_records`: Algorand-style verification records tying a deck to an immutable hash.
  - id (uuid pk), deck_id (uuid fk -> decks), user_id (uuid, defaults to auth.uid()),
    deck_hash (text), verification_id (text), generation_id (text), tx_id (text),
    network (text), recorded_at (timestamptz), created_at.

2. Security
- RLS enabled on all tables.
- Owner-scoped CRUD policies (TO authenticated, auth.uid() = user_id) for all four tables.
- Child tables (decks, payments, blockchain_records) also carry their own user_id for direct ownership checks.

3. Notes
- DEFAULT auth.uid() on user_id columns so client inserts that omit user_id succeed.
- extracted_json / slides etc. are jsonb so the AI engine can store rich structured payloads.
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  source_type text NOT NULL DEFAULT 'readme',
  source_filename text,
  raw_text text,
  extracted_json jsonb,
  health_scores jsonb,
  audience_optimizations jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_projects" ON projects;
CREATE POLICY "select_own_projects" ON projects FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_projects" ON projects;
CREATE POLICY "insert_own_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_projects" ON projects;
CREATE POLICY "update_own_projects" ON projects FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_projects" ON projects;
CREATE POLICY "delete_own_projects" ON projects FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  audience text NOT NULL DEFAULT 'hackathon_judge',
  slides jsonb NOT NULL DEFAULT '[]'::jsonb,
  presenter_notes jsonb DEFAULT '[]'::jsonb,
  elevator_pitches jsonb DEFAULT '{}'::jsonb,
  investor_questions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE decks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_decks" ON decks;
CREATE POLICY "select_own_decks" ON decks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_decks" ON decks;
CREATE POLICY "insert_own_decks" ON decks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_decks" ON decks;
CREATE POLICY "update_own_decks" ON decks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_decks" ON decks;
CREATE POLICY "delete_own_decks" ON decks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  deck_id uuid REFERENCES decks(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 5.00,
  currency text NOT NULL DEFAULT 'USDC',
  status text NOT NULL DEFAULT 'pending',
  x402_challenge text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_payments" ON payments;
CREATE POLICY "select_own_payments" ON payments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_payments" ON payments;
CREATE POLICY "insert_own_payments" ON payments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_payments" ON payments;
CREATE POLICY "update_own_payments" ON payments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_payments" ON payments;
CREATE POLICY "delete_own_payments" ON payments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS blockchain_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id uuid NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_hash text NOT NULL,
  verification_id text NOT NULL,
  generation_id text NOT NULL,
  tx_id text,
  network text NOT NULL DEFAULT 'algorand-testnet',
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blockchain_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_blockchain_records" ON blockchain_records;
CREATE POLICY "select_own_blockchain_records" ON blockchain_records FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_blockchain_records" ON blockchain_records;
CREATE POLICY "insert_own_blockchain_records" ON blockchain_records FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_blockchain_records" ON blockchain_records;
CREATE POLICY "update_own_blockchain_records" ON blockchain_records FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_blockchain_records" ON blockchain_records;
CREATE POLICY "delete_own_blockchain_records" ON blockchain_records FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON decks(user_id);
CREATE INDEX IF NOT EXISTS idx_decks_project_id ON decks(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_deck_id ON blockchain_records(deck_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_verification_id ON blockchain_records(verification_id);
