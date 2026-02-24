"use client";

import { useState, useEffect } from "react";
import { type PriceRow, DEFAULT_PRICES, formatVND } from "../lib/prices";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem("admin-logged-in");
    if (session === "true") {
      setIsLoggedIn(true);
      fetchPrices();
    }
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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsLoggedIn(true);
        sessionStorage.setItem("admin-logged-in", "true");
        fetchPrices();
      } else {
        setError(data.error || "Đăng nhập thất bại");
      }
    } catch {
      setError("Lỗi kết nối server");
    }
    setLoading(false);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin-logged-in");
    setUsername("");
    setPassword("");
  }

  function updateField(index: number, field: keyof PriceRow, value: string) {
    const formatted = field === "name" ? value : formatVND(value);
    setPrices((prev) => {
      const copy = prev.map((p) => ({ ...p }));
      copy[index][field] = formatted;
      return copy;
    });
    setSaved(false);
  }

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
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Lỗi: " + (data.error || "Không thể lưu"));
      }
    } catch {
      alert("Lỗi kết nối server");
    }
    setLoading(false);
  }

  // ------- LOGIN SCREEN -------
  if (!isLoggedIn) {
    return (
      <div className="bg-theme min-h-screen flex items-center justify-center">
        <div className="login-box rounded-2xl"
             style={{
               background: "linear-gradient(135deg, #2a0000, #1a0000)",
               border: "2px solid var(--gold)",
               boxShadow: "0 0 60px rgba(201,168,76,0.15)",
             }}>
          <div className="text-center mb-[4vh]">
            <h1 className="animate-shimmer uppercase font-black tracking-wider text-title mb-[1vh]"
                style={{ fontFamily: "'Playfair Display', serif", color: "var(--gold-light)" }}>
              Hồng Hằng
            </h1>
            <p className="uppercase tracking-widest color-gold text-sub">
              Quản lý bảng giá
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-[3vh]">
            <div className="flex flex-col gap-[1vh]">
              <label className="uppercase font-bold tracking-wider color-gold text-label">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="Nhập tên đăng nhập..."
                autoFocus
                className="input-price w-full text-price color-gold-light"
              />
            </div>
            <div className="flex flex-col gap-[1vh]">
              <label className="uppercase font-bold tracking-wider color-gold text-label">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Nhập mật khẩu..."
                  className="input-price w-full text-price color-gold-light pr-[5vw]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[1vw] top-1/2 -translate-y-1/2 cursor-pointer text-label"
                  style={{ color: "var(--gold)", background: "none", border: "none" }}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-center font-bold text-btn" style={{ color: "#ff6666" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg font-black uppercase tracking-wider transition-all duration-200 hover:brightness-110 cursor-pointer th-gradient disabled:opacity-50 text-btn"
              style={{ padding: "2vh 0" }}>
              {loading ? "Đang xử lý..." : "Đăng Nhập"}
            </button>
          </form>

          <div className="text-center mt-[3vh]">
            <a href="/" className="text-footer underline transition-colors hover:text-[#f5d27a]"
               style={{ color: "rgba(201,168,76,0.6)" }}>
              ← Quay lại bảng giá
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ------- ADMIN DASHBOARD (TV-style layout) -------
  return (
    <div className="bg-theme w-screen h-screen flex flex-col overflow-auto admin-dashboard">

      {/* Header row */}
      <div className="flex items-center justify-between mb-[2vh]">
        <div className="animate-shimmer uppercase text-title"
             style={{
               fontFamily: "'Playfair Display', serif",
               fontWeight: 900,
               color: "var(--gold-light)",
               letterSpacing: "0.1em",
               textShadow: "0 0 30px rgba(245,210,122,0.5), 2px 2px 0 #7a3800",
             }}>
          Quản Lý Bảng Giá
        </div>
        <div className="flex items-center gap-[2vw]">
          {saved && (
            <span className="font-bold animate-pulse color-sell" style={{ fontSize: "3vh" }}>
              ✓ Đã lưu!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={loading}
            className="th-gradient font-black uppercase tracking-wider cursor-pointer rounded-lg transition-all hover:brightness-110 disabled:opacity-50"
            style={{ fontSize: "2.5vh", padding: "1.2vh 3vw" }}>
            {loading ? "⏳ Đang lưu..." : "💾 Lưu Bảng Giá"}
          </button>
          <a href="/" target="_blank"
             className="rounded-lg font-bold uppercase tracking-wider transition-all hover:brightness-110"
             style={{
               fontSize: "2vh",
               padding: "1.2vh 2vw",
               background: "rgba(201,168,76,0.15)",
               color: "var(--gold)",
               border: "1px solid rgba(201,168,76,0.25)",
             }}>
            Xem Bảng Giá ↗
          </a>
          <button
            onClick={handleLogout}
            className="rounded-lg font-bold uppercase tracking-wider cursor-pointer transition-all hover:brightness-110"
            style={{
              fontSize: "2vh",
              padding: "1.2vh 2vw",
              background: "rgba(255,100,100,0.15)",
              color: "#ff8888",
              border: "1px solid rgba(255,100,100,0.25)",
            }}>
            Đăng Xuất
          </button>
        </div>
      </div>

      {/* Price Table — same layout as TV display but with inputs */}
      <table className="w-full flex-1" style={{ borderCollapse: "separate", borderSpacing: "0 0.8vh" }}>
        <thead>
          <tr>
            {["Loại Vàng", "Mua Vào", "Bán Ra"].map((h, i) => (
              <th key={h}
                  className="th-gradient uppercase font-bold text-th"
                  style={{
                    letterSpacing: "0.15em",
                    padding: "1.5vh 2vw",
                    borderRadius: i === 0 ? "8px 0 0 8px" : i === 2 ? "0 8px 8px 0" : undefined,
                    textAlign: i === 0 ? "left" : "center",
                    width: i === 0 ? "30%" : undefined,
                  }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {prices.map((row, idx) => (
            <tr key={idx} className="animate-row-slide"
                style={{ animationDelay: `${idx * 0.1 + 0.05}s` }}>
              {/* Type column */}
              <td className="text-name color-gold-light"
                  style={{
                    padding: "1.2vh 2vw",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textAlign: "left",
                    borderLeft: "4px solid var(--gold)",
                    borderRadius: "8px 0 0 8px",
                    background: "rgba(201,168,76,0.08)",
                    borderTop: "1px solid rgba(201,168,76,0.15)",
                    borderBottom: "1px solid rgba(201,168,76,0.15)",
                  }}>
                {row.name}
              </td>
              {/* Buy input */}
              <td style={{
                    padding: "1.2vh 2vw",
                    textAlign: "center",
                    background: "rgba(0,0,0,0.3)",
                    borderTop: "1px solid rgba(201,168,76,0.15)",
                    borderBottom: "1px solid rgba(201,168,76,0.15)",
                  }}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={row.buy}
                  onChange={(e) => updateField(idx, "buy", e.target.value)}
                  placeholder="—"
                  className="input-price text-price color-buy w-full text-center"
                />
              </td>
              {/* Sell input */}
              <td style={{
                    padding: "1.2vh 2vw",
                    textAlign: "center",
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "0 8px 8px 0",
                    borderRight: "3px solid rgba(201,168,76,0.3)",
                    borderTop: "1px solid rgba(201,168,76,0.15)",
                    borderBottom: "1px solid rgba(201,168,76,0.15)",
                  }}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={row.sell}
                  onChange={(e) => updateField(idx, "sell", e.target.value)}
                  placeholder="—"
                  className="input-price text-price color-sell w-full text-center"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer hint */}
      <div className="text-footer uppercase text-center mt-[1vh]"
           style={{ color: "rgba(201,168,76,0.5)", letterSpacing: "0.2em" }}>
        Chỉnh sửa giá trực tiếp • Nhấn &quot;Lưu Bảng Giá&quot; để cập nhật • Trang TV tự động refresh sau 30 giây
      </div>
    </div>
  );
}
