// Server Component — no "use client"
// All layout uses inline styles — Tailwind v4 @layer not supported in WebView 66

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
    if (error || !data) return DEFAULT_PRICES.map((p) => ({ ...p, buy: "", sell: "" }));
    return data.prices as PriceRow[];
  } catch {
    return DEFAULT_PRICES.map((p) => ({ ...p, buy: "", sell: "" }));
  }
}

function getServerTime(): string {
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
    <div
      className="bg-theme"
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "none",
      }}
    >
      {/* Double border frame */}
      <div style={{ position: "absolute", pointerEvents: "none", zIndex: 1, top: "1.5vh", right: "1.5vh", bottom: "1.5vh", left: "1.5vh", border: "3px solid #c9a84c" }} />
      <div style={{ position: "absolute", pointerEvents: "none", zIndex: 1, top: "2.5vh", right: "2.5vh", bottom: "2.5vh", left: "2.5vh", border: "1px solid rgba(201,168,76,0.4)" }} />

      {/* Main content */}
      <div
        className="tv-content"
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Shop name */}
        <div
          className="animate-shimmer text-title"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            color: "#f5d27a",
            letterSpacing: "0.1em",
            textShadow: "0 0 30px rgba(245,210,122,0.5), 2px 2px 0 #7a3800",
            textTransform: "uppercase",
            lineHeight: 1.1,
            width: "100%",
          }}
        >
          Vàng Bạc Hồng Hằng
        </div>

        {/* Header row: subtitle LEFT + clock RIGHT */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "0 0.5vw",
            marginTop: "1vh",
          }}
        >
          <div
            className="text-sub"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#ffe599",
              letterSpacing: "0.15em",
              textShadow: "0 0 10px rgba(255,229,153,0.6)",
              whiteSpace: "nowrap",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            ✦ Bảng Giá Vàng ✦
          </div>

          {/* Clock — vanilla JS, server time as fallback */}
          <div
            id="clock"
            className="text-clock"
            style={{
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.15em",
              textShadow: "0 0 15px rgba(255,255,255,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            {serverTime}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "90%",
            marginTop: "1vh",
            marginBottom: "1vh",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #c9a84c, transparent)", marginRight: "1rem" }} />
          <div style={{ width: "10px", height: "10px", background: "#c9a84c", transform: "rotate(45deg)", flexShrink: 0 }} />
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #c9a84c, transparent)", marginLeft: "1rem" }} />
        </div>

        {/* Price Table */}
        <table className="price-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 1vh" }}>
          <thead>
            <tr>
              {["Loại Vàng", "Mua Vào", "Bán Ra"].map((h, i) => (
                <th
                  key={h}
                  className="text-th tv-th"
                  style={{
                    background: "linear-gradient(135deg, #c9a84c, #f5d27a, #c9a84c)",
                    color: "#3d0000",
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    borderRadius: i === 0 ? "8px 0 0 8px" : i === 2 ? "0 8px 8px 0" : undefined,
                    textAlign: i === 0 ? "left" : "center",
                    width: i === 0 ? "30%" : undefined,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prices.map((row, idx) => (
              <tr
                key={idx}
                className="animate-row-slide"
                style={{ animationDelay: `${idx * 0.1 + 0.05}s` }}
              >
                <td
                  className="text-name tv-td"
                  style={{
                    fontWeight: 700,
                    color: "#f5d27a",
                    letterSpacing: "0.1em",
                    textAlign: "left",
                    borderLeft: "4px solid #c9a84c",
                    borderRadius: "8px 0 0 8px",
                    background: "rgba(201,168,76,0.08)",
                    borderTop: "1px solid rgba(201,168,76,0.15)",
                    borderBottom: "1px solid rgba(201,168,76,0.15)",
                  }}
                >
                  {row.name}
                </td>
                <td
                  className={row.buy ? "text-price tv-td" : "text-sub tv-td"}
                  style={{
                    fontWeight: 700,
                    textAlign: "center",
                    color: row.buy ? "#fff176" : "rgba(255,255,255,0.3)",
                    background: "rgba(0,0,0,0.3)",
                    borderTop: "1px solid rgba(201,168,76,0.15)",
                    borderBottom: "1px solid rgba(201,168,76,0.15)",
                  }}
                >
                  {row.buy ? `${formatVND(row.buy)}đ` : "—"}
                </td>
                <td
                  className={row.sell ? "text-price tv-td" : "text-sub tv-td"}
                  style={{
                    fontWeight: 700,
                    textAlign: "center",
                    color: row.sell ? "#66ff99" : "rgba(255,255,255,0.3)",
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "0 8px 8px 0",
                    borderRight: "3px solid rgba(201,168,76,0.3)",
                    borderTop: "1px solid rgba(201,168,76,0.15)",
                    borderBottom: "1px solid rgba(201,168,76,0.15)",
                  }}
                >
                  {row.sell ? `${formatVND(row.sell)}đ` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Contact info */}
        <div
          className="text-contact"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "0.5vh",
            marginBottom: "0.5vh",
            color: "#c9a84c",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <div>
            Liên hệ:{" "}
            <span className="text-contact-val" style={{ color: "#f5d27a", textShadow: "0 0 15px rgba(245,210,122,0.4)", marginLeft: "1vw", letterSpacing: "0.05em", fontWeight: 900 }}>
              0977975626
            </span>
          </div>
          <div style={{ marginLeft: "2vw", marginRight: "2vw", color: "rgba(201,168,76,0.4)" }}>|</div>
          <div>
            Địa chỉ:{" "}
            <span className="text-contact-val" style={{ color: "#f5d27a", textShadow: "0 0 15px rgba(245,210,122,0.4)", marginLeft: "1vw", letterSpacing: "0.05em", fontWeight: 900 }}>
              xã Hải Lựu, tỉnh Phú Thọ
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-footer" style={{ color: "rgba(201,168,76,0.5)", letterSpacing: "0.2em" }}>
          <i>Giá có thể thay đổi theo thị trường • Vui lòng liên hệ để biết chi tiết</i>
        </div>
      </div>

      {/* Vanilla JS clock — bypass React hydration */}
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
