import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { Plugin, ScriptableLineSegmentContext } from "chart.js";
import type { TvChartClientPayload } from "@/lib/load-tv-chart-payload";

/** Màu so sánh với ngày liền trước (trục X tăng dần theo thời gian) */
const DAY_CHANGE = {
  upFill: "#66ff99",
  upBorder: "#1b5e20",
  downFill: "#ff8a80",
  downBorder: "#b71c1c",
  flatFill: "#fff176",
  flatBorder: "#7a3800",
  lineUp: "rgba(102, 255, 153, 0.98)",
  lineDown: "rgba(255, 138, 128, 0.98)",
  lineFlat: "rgba(245, 210, 122, 0.95)",
} as const;

function dayDeltaKind(curr: number, prev: number): "up" | "down" | "flat" {
  if (!Number.isFinite(curr) || !Number.isFinite(prev)) return "flat";
  if (curr > prev) return "up";
  if (curr < prev) return "down";
  return "flat";
}

function pointStylesForValues(values: number[]): {
  backgrounds: string[];
  borders: string[];
} {
  const backgrounds: string[] = [];
  const borders: string[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i === 0) {
      backgrounds.push(DAY_CHANGE.flatFill);
      borders.push(DAY_CHANGE.flatBorder);
      continue;
    }
    const k = dayDeltaKind(values[i]!, values[i - 1]!);
    if (k === "up") {
      backgrounds.push(DAY_CHANGE.upFill);
      borders.push(DAY_CHANGE.upBorder);
    } else if (k === "down") {
      backgrounds.push(DAY_CHANGE.downFill);
      borders.push(DAY_CHANGE.downBorder);
    } else {
      backgrounds.push(DAY_CHANGE.flatFill);
      borders.push(DAY_CHANGE.flatBorder);
    }
  }
  return { backgrounds, borders };
}

function segmentBorderByChange(ctx: ScriptableLineSegmentContext): string {
  const v0 = Number(ctx.p0.parsed.y);
  const v1 = Number(ctx.p1.parsed.y);
  const k = dayDeltaKind(v1, v0);
  if (k === "up") return DAY_CHANGE.lineUp;
  if (k === "down") return DAY_CHANGE.lineDown;
  return DAY_CHANGE.lineFlat;
}

/** Font số — Roboto Condensed (next/font trên :root), số cân đối hơn serif trang trí */
function getNumericFontFamily(): string {
  if (typeof document === "undefined") {
    return '"Roboto Condensed", "Arial Narrow", system-ui, sans-serif';
  }
  const fromVar = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-roboto-condensed")
    .trim();
  if (fromVar.length > 0) {
    return `${fromVar}, "Roboto Condensed", system-ui, sans-serif`;
  }
  return '"Roboto Condensed", "Arial Narrow", system-ui, sans-serif';
}

function readCssFontSizePx(className: string, fallback: number): number {
  if (typeof document === "undefined") return fallback;
  const el = document.createElement("span");
  el.className = className;
  el.textContent = "0";
  el.setAttribute("aria-hidden", "true");
  el.style.cssText =
    "position:absolute;left:-9999px;top:0;visibility:hidden;pointer-events:none;white-space:nowrap;";
  document.body.appendChild(el);
  const px = parseFloat(getComputedStyle(el).fontSize) || fallback;
  el.remove();
  return px;
}

/** Rút gọn triệu: 9.000.000 → "9tr", 16.600.000 → "16,6tr" */
function formatVndTr(n: number): string {
  if (!Number.isFinite(n)) return "";
  const trieu = n / 1_000_000;
  if (trieu === 0) return "0";
  const r = Math.round(trieu * 10) / 10;
  if (Number.isInteger(r)) return `${r}tr`;
  return `${r.toFixed(1).replace(".", ",")}tr`;
}

function buildMoneyAtPointsPlugin(getLabelFontPx: () => number): Plugin<"line"> {
  return {
    id: "moneyAtPoints",
    afterDatasetsDraw(chart) {
      const data = chart.data.datasets[0]?.data;
      if (!data?.length) return;

      const meta = chart.getDatasetMeta(0);
      if (!meta?.data?.length) return;

      const fontPx = getLabelFontPx();
      const ctx = chart.ctx;
      const family = getNumericFontFamily();
      ctx.save();
      ctx.font = `600 ${fontPx}px ${family}`;
      ctx.fillStyle = "#fff176";
      ctx.textAlign = "center";

      const gap = Math.max(6, fontPx * 0.55);

      const ds = chart.data.datasets[0];
      const ptBg = ds?.pointBackgroundColor;

      meta.data.forEach((element, i) => {
        const raw = data[i];
        const v = typeof raw === "number" ? raw : Number(raw);
        if (!Number.isFinite(v)) return;
        const { x, y } = element.getProps(["x", "y"], true);
        const txt = formatVndTr(v);
        const col = Array.isArray(ptBg) ? ptBg[i] : ptBg;
        ctx.fillStyle = typeof col === "string" ? col : DAY_CHANGE.flatFill;
        const above = i % 2 === 0;
        ctx.textBaseline = above ? "bottom" : "top";
        const dy = above ? -gap : gap;
        ctx.fillText(txt, x, Math.round(y + dy));
      });

      ctx.restore();
    },
  };
}

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

let chartInstance: Chart<"line", number[], string> | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let moneyPlugin: Plugin<"line"> | null = null;

function getTvFontSizes() {
  const footer = readCssFontSizePx("text-footer", 12);
  /* Nhãn giá từng điểm — lớn hơn để dễ đọc trên TV */
  const pointLabel = Math.max(28, Math.min(72, footer * 3.2));
  return {
    legend: readCssFontSizePx("text-sub", 22),
    axis: readCssFontSizePx("text-th", 28),
    pointLabel,
  };
}

export function mountTvGoldChart(canvas: HTMLCanvasElement, payload: TvChartClientPayload): void {
  destroyTvGoldChart();
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const fs = getTvFontSizes();

  if (moneyPlugin) {
    Chart.unregister(moneyPlugin);
    moneyPlugin = null;
  }
  moneyPlugin = buildMoneyAtPointsPlugin(() => getTvFontSizes().pointLabel);
  Chart.register(moneyPlugin);

  const edgePad = Math.max(18, Math.min(64, fs.pointLabel * 1.9));

  const numFont = getNumericFontFamily();
  const pointStyles = pointStylesForValues(payload.values);

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: [...payload.labels],
      datasets: [
        {
          label: payload.title,
          data: [...payload.values],
          borderColor: DAY_CHANGE.lineFlat,
          segment: {
            borderColor: (c) => segmentBorderByChange(c),
          },
          backgroundColor: "rgba(245, 210, 122, 0.12)",
          borderWidth: Math.max(2, fs.axis / 18),
          pointRadius: Math.max(4, fs.axis / 12),
          pointHoverRadius: Math.max(6, fs.axis / 10),
          pointBackgroundColor: pointStyles.backgrounds,
          pointBorderColor: pointStyles.borders,
          pointHoverBackgroundColor: pointStyles.backgrounds,
          pointHoverBorderColor: pointStyles.borders,
          pointBorderWidth: Math.max(1, fs.axis / 28),
          tension: 0.2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        /* Không có số trục Y — thu gọn mép trái */
        padding: { top: edgePad, left: 0, right: 10, bottom: edgePad },
      },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#f5d27a",
            font: { size: fs.legend, family: "'Playfair Display', serif", weight: "bold" },
            padding: Math.max(12, fs.legend * 0.5),
          },
        },
        tooltip: { enabled: false },
        title: { display: false },
      },
      scales: {
        x: {
          ticks: {
            color: "#c9a84c",
            font: { size: fs.axis, family: numFont, weight: 600 },
            maxRotation: 45,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 16,
          },
          grid: { color: "rgba(201, 168, 76, 0.15)" },
        },
        y: {
          /* Giá đã có trên từng điểm — ẩn số trục Y */
          ticks: { display: false },
          grid: { color: "rgba(201, 168, 76, 0.12)" },
          border: { display: false },
        },
      },
    },
  });

  const refresh = async () => {
    try {
      const res = await fetch("/api/prices/history", { cache: "no-store" });
      if (!res.ok) return;
      const json = (await res.json()) as { chart?: TvChartClientPayload };
      const next = json.chart;
      if (!next || chartInstance == null || next.empty) return;
      chartInstance.data.labels = [...next.labels];
      const ds = chartInstance.data.datasets[0];
      if (ds) {
        ds.data = [...next.values];
        ds.label = next.title;
        const st = pointStylesForValues(next.values);
        ds.pointBackgroundColor = st.backgrounds;
        ds.pointBorderColor = st.borders;
        ds.pointHoverBackgroundColor = st.backgrounds;
        ds.pointHoverBorderColor = st.borders;
      }
      chartInstance.update();
    } catch {
      /* ignore */
    }
  };

  if (typeof window !== "undefined") {
    (window as Window & { __tvChartRefresh?: () => Promise<void> }).__tvChartRefresh = refresh;
  }

  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(() => {
    void refresh();
  }, 30000);
}

export function destroyTvGoldChart(): void {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  if (typeof window !== "undefined") {
    delete (window as Window & { __tvChartRefresh?: () => Promise<void> }).__tvChartRefresh;
  }
  if (moneyPlugin) {
    Chart.unregister(moneyPlugin);
    moneyPlugin = null;
  }
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}
