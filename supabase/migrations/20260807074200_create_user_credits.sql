/*
# Create user_credits table for freemium model

1. New Tables
- `user_credits`: tracks each user's free pitch generation credits and premium status.
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users)
  - `free_credits` (integer, not null, default 4) — remaining free generations
  - `is_premium` (boolean, not null, default false)
  - `premium_activated_at` (timestamptz, nullable)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `user_credits`.
- Owner-scoped CRUD: each authenticated user can only access their own credit row.
- SELECT, INSERT, UPDATE policies scoped to auth.uid() = user_id.
*/

CREATE TABLE IF NOT EXISTS user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  free_credits integer NOT NULL DEFAULT 4,
  is_premium boolean NOT NULL DEFAULT false,
  premium_activated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_credits" ON user_credits;
CREATE POLICY "select_own_credits" ON user_credits
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_credits" ON user_credits;
CREATE POLICY "insert_own_credits" ON user_credits
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_credits" ON user_credits;
CREATE POLICY "update_own_credits" ON user_credits
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_credits" ON user_credits;
CREATE POLICY "delete_own_credits" ON user_credits
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
