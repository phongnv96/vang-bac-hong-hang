"use client";

import { useState, useEffect } from "react";
import { type PriceRow, DEFAULT_PRICES, formatVND } from "./lib/prices";

export default function Home() {
  const [prices, setPrices] = useState<PriceRow[]>(
    DEFAULT_PRICES.map((p) => ({ ...p, buy: "", sell: "" }))
  );
  const [dateTime, setDateTime] = useState("");

  // Fetch prices from API
  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        const data = await res.json();
        if (data.prices) setPrices(data.prices);
      } catch {
        // Fallback — giữ nguyên defaults
      }
    }
    fetchPrices();
    // Auto-refresh mỗi 30 giây
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Real-time clock
  useEffect(() => {
    function tick() {
      const now = new Date();
      const d = String(now.getDate()).padStart(2, "0");
      const mo = String(now.getMonth() + 1).padStart(2, "0");
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setDateTime(`${d}/${mo}/${now.getFullYear()}  |  ${h}:${m}:${s}`);
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tv-display bg-theme w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden">

      {/* Double border frame */}
      <div className="absolute pointer-events-none z-[1]"
           style={{ inset: "1.5vh", border: "3px solid #c9a84c" }} />
      <div className="absolute pointer-events-none z-[1]"
           style={{ inset: "2.5vh", border: "1px solid rgba(201,168,76,0.4)" }} />

      {/* Corner decorations */}
      {[
        { pos: "top-[2.8vh] left-[2.8vh]", transform: "" },
        { pos: "top-[2.8vh] right-[2.8vh]", transform: "scaleX(-1)" },
        { pos: "bottom-[2.8vh] left-[2.8vh]", transform: "scaleY(-1)" },
        { pos: "bottom-[2.8vh] right-[2.8vh]", transform: "scale(-1)" },
      ].map((c, i) => (
        <div key={i} className={`absolute w-[5vh] h-[5vh] z-[2] ${c.pos}`}
             style={{ transform: c.transform || undefined }}>
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <path d="M5 55 L5 5 L55 5" stroke="#c9a84c" strokeWidth="2" fill="none" />
            <circle cx="5" cy="5" r="4" fill="#c9a84c" />
          </svg>
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-[3] w-full h-full flex flex-col items-center justify-center text-center gap-[1vh]"
           style={{ padding: "4vh 4vw" }}>

        {/* Shop name */}
        <div className="animate-shimmer uppercase leading-[1.1]"
             style={{
               fontFamily: "'Playfair Display', serif",
               fontSize: "6vh",
               fontWeight: 900,
               color: "#f5d27a",
               letterSpacing: "0.1em",
               textShadow: "0 0 30px rgba(245,210,122,0.5), 2px 2px 0 #7a3800",
             }}>
          Vàng Bạc Hồng Hằng
        </div>

        {/* Subtitle */}
        <div className="uppercase"
             style={{
               fontFamily: "'Playfair Display', serif",
               fontSize: "3.5vh",
               color: "#c9a84c",
               letterSpacing: "0.3em",
             }}>
          ✦ Bảng Giá Vàng ✦
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-3/4">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />
          <div className="w-2.5 h-2.5 rotate-45 shrink-0" style={{ background: "#c9a84c" }} />
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />
        </div>

        {/* DateTime */}
        <div className="font-bold text-white mb-[1vh]"
             style={{
               fontSize: "4.5vh",
               letterSpacing: "0.15em",
               textShadow: "0 0 15px rgba(255,255,255,0.4)",
             }}>
          {dateTime || "--/--/---- | --:--:--"}
        </div>

        {/* Price Table */}
        <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: "0 0.5vh" }}>
          <thead>
            <tr>
              {["Loại Vàng", "Mua Vào", "Bán Ra"].map((h, i) => (
                <th key={h}
                    className="uppercase font-bold"
                    style={{
                      background: "linear-gradient(135deg, #c9a84c, #f5d27a, #c9a84c)",
                      color: "#3d0000",
                      fontSize: "3.5vh",
                      letterSpacing: "0.15em",
                      padding: "1.2vh 2vw",
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
                <td style={{
                      padding: "1vh 2vw",
                      fontSize: "6vh",
                      fontWeight: 700,
                      color: "#f5d27a",
                      letterSpacing: "0.1em",
                      textAlign: "left",
                      borderLeft: "4px solid #c9a84c",
                      borderRadius: "8px 0 0 8px",
                      background: "rgba(201,168,76,0.08)",
                      borderTop: "1px solid rgba(201,168,76,0.15)",
                      borderBottom: "1px solid rgba(201,168,76,0.15)",
                    }}>
                  {row.name}
                </td>
                {/* Buy column */}
                <td className={row.buy ? "text-[#fff176]" : "text-white/30"}
                    style={{
                      padding: "1vh 2vw",
                      fontSize: row.buy ? "6.5vh" : "3vh",
                      fontWeight: 700,
                      textAlign: "center",
                      background: "rgba(0,0,0,0.3)",
                      borderTop: "1px solid rgba(201,168,76,0.15)",
                      borderBottom: "1px solid rgba(201,168,76,0.15)",
                    }}>
                  {row.buy ? `${formatVND(row.buy)}đ` : "—"}
                </td>
                {/* Sell column */}
                <td className={row.sell ? "text-[#66ff99]" : "text-white/30"}
                    style={{
                      padding: "1vh 2vw",
                      fontSize: row.sell ? "6.5vh" : "3vh",
                      fontWeight: 700,
                      textAlign: "center",
                      background: "rgba(0,0,0,0.3)",
                      borderRadius: "0 8px 8px 0",
                      borderRight: "3px solid rgba(201,168,76,0.3)",
                      borderTop: "1px solid rgba(201,168,76,0.15)",
                      borderBottom: "1px solid rgba(201,168,76,0.15)",
                    }}>
                  {row.sell ? `${formatVND(row.sell)}đ` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Contact info */}
        <div className="flex items-center justify-center gap-[3vw] uppercase font-bold"
             style={{
               marginTop: "0.5vh",
               marginBottom: "0.5vh",
               fontSize: "2.8vh",
               color: "#c9a84c",
               letterSpacing: "0.1em",
             }}>
          <div>
            Liên hệ:{" "}
            <span className="font-black" style={{ fontSize: "3.5vh", color: "#f5d27a", textShadow: "0 0 15px rgba(245,210,122,0.4)", marginLeft: "1vw", letterSpacing: "0.05em" }}>
              0977975626
            </span>
          </div>
          <div className="font-normal" style={{ color: "rgba(201,168,76,0.3)" }}>|</div>
          <div>
            Địa chỉ:{" "}
            <span className="font-black" style={{ fontSize: "3.5vh", color: "#f5d27a", textShadow: "0 0 15px rgba(245,210,122,0.4)", marginLeft: "1vw", letterSpacing: "0.05em" }}>
              xã Hải Lựu, tỉnh Phú Thọ
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="uppercase" style={{ fontSize: "1.8vh", color: "rgba(201,168,76,0.5)", letterSpacing: "0.2em" }}>
          Giá có thể thay đổi theo thị trường • Vui lòng liên hệ để biết thêm chi tiết
        </div>
      </div>
    </div>
  );
}
