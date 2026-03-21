-- =============================================================================
-- Mock giá vàng 7 ngày gần nhất (CURRENT_DATE − 6 … CURRENT_DATE)
-- Khoảng 16–19 triệu (mua/bán), cùng cấu trúc JSON với app (DEFAULT_PRICES)
--
-- Chạy trong Supabase → SQL Editor (hoặc psql). Có thể chạy lại: ghi đè theo ngày.
-- =============================================================================

INSERT INTO gold_prices (date, prices, updated_at)
VALUES
  (
    (CURRENT_DATE - 6)::date,
    '[
      {"name":"Nhẫn Tròn","buy":"16.100.000","sell":"16.450.000"},
      {"name":"Nữ Trang","buy":"15.950.000","sell":"16.300.000"},
      {"name":"Vàng Tây 10K","buy":"","sell":""},
      {"name":"Bạc","buy":"","sell":""}
    ]'::jsonb,
    now()
  ),
  (
    (CURRENT_DATE - 5)::date,
    '[
      {"name":"Nhẫn Tròn","buy":"16.650.000","sell":"17.050.000"},
      {"name":"Nữ Trang","buy":"16.500.000","sell":"16.900.000"},
      {"name":"Vàng Tây 10K","buy":"","sell":""},
      {"name":"Bạc","buy":"","sell":""}
    ]'::jsonb,
    now()
  ),
  (
    (CURRENT_DATE - 4)::date,
    '[
      {"name":"Nhẫn Tròn","buy":"16.400.000","sell":"16.800.000"},
      {"name":"Nữ Trang","buy":"16.250.000","sell":"16.650.000"},
      {"name":"Vàng Tây 10K","buy":"","sell":""},
      {"name":"Bạc","buy":"","sell":""}
    ]'::jsonb,
    now()
  ),
  (
    (CURRENT_DATE - 3)::date,
    '[
      {"name":"Nhẫn Tròn","buy":"17.200.000","sell":"17.600.000"},
      {"name":"Nữ Trang","buy":"17.050.000","sell":"17.450.000"},
      {"name":"Vàng Tây 10K","buy":"","sell":""},
      {"name":"Bạc","buy":"","sell":""}
    ]'::jsonb,
    now()
  ),
  (
    (CURRENT_DATE - 2)::date,
    '[
      {"name":"Nhẫn Tròn","buy":"17.800.000","sell":"18.200.000"},
      {"name":"Nữ Trang","buy":"17.650.000","sell":"18.050.000"},
      {"name":"Vàng Tây 10K","buy":"","sell":""},
      {"name":"Bạc","buy":"","sell":""}
    ]'::jsonb,
    now()
  ),
  (
    (CURRENT_DATE - 1)::date,
    '[
      {"name":"Nhẫn Tròn","buy":"18.350.000","sell":"18.750.000"},
      {"name":"Nữ Trang","buy":"18.200.000","sell":"18.600.000"},
      {"name":"Vàng Tây 10K","buy":"","sell":""},
      {"name":"Bạc","buy":"","sell":""}
    ]'::jsonb,
    now()
  ),
  (
    CURRENT_DATE::date,
    '[
      {"name":"Nhẫn Tròn","buy":"18.600.000","sell":"18.950.000"},
      {"name":"Nữ Trang","buy":"18.450.000","sell":"18.800.000"},
      {"name":"Vàng Tây 10K","buy":"","sell":""},
      {"name":"Bạc","buy":"","sell":""}
    ]'::jsonb,
    now()
  )
ON CONFLICT (date) DO UPDATE SET
  prices     = EXCLUDED.prices,
  updated_at = EXCLUDED.updated_at;
