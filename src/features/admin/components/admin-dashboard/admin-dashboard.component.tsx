"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type PriceRow } from "@/types/prices";
import { DEFAULT_PRICES } from "@/configs/prices";
import { formatVND } from "@/lib/utils";
import { type ChartField, DEFAULT_TV_DISPLAY_SETTINGS } from "@/types/tv-display";
import { PriceEditRow } from "../price-edit-row";
import styles from "./styles.module.css";

interface AdminDashboardProps {
  onLogout: () => void;
}

const HEADERS = ["Loại Vàng", "Mua Vào", "Bán Ra"] as const;
const TH_POSITIONS = [styles.thFirst, styles.thMiddle, styles.thLast];

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const router = useRouter();
  const [prices, setPrices] = useState<PriceRow[]>(DEFAULT_PRICES);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tvSettings, setTvSettings] = useState({
    chart_days: DEFAULT_TV_DISPLAY_SETTINGS.chart_days,
    chart_row_index: DEFAULT_TV_DISPLAY_SETTINGS.chart_row_index,
    chart_field: DEFAULT_TV_DISPLAY_SETTINGS.chart_field as ChartField,
    slide_interval_sec: DEFAULT_TV_DISPLAY_SETTINGS.slide_interval_sec,
  });
  const [tvSaved, setTvSaved] = useState(false);
  const [tvLoading, setTvLoading] = useState(false);

  useEffect(() => {
    fetchPrices();
    void fetch("/api/tv-display-settings")
      .then((r) => r.json())
      .then((d) => {
        if (d?.settings) {
          setTvSettings({
            chart_days: d.settings.chart_days,
            chart_row_index: d.settings.chart_row_index,
            chart_field: d.settings.chart_field === "buy" ? "buy" : "sell",
            slide_interval_sec: d.settings.slide_interval_sec,
          });
        }
      })
      .catch(() => {});
  }, []);

  async function fetchPrices() {
    try {
      const res = await fetch("/api/prices");
      const data = await res.json();
      if (data.prices) {
        setPrices(data.prices);
      } else {
        setPrices(DEFAULT_PRICES.map((p) => ({ ...p, buy: "", sell: "" })));
      }
    } catch {
      setPrices(DEFAULT_PRICES.map((p) => ({ ...p, buy: "", sell: "" })));
    }
  }

  const handlePriceChange = (index: number, field: keyof PriceRow, value: string) => {
    const formatted = field === "name" ? value : formatVND(value);
    setPrices((prev) => {
      const copy = prev.map((p) => ({ ...p }));
      copy[index][field] = formatted;
      return copy;
    });
    setSaved(false);
  };

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prices }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          router.push("/bang-gia-vang");
        }, 800);
      } else {
        alert("Lỗi: " + (data.error || "Không thể lưu"));
      }
    } catch {
      alert("Lỗi kết nối server");
    }
    setLoading(false);
  }

  async function handleSaveTvSettings() {
    setTvLoading(true);
    setTvSaved(false);
    try {
      const res = await fetch("/api/tv-display-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tvSettings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTvSaved(true);
        setTimeout(() => setTvSaved(false), 2000);
      } else {
        alert("Lỗi cấu hình TV: " + (data.error || "Không thể lưu"));
      }
    } catch {
      alert("Lỗi kết nối server");
    }
    setTvLoading(false);
  }

  function handleLogout() {
    sessionStorage.removeItem("admin-logged-in");
    onLogout();
  }

  return (
    <div className={`bg-theme w-screen min-h-screen flex flex-col items-center justify-center overflow-auto ${styles.dashboard}`}>
      <div className="w-full flex flex-col">
        {/* Header row */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-[2vh] gap-4">
          <div className={`animate-shimmer uppercase leading-[1.1] text-center md:text-left text-title ${styles.title}`}>
            Quản Lý Bảng Giá
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 md:gap-[1vw] w-full md:w-auto">
            {saved && (
              <span className={`font-bold animate-pulse color-sell ${styles.savedBadge}`}>
                ✓ Đã lưu!
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={loading}
              className={`flex-1 md:flex-none th-gradient font-black uppercase tracking-wider cursor-pointer rounded-lg transition-all hover:brightness-110 disabled:opacity-50 text-btn ${styles.saveBtn}`}>
              {loading ? "⏳ Đang lưu..." : "💾 Lưu Bảng Giá"}
            </button>
            <a href="/bang-gia-vang" target="_blank"
               className={`flex-1 md:flex-none text-center rounded-lg font-bold uppercase tracking-wider transition-all hover:brightness-110 text-footer ${styles.viewLink}`}>
              Xem Bảng Giá ↗
            </a>
            <button
              onClick={handleLogout}
              className={`flex-1 md:flex-none rounded-lg font-bold uppercase tracking-wider cursor-pointer transition-all hover:brightness-110 text-footer ${styles.logoutBtn}`}>
              Đăng Xuất
            </button>
          </div>
        </div>

        {/* Price Table */}
        <table className={`w-full ${styles.priceTable}`}>
          <thead>
            <tr>
              {HEADERS.map((h, i) => (
                <th key={h} className={`th-gradient uppercase font-bold text-th ${styles.tvTh} ${styles.th} ${TH_POSITIONS[i]}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prices.map((row, idx) => (
              <PriceEditRow
                key={idx}
                row={row}
                index={idx}
                onUpdateField={handlePriceChange}
              />
            ))}
          </tbody>
        </table>

        <div className={`mt-[3vh] pt-[2vh] border-t border-[rgba(201,168,76,0.25)] ${styles.tvSettings}`}>
          <div className={`text-title text-center md:text-left mb-3 uppercase tracking-wider ${styles.tvSettingsTitle}`}>
            Cấu hình màn hình TV
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto md:mx-0">
            <label className="flex flex-col gap-1 text-footer">
              <span className="font-bold text-[var(--gold)]">Số ngày trên biểu đồ</span>
              <input
                type="number"
                min={1}
                max={365}
                value={tvSettings.chart_days}
                onChange={(e) =>
                  setTvSettings((s) => ({ ...s, chart_days: Number(e.target.value) || 1 }))
                }
                className={`rounded-lg px-3 py-2 bg-black/40 border border-[rgba(201,168,76,0.25)] text-[var(--gold-light)] ${styles.tvInput}`}
              />
            </label>
            <label className="flex flex-col gap-1 text-footer">
              <span className="font-bold text-[var(--gold)]">Loại vàng (dòng biểu đồ)</span>
              <select
                value={tvSettings.chart_row_index}
                onChange={(e) =>
                  setTvSettings((s) => ({ ...s, chart_row_index: Number(e.target.value) }))
                }
                className={`rounded-lg px-3 py-2 bg-black/40 border border-[rgba(201,168,76,0.25)] text-[var(--gold-light)] ${styles.tvInput}`}
              >
                {DEFAULT_PRICES.map((p, i) => (
                  <option key={i} value={i}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-footer">
              <span className="font-bold text-[var(--gold)]">Giá hiển thị trên biểu đồ</span>
              <select
                value={tvSettings.chart_field}
                onChange={(e) =>
                  setTvSettings((s) => ({
                    ...s,
                    chart_field: e.target.value === "buy" ? "buy" : "sell",
                  }))
                }
                className={`rounded-lg px-3 py-2 bg-black/40 border border-[rgba(201,168,76,0.25)] text-[var(--gold-light)] ${styles.tvInput}`}
              >
                <option value="sell">Bán ra</option>
                <option value="buy">Mua vào</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-footer">
              <span className="font-bold text-[var(--gold)]">Thời gian mỗi slide (phút)</span>
              <input
                type="number"
                min={1}
                max={60}
                value={Math.max(1, Math.round(tvSettings.slide_interval_sec / 60))}
                onChange={(e) => {
                  const min = Number(e.target.value);
                  const sec = Math.min(3600, Math.max(60, Math.round(min * 60)));
                  setTvSettings((s) => ({ ...s, slide_interval_sec: sec }));
                }}
                className={`rounded-lg px-3 py-2 bg-black/40 border border-[rgba(201,168,76,0.25)] text-[var(--gold-light)] ${styles.tvInput}`}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
            {tvSaved && (
              <span className={`font-bold animate-pulse color-sell ${styles.savedBadge}`}>✓ Đã lưu cấu hình TV</span>
            )}
            <button
              type="button"
              onClick={handleSaveTvSettings}
              disabled={tvLoading}
              className={`th-gradient font-black uppercase tracking-wider cursor-pointer rounded-lg transition-all hover:brightness-110 disabled:opacity-50 text-btn px-4 py-2 ${styles.saveBtn}`}
            >
              {tvLoading ? "⏳ Đang lưu..." : "📺 Lưu cấu hình TV"}
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <div className={`text-footer uppercase text-center mt-[2vh] ${styles.footerHint}`}>
          Chỉnh sửa giá trực tiếp • Nhấn &quot;Lưu Bảng Giá&quot; để cập nhật • Trang TV tự động refresh sau 30 giây
        </div>
      </div>
    </div>
  );
}
