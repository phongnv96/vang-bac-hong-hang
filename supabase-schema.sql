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
-- Lịch sử mỗi lần lưu giá (append) — biểu đồ TV
-- =============================================
CREATE TABLE gold_price_snapshots (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recorded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  prices       JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX idx_gold_price_snapshots_recorded_at ON gold_price_snapshots (recorded_at DESC);

-- =============================================
-- Cấu hình hiển thị TV (biểu đồ + luân phiên slide)
-- =============================================
CREATE TABLE tv_display_settings (
  id                  TEXT PRIMARY KEY DEFAULT 'default',
  chart_days          INTEGER NOT NULL DEFAULT 14,
  chart_row_index     INTEGER NOT NULL DEFAULT 0,
  chart_field         TEXT NOT NULL DEFAULT 'sell',
  slide_interval_sec  INTEGER NOT NULL DEFAULT 300,
  updated_at          TIMESTAMPTZ DEFAULT now()
);

INSERT INTO tv_display_settings (id) VALUES ('default')
ON CONFLICT (id) DO NOTHING;

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

ALTER TABLE gold_price_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON gold_price_snapshots FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE tv_display_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON tv_display_settings FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON admins FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- Bảng danh mục sản phẩm (Categories)
-- =============================================
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Bảng sản phẩm (Products)
-- =============================================
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  material TEXT,
  weight TEXT,
  stone TEXT,
  description TEXT,
  base_price NUMERIC, -- Giá tham khảo (Tùy chọn)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bảng lưu trữ hình ảnh sản phẩm (One-to-many)
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Bảng Đơn Hàng / Đăng ký Tư vấn (Leads)
-- =============================================
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending', -- pending, contacted, completed, cancelled
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- Bảng Đánh giá (Reviews)
-- =============================================
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false, -- Admin must approve before showing
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- RLS (Row Level Security) cho các bảng mới
-- (Thiết lập tạm thời Allow All để phát triển nhanh)
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on categories" ON categories FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on products" ON products FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on product_images" ON product_images FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
