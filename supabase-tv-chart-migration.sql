-- Run on existing Supabase projects (additive migration).
CREATE TABLE IF NOT EXISTS gold_price_snapshots (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recorded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  prices       JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_gold_price_snapshots_recorded_at ON gold_price_snapshots (recorded_at DESC);

CREATE TABLE IF NOT EXISTS tv_display_settings (
  id                  TEXT PRIMARY KEY DEFAULT 'default',
  chart_days          INTEGER NOT NULL DEFAULT 14,
  chart_row_index     INTEGER NOT NULL DEFAULT 0,
  chart_field         TEXT NOT NULL DEFAULT 'sell',
  slide_interval_sec  INTEGER NOT NULL DEFAULT 300,
  updated_at          TIMESTAMPTZ DEFAULT now()
);

INSERT INTO tv_display_settings (id) VALUES ('default')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE gold_price_snapshots ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'gold_price_snapshots' AND policyname = 'Allow all'
  ) THEN
    CREATE POLICY "Allow all" ON gold_price_snapshots FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

ALTER TABLE tv_display_settings ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tv_display_settings' AND policyname = 'Allow all'
  ) THEN
    CREATE POLICY "Allow all" ON tv_display_settings FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
