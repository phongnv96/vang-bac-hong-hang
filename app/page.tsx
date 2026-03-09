// Server Component — no "use client"
// Fetches prices + time server-side → works even if JS is disabled on TV Box

import { supabase } from "./lib/supabase";
import { DEFAULT_PRICES, formatVND, type PriceRow } from "./lib/prices";

async function fetchPrices(): Promise<PriceRow[]> {
  try {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const today = `${y}-${m}-${d}`;

    const { data, error } = await supabase
      .from("gold_prices")
      .select("prices")
      .eq("date", today)
      .single();

    if (error || !data) {
      return DEFAULT_PRICES.map((p) => ({ ...p, buy: "", sell: "" }));
    }
    return data.prices as PriceRow[];
  } catch {
    return DEFAULT_PRICES.map((p) => ({ ...p, buy: "", sell: "" }));
  }
}

function getServerTime(): string {
  // Server time in Vietnam timezone (UTC+7)
  const now = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const d = String(now.getUTCDate()).padStart(2, "0");
  const mo = String(now.getUTCMonth() + 1).padStart(2, "0");
  const h = String(now.getUTCHours()).padStart(2, "0");
  const mi = String(now.getUTCMinutes()).padStart(2, "0");
  const s = String(now.getUTCSeconds()).padStart(2, "0");
  return `${d}/${mo}/${now.getUTCFullYear()}  |  ${h}:${mi}:${s}`;
}

export default async function Home() {
  const prices = await fetchPrices();
  const serverTime = getServerTime();

  return (
    <div className="tv-display bg-theme w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden">

      {/* Auto-refresh every 30s — works without JS */}
      <meta httpEquiv="refresh" content="30" />

      {/* Double border frame — dùng top/right/bottom/left thay vì inset (inset không support WebView 66) */}
      <div className="absolute pointer-events-none z-[1]"
           style={{ top: "1.5vh", right: "1.5vh", bottom: "1.5vh", left: "1.5vh", border: "3px solid #c9a84c" }} />
      <div className="absolute pointer-events-none z-[1]"
           style={{ top: "2.5vh", right: "2.5vh", bottom: "2.5vh", left: "2.5vh", border: "1px solid rgba(201,168,76,0.4)" }} />

      {/* Main content */}
      <div className="relative z-[3] w-full min-h-screen flex flex-col items-center justify-center text-center gap-2 md:gap-[1vh] tv-content">

        {/* Shop name */}
        <div className="animate-shimmer uppercase leading-[1.1] text-title"
             style={{
               fontFamily: "'Playfair Display', serif",
               fontWeight: 900,
               color: "#f5d27a",
               letterSpacing: "0.1em",
               textShadow: "0 0 30px rgba(245,210,122,0.5), 2px 2px 0 #7a3800",
             }}>
          Vàng Bạc Hồng Hằng
        </div>

        {/* Header: subtitle + clock */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full px-2 mt-2 gap-y-1 xl:gap-y-0">

          {/* Subtitle */}
          <div className="uppercase text-sub mb-1 xl:mb-0"
               style={{
                 fontFamily: "'Playfair Display', serif",
                 color: "#ffe599",
                 letterSpacing: "0.15em",
                 textShadow: "0 0 10px rgba(255,229,153,0.6)",
                 whiteSpace: "nowrap",
               }}>
            ✦ Bảng Giá Vàng ✦
          </div>

          {/* Clock — vanilla JS tick, server time là fallback nếu JS không chạy */}
          <div
            id="clock"
            className="font-bold text-white mb-2 xl:mb-0 md:mb-[1vh] text-clock"
            style={{
              letterSpacing: "0.15em",
              textShadow: "0 0 15px rgba(255,255,255,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            {serverTime}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-[90%] md:w-3/4 mb-2 md:mb-[1vh]">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 rotate-45 shrink-0" style={{ background: "#c9a84c" }} />
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />
        </div>

        {/* Price Table */}
        <table className="w-full price-table">
          <thead>
            <tr>
              {["Loại Vàng", "Mua Vào", "Bán Ra"].map((h, i) => (
                <th key={h}
                    className="uppercase font-bold text-th tv-th"
                    style={{
                      background: "linear-gradient(135deg, #c9a84c, #f5d27a, #c9a84c)",
                      color: "#3d0000",
                      letterSpacing: "0.15em",
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
                <td className="text-name tv-td" style={{
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
                <td className={`${row.buy ? "text-price text-[#fff176]" : "text-sub text-white/30"} tv-td`}
                    style={{
                      fontWeight: 700,
                      textAlign: "center",
                      background: "rgba(0,0,0,0.3)",
                      borderTop: "1px solid rgba(201,168,76,0.15)",
                      borderBottom: "1px solid rgba(201,168,76,0.15)",
                    }}>
                  {row.buy ? `${formatVND(row.buy)}đ` : "—"}
                </td>
                {/* Sell column */}
                <td className={`${row.sell ? "text-price text-[#66ff99]" : "text-sub text-white/30"} tv-td`}
                    style={{
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-[3vw] uppercase font-bold text-contact"
             style={{
               marginTop: "0.5vh",
               marginBottom: "0.5vh",
               color: "#c9a84c",
               letterSpacing: "0.1em",
             }}>
          <div>
            Liên hệ:{" "}
            <span className="font-black text-contact-val" style={{ color: "#f5d27a", textShadow: "0 0 15px rgba(245,210,122,0.4)", marginLeft: "1vw", letterSpacing: "0.05em" }}>
              0977975626
            </span>
          </div>
          <div className="font-normal hidden sm:block" style={{ color: "rgba(201,168,76,0.3)" }}>|</div>
          <div>
            Địa chỉ:{" "}
            <span className="font-black text-contact-val" style={{ color: "#f5d27a", textShadow: "0 0 15px rgba(245,210,122,0.4)", marginLeft: "1vw", letterSpacing: "0.05em" }}>
              xã Hải Lựu, tỉnh Phú Thọ
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-footer" style={{ color: "rgba(201,168,76,0.5)", letterSpacing: "0.2em" }}>
          <i>Giá có thể thay đổi theo thị trường • Vui lòng liên hệ để biết chi tiết</i>
        </div>
      </div>

      {/* Vanilla JS clock — bypass React hydration hoàn toàn */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          function tick() {
            var now = new Date();
            var d = String(now.getDate()).padStart(2, '0');
            var mo = String(now.getMonth() + 1).padStart(2, '0');
            var h = String(now.getHours()).padStart(2, '0');
            var m = String(now.getMinutes()).padStart(2, '0');
            var s = String(now.getSeconds()).padStart(2, '0');
            var el = document.getElementById('clock');
            if (el) el.textContent = d + '/' + mo + '/' + now.getFullYear() + '  |  ' + h + ':' + m + ':' + s;
          }
          tick();
          setInterval(tick, 1000);
        })();
      ` }} />
    </div>
  );
}
