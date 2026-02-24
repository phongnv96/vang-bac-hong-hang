-- =============================================
-- Bảng giá vàng theo ngày
-- =============================================
CREATE TABLE gold_prices (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date       DATE NOT NULL UNIQUE,
  prices     JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index cho truy vấn theo ngày
CREATE INDEX idx_gold_prices_date ON gold_prices (date);

-- =============================================
-- Bảng admin đăng nhập
-- =============================================
CREATE TABLE admins (
  id       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Thêm admin mặc định
INSERT INTO admins (username, password)
VALUES ('phongnv', 'honghang@2026');

-- =============================================
-- Row Level Security (RLS) — cho phép public đọc/ghi
-- =============================================
ALTER TABLE gold_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON gold_prices FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON admins FOR ALL USING (true) WITH CHECK (true);
