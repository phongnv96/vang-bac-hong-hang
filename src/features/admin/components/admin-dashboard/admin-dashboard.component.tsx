"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type PriceRow } from "@/types/prices";
import { DEFAULT_PRICES } from "@/configs/prices";
import { formatVND } from "@/lib/utils";
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

  useEffect(() => {
    fetchPrices();
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
          router.push("/");
        }, 800);
      } else {
        alert("Lỗi: " + (data.error || "Không thể lưu"));
      }
    } catch {
      alert("Lỗi kết nối server");
    }
    setLoading(false);
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
            <a href="/" target="_blank"
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

        {/* Footer hint */}
        <div className={`text-footer uppercase text-center mt-[2vh] ${styles.footerHint}`}>
          Chỉnh sửa giá trực tiếp • Nhấn &quot;Lưu Bảng Giá&quot; để cập nhật • Trang TV tự động refresh sau 30 giây
        </div>
      </div>
    </div>
  );
}
