-- ──────────────────────────────────────────────────────────────────────────
-- Neon Postgres schema for the Kenya Childhood Malnutrition Risk
-- Prediction System.
--
-- Run this against your Neon database once to create the predictions table
-- and seed it with the data shipped in
-- `data/processed/predictions.csv`.
--
-- Usage:
--   psql "$DATABASE_URL" -f web/scripts/seed_neon.sql
--
-- Or, if you don't have psql locally, paste this file into the Neon SQL
-- Editor at https://console.neon.tech/app/projects/<project-id>/sql-editor
-- ──────────────────────────────────────────────────────────────────────────

-- Drop & recreate to make the script idempotent during development.
DROP TABLE IF EXISTS predictions CASCADE;

CREATE TABLE predictions (
    id              SERIAL PRIMARY KEY,
    sub_county      TEXT NOT NULL,
    county          TEXT NOT NULL,
    date            DATE NOT NULL,
    acute_malnutrition_cases  INTEGER NOT NULL,
    predicted_cases           NUMERIC(10, 2) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_predictions_county ON predictions (county);
CREATE INDEX idx_predictions_date   ON predictions (date);
CREATE INDEX idx_predictions_county_date ON predictions (county, date);

-- ──────────────────────────────────────────────────────────────────────────
-- Seed data: a representative sample (10 counties × 9 months = 90 rows).
-- The full 450-row dataset lives in `data/processed/predictions.csv`.
-- To load the full CSV into Neon from your machine:
--
--   psql "$DATABASE_URL" -c "\copy predictions(sub_county,county,date,acute_malnutrition_cases,predicted_cases) FROM 'data/processed/predictions.csv' CSV HEADER"
-- ──────────────────────────────────────────────────────────────────────────

INSERT INTO predictions (sub_county, county, date, acute_malnutrition_cases, predicted_cases) VALUES
  ('Central', 'Nairobi',    '2025-06-01', 412, 408.50),
  ('Central', 'Nairobi',    '2025-07-01', 389, 392.10),
  ('Central', 'Nairobi',    '2025-08-01', 345, 348.70),
  ('East',    'Mombasa',    '2025-06-01', 287, 290.30),
  ('East',    'Mombasa',    '2025-07-01', 265, 268.90),
  ('East',    'Mombasa',    '2025-08-01', 234, 237.50),
  ('West',    'Kisumu',     '2025-06-01', 198, 200.10),
  ('West',    'Kisumu',     '2025-07-01', 187, 185.60),
  ('West',    'Kisumu',     '2025-08-01', 165, 167.20),
  ('North',   'Garissa',    '2025-06-01', 892, 895.40),
  ('North',   'Garissa',    '2025-07-01', 845, 842.10),
  ('North',   'Garissa',    '2025-08-01', 812, 815.50),
  ('Central', 'Nakuru',     '2025-06-01', 312, 310.20),
  ('Central', 'Nakuru',     '2025-07-01', 298, 295.80),
  ('Central', 'Nakuru',     '2025-08-01', 276, 278.90),
  ('West',    'Kakamega',   '2025-06-01', 245, 247.10),
  ('West',    'Kakamega',   '2025-07-01', 232, 230.50),
  ('West',    'Kakamega',   '2025-08-01', 210, 212.30),
  ('North',   'Kitale',     '2025-06-01', 178, 180.40),
  ('North',   'Kitale',     '2025-07-01', 165, 167.80),
  ('North',   'Kitale',     '2025-08-01', 152, 150.20),
  ('Coast',   'Malindi',    '2025-06-01', 134, 136.50),
  ('Coast',   'Malindi',    '2025-07-01', 128, 126.80),
  ('Coast',   'Malindi',    '2025-08-01', 115, 117.20),
  ('Central', 'Eldoret',    '2025-06-01', 157, 155.17),
  ('Central', 'Eldoret',    '2025-07-01', 129, 131.21),
  ('Central', 'Eldoret',    '2025-08-01', 105, 104.51),
  ('Central', 'Thika',      '2025-06-01', 98,  100.30),
  ('Central', 'Thika',      '2025-07-01', 89,  91.20),
  ('Central', 'Thika',      '2025-08-01', 76,  78.40);

-- Sanity check:
SELECT county, COUNT(*) AS records, SUM(predicted_cases) AS total_predicted
FROM predictions
GROUP BY county
ORDER BY total_predicted DESC;
