// Server Component — no "use client"
export const dynamic = "force-dynamic";
// All layout uses inline styles — Tailwind v4 @layer not supported in WebView 66
// Global CSS: Next.js only allows importing ./globals.css from the root layout (app/layout.tsx).
// Do not import globals here — styles still apply to this page via <body> in layout.

import { headers } from "next/headers";
import { formatVND } from "@/lib/utils";
import { type PriceRow } from "@/types/prices";
import { DEFAULT_PRICES } from "@/configs/prices";
import { loadTvChartHistory } from "@/lib/load-tv-chart-payload";
import "./index.css";

async function fetchPrices(): Promise<PriceRow[]> {
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
    if (!host) return DEFAULT_PRICES.map((p) => ({ ...p, buy: "", sell: "" }));

    const res = await fetch(`${protocol}://${host}/api/prices`, { cache: "no-store" });
    if (!res.ok) return DEFAULT_PRICES.map((p) => ({ ...p, buy: "", sell: "" }));

    const data = await res.json();
    if (!data?.prices || !Array.isArray(data.prices)) {
      return DEFAULT_PRICES.map((p) => ({ ...p, buy: "", sell: "" }));
    }

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
  const { chart: chartPayload } = await loadTvChartHistory();
  const serverTime = getServerTime();

  return (
    <div
      className="bg-theme"
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
        cursor: "none",
      }}
    >
      {/* Double border frame */}
      <div style={{ position: "absolute", pointerEvents: "none", zIndex: 1, top: "1.5vh", right: "1.5vh", bottom: "1.5vh", left: "1.5vh", border: "3px solid #c9a84c" }} />
      <div style={{ position: "absolute", pointerEvents: "none", zIndex: 1, top: "2.5vh", right: "2.5vh", bottom: "2.5vh", left: "2.5vh", border: "1px solid rgba(201,168,76,0.4)" }} />

      {/*
        Main content — grid with 4 explicit rows:
          auto  → shop title
          auto  → header (subtitle + clock)
          auto  → divider
          1fr   → slides section (table ↔ chart), fills all remaining height
        Height: 100vh so the 1fr row resolves to a concrete px value on WebView 66.
      */}
      <div
        className="tv-content"
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          height: "100vh",
          boxSizing: "border-box",
          textAlign: "center",
          display: "grid",
          gridTemplateColumns: "1fr",
          gridTemplateRows: "auto auto auto 1fr",
          alignItems: "start",
          justifyItems: "center",
        }}
      >
        {/* Row 1 — Shop name */}
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
            paddingTop: "1.2vh",
          }}
        >
          Vàng Bạc Hồng Hằng
        </div>

        {/* Row 2 — Subtitle LEFT + clock RIGHT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            justifyContent: "space-between",
            alignItems: "center",
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

          {/* Clock — vanilla JS updates this, server time as SSR fallback */}
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

        {/* Row 3 — Divider */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            width: "90%",
            marginTop: "1vh",
            marginBottom: "0.5vh",
          }}
        >
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #c9a84c, transparent)", marginRight: "1rem" }} />
          <div style={{ width: "10px", height: "10px", background: "#c9a84c", transform: "rotate(45deg)" }} />
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #c9a84c, transparent)", marginLeft: "1rem" }} />
        </div>

        {/*
          Row 4 (1fr) — Slides container.
          position:relative so absolute children fill this exact area.
          height:100% resolves correctly because the grid row is 1fr of a 100vh parent.
        */}
        <div
          id="tv-tuning"
          data-slide-interval={String(chartPayload.slideIntervalSec)}
          style={{ display: "none" }}
          aria-hidden
        />
        <div
          id="tv-chart-initial"
          style={{ display: "none" }}
          aria-hidden
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(chartPayload).replace(/</g, "\\u003c"),
          }}
        />
        <div
          className="tv-slides-stack"
          style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
        >
          {/* Slide: Price Table */}
          <div
            id="slide-table"
            className="tv-slide-panel tv-slide-panel-active"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "1fr auto auto",
              alignItems: "center",
              justifyItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Table fills the 1fr row */}
            <table className="price-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 1vh", alignSelf: "center" }}>
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
                      data-row={idx}
                      data-field="buy"
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
                      data-row={idx}
                      data-field="sell"
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
                display: "grid",
                gridTemplateColumns: "auto auto auto",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginTop: "0.5vh",
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
            <div className="text-footer" style={{ color: "rgba(201,168,76,0.5)", letterSpacing: "0.2em", width: "100%", marginBottom: "0.5vh" }}>
              <i>Giá có thể thay đổi theo thị trường • Vui lòng liên hệ để biết chi tiết</i>
            </div>
          </div>

          {/* Slide: Chart */}
          <div
            id="slide-chart"
            className="tv-slide-panel tv-slide-panel-inactive tv-slide-chart"
          >
            {!chartPayload.empty ? (
              <div
                className="text-sub tv-chart-legend-hint"
                style={{ fontFamily: "'Playfair Display', serif", color: "rgba(201,168,76,0.95)", fontWeight: 600 }}
              >
                <span style={{ color: "#66ff99" }} aria-hidden>●</span>{" "}
                Tăng so với ngày trước &nbsp;·&nbsp;{" "}
                <span style={{ color: "#ff8a80" }} aria-hidden>●</span>{" "}
                Giảm &nbsp;·&nbsp;{" "}
                <span style={{ color: "#fff176" }} aria-hidden>●</span>{" "}
                Không đổi / ngày đầu dãy
              </div>
            ) : null}
            <div className="tv-chart-wrap">
              {chartPayload.empty ? (
                <div id="tv-chart-empty" className="tv-chart-empty">
                  Chưa đủ dữ liệu lịch sử để vẽ biểu đồ
                  <br />
                  <span style={{ fontSize: "0.85em", opacity: 0.85 }}>Lưu giá từ admin để tích lũy điểm theo ngày</span>
                </div>
              ) : (
                <canvas id="tv-gold-price-chart" />
              )}
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: "try{window.__tvJsOk=1}catch(e){}" }} />
      <script defer src="/scripts/chart.min.js" />
      <script defer src="/scripts/bang-gia-vang-tv.js" />
    </div>
  );
}
