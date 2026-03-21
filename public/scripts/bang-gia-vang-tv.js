/**
 * Bảng giá TV: đồng hồ, poll giá, luân phiên slide, biểu đồ Chart.js (DOM + script thuần, WebView 66).
 * Không phụ thuộc bundle React — Chart tải từ /scripts/chart-3.9.1.min.js
 */
(function () {
  if (typeof window !== "undefined" && window.__tvBangGiaVanInit) {
    return;
  }
  if (typeof window !== "undefined") {
    window.__tvBangGiaVanInit = true;
  }

  var DAY_CHANGE = {
    upFill: "#66ff99",
    upBorder: "#1b5e20",
    downFill: "#ff8a80",
    downBorder: "#b71c1c",
    flatFill: "#fff176",
    flatBorder: "#7a3800",
    lineUp: "rgba(102, 255, 153, 0.98)",
    lineDown: "rgba(255, 138, 128, 0.98)",
    lineFlat: "rgba(245, 210, 122, 0.95)",
  };

  var chartInstance = null;
  var moneyPlugin = null;

  function formatVND(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function dayDeltaKind(curr, prev) {
    if (typeof curr !== "number" || !isFinite(curr) || typeof prev !== "number" || !isFinite(prev)) {
      return "flat";
    }
    if (curr > prev) return "up";
    if (curr < prev) return "down";
    return "flat";
  }

  function pointStylesForValues(values) {
    var backgrounds = [];
    var borders = [];
    var i;
    for (i = 0; i < values.length; i++) {
      if (i === 0) {
        backgrounds.push(DAY_CHANGE.flatFill);
        borders.push(DAY_CHANGE.flatBorder);
        continue;
      }
      var k = dayDeltaKind(values[i], values[i - 1]);
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
    return { backgrounds: backgrounds, borders: borders };
  }

  function segmentBorderByChange(ctx) {
    var v0 = Number(ctx.p0.parsed.y);
    var v1 = Number(ctx.p1.parsed.y);
    var k = dayDeltaKind(v1, v0);
    if (k === "up") return DAY_CHANGE.lineUp;
    if (k === "down") return DAY_CHANGE.lineDown;
    return DAY_CHANGE.lineFlat;
  }

  function getNumericFontFamily() {
    var fromVar = "";
    try {
      fromVar = (getComputedStyle(document.documentElement).getPropertyValue("--font-roboto-condensed") || "").trim();
    } catch (e) {}
    if (fromVar.length > 0) {
      return fromVar + ', "Roboto Condensed", system-ui, sans-serif';
    }
    return '"Roboto Condensed", "Arial Narrow", system-ui, sans-serif';
  }

  function readCssFontSizePx(className, fallback) {
    var el = document.createElement("span");
    el.className = className;
    el.textContent = "0";
    el.setAttribute("aria-hidden", "true");
    el.style.cssText =
      "position:absolute;left:-9999px;top:0;visibility:hidden;pointer-events:none;white-space:nowrap;";
    document.body.appendChild(el);
    var px = parseFloat(getComputedStyle(el).fontSize) || fallback;
    el.parentNode.removeChild(el);
    return px;
  }

  function formatVndTr(n) {
    if (typeof n !== "number" || !isFinite(n)) return "";
    var trieu = n / 1000000;
    if (trieu === 0) return "0";
    var r = Math.round(trieu * 10) / 10;
    if (r === Math.floor(r)) return r + "tr";
    return r.toFixed(1).replace(".", ",") + "tr";
  }

  function getTvFontSizes() {
    var footer = readCssFontSizePx("text-footer", 12);
    var pointLabel = Math.max(28, Math.min(72, footer * 3.2));
    return {
      legend: readCssFontSizePx("text-sub", 22),
      axis: readCssFontSizePx("text-th", 28),
      pointLabel: pointLabel,
    };
  }

  function buildMoneyAtPointsPlugin(getLabelFontPx) {
    return {
      id: "moneyAtPoints",
      afterDatasetsDraw: function (chart) {
        var ds0 = chart.data.datasets[0];
        var data = ds0 && ds0.data;
        if (!data || !data.length) return;

        var meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data || !meta.data.length) return;

        var fontPx = getLabelFontPx();
        var ctx = chart.ctx;
        var family = getNumericFontFamily();
        ctx.save();
        ctx.font = "600 " + fontPx + "px " + family;
        ctx.fillStyle = "#fff176";
        ctx.textAlign = "center";

        var gap = Math.max(6, fontPx * 0.55);
        var ptBg = ds0.pointBackgroundColor;

        meta.data.forEach(function (element, i) {
          var raw = data[i];
          var v = typeof raw === "number" ? raw : Number(raw);
          if (!isFinite(v)) return;
          var xy = element.getProps(["x", "y"], true);
          var x = xy.x;
          var y = xy.y;
          var txt = formatVndTr(v);
          var col = Array.isArray(ptBg) ? ptBg[i] : ptBg;
          ctx.fillStyle = typeof col === "string" ? col : DAY_CHANGE.flatFill;
          var above = i % 2 === 0;
          ctx.textBaseline = above ? "bottom" : "top";
          var dy = above ? -gap : gap;
          ctx.fillText(txt, x, Math.round(y + dy));
        });

        ctx.restore();
      },
    };
  }

  function destroyTvGoldChart() {
    if (typeof window !== "undefined") {
      try {
        delete window.__tvChartRefresh;
      } catch (e) {}
    }
    if (moneyPlugin && typeof Chart !== "undefined" && Chart.unregister) {
      Chart.unregister(moneyPlugin);
      moneyPlugin = null;
    }
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }

  function mountTvGoldChart(canvas, payload) {
    destroyTvGoldChart();
    var ctx = canvas.getContext("2d");
    if (!ctx || typeof Chart === "undefined") return;

    var fs = getTvFontSizes();

    moneyPlugin = buildMoneyAtPointsPlugin(function () {
      return getTvFontSizes().pointLabel;
    });
    Chart.register(moneyPlugin);

    var edgePad = Math.max(18, Math.min(64, fs.pointLabel * 1.9));
    var numFont = getNumericFontFamily();
    var pointStyles = pointStylesForValues(payload.values);

    function bumpChartLayout() {
      if (!chartInstance || !chartInstance.resize) return;
      var c = chartInstance.canvas;
      var wrap = c && c.parentElement;
      if (wrap) {
        var h = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 600;
        var minPx = Math.max(280, Math.round(h * 0.34));
        if (wrap.offsetHeight < 120 || wrap.clientHeight < 120) {
          wrap.style.minHeight = minPx + "px";
        }
      }
      chartInstance.resize();
    }

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: payload.labels.slice(),
        datasets: [
          {
            label: payload.title,
            data: payload.values.slice(),
            borderColor: DAY_CHANGE.lineFlat,
            segment: {
              borderColor: function (c) {
                return segmentBorderByChange(c);
              },
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
            ticks: { display: false },
            grid: { color: "rgba(201, 168, 76, 0.12)" },
            border: { display: false },
          },
        },
      },
    });

    var refresh = function () {
      return fetch("/api/prices/history", { cache: "no-store" })
        .then(function (res) {
          if (!res.ok) return null;
          return res.json();
        })
        .then(function (json) {
          if (!json || !json.chart || chartInstance === null || json.chart.empty) return;
          var next = json.chart;
          chartInstance.data.labels = next.labels.slice();
          var ds = chartInstance.data.datasets[0];
          if (ds) {
            ds.data = next.values.slice();
            ds.label = next.title;
            var st = pointStylesForValues(next.values);
            ds.pointBackgroundColor = st.backgrounds;
            ds.pointBorderColor = st.borders;
            ds.pointHoverBackgroundColor = st.backgrounds;
            ds.pointHoverBorderColor = st.borders;
          }
          chartInstance.update();
        })
        .catch(function () {});
    };

    window.__tvChartRefresh = refresh;

    bumpChartLayout();
    setTimeout(bumpChartLayout, 50);
    setTimeout(bumpChartLayout, 300);
    setTimeout(bumpChartLayout, 1000);
  }

  function parseInitialChartPayload() {
    var el = document.getElementById("tv-chart-initial");
    if (!el) return null;
    var raw = (el.textContent || el.innerText || "").trim();
    if (!raw && el.innerHTML) {
      raw = String(el.innerHTML).trim();
    }
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function ensureChartJs(callback) {
    if (typeof Chart !== "undefined" && Chart && typeof Chart.register === "function") {
      callback();
      return;
    }
    var existing = document.getElementById("tv-chart-js");
    if (existing) {
      if (existing.getAttribute("data-loaded") === "1") {
        callback();
        return;
      }
      existing.addEventListener("load", function () {
        callback();
      });
      existing.addEventListener("error", function () {
        callback();
      });
      return;
    }
    var s = document.createElement("script");
    s.id = "tv-chart-js";
    /* false: WebView cũ thường chạy theo thứ tự thêm vào, tránh init chart trước khi Chart global có */
    s.async = false;
    s.src = "/scripts/chart-3.9.1.min.js";
    s.onload = function () {
      s.setAttribute("data-loaded", "1");
      callback();
    };
    s.onerror = function () {
      callback();
    };
    document.head.appendChild(s);
  }

  function initTvChartIfNeeded() {
    var canvas = document.getElementById("tv-gold-price-chart");
    if (!canvas) return;

    function tryMount(payload) {
      if (!payload || payload.empty) return;
      ensureChartJs(function () {
        if (typeof Chart === "undefined") {
          window.__tvChartDiag = "chart.js not loaded";
          return;
        }
        try {
          mountTvGoldChart(canvas, payload);
          window.__tvChartDiag = "ok";
        } catch (e) {
          window.__tvChartDiag = e && e.message ? e.message : String(e);
        }
      });
    }

    var payload = parseInitialChartPayload();
    if (payload && !payload.empty) {
      tryMount(payload);
      return;
    }

    fetch("/api/prices/history", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (json) {
        if (json && json.chart && !json.chart.empty) {
          tryMount(json.chart);
        } else if (!window.__tvChartDiag) {
          window.__tvChartDiag = payload ? "empty series" : "no embedded payload";
        }
      })
      .catch(function () {
        if (!window.__tvChartDiag) window.__tvChartDiag = "history fetch failed";
      });
  }

  var slideSec = 300;
  var tun = document.getElementById("tv-tuning");
  if (tun) {
    var attr = tun.getAttribute("data-slide-interval");
    if (attr) {
      var parsed = parseInt(attr, 10);
      if (!isNaN(parsed) && parsed >= 60) slideSec = parsed;
    }
  }

  var showTable = false;
  function applySlides() {
    var t = document.getElementById("slide-table");
    var c = document.getElementById("slide-chart");
    if (!t || !c) return;
    var active = "tv-slide-panel-active";
    var inactive = "tv-slide-panel-inactive";
    if (showTable) {
      t.classList.add(active);
      t.classList.remove(inactive);
      c.classList.add(inactive);
      c.classList.remove(active);
    } else {
      c.classList.add(active);
      c.classList.remove(inactive);
      t.classList.add(inactive);
      t.classList.remove(active);
    }
  }
  applySlides();
  // setInterval(function () {
  //   showTable = !showTable;
  //   applySlides();
  // }, slideSec * 1000);

  function pad2(n) {
    var s = String(n);
    return s.length < 2 ? "0" + s : s;
  }

  function tick() {
    var now = new Date();
    var d = pad2(now.getDate());
    var mo = pad2(now.getMonth() + 1);
    var h = pad2(now.getHours());
    var m = pad2(now.getMinutes());
    var s = pad2(now.getSeconds());
    var el = document.getElementById("clock");
    if (el) el.textContent = d + "/" + mo + "/" + now.getFullYear() + "  |  " + h + ":" + m + ":" + s;
  }

  function updatePriceCells(prices) {
    if (!Array.isArray(prices)) return;
    for (var i = 0; i < prices.length; i++) {
      var row = prices[i] || {};
      var buyCell = document.querySelector('[data-row="' + i + '"][data-field="buy"]');
      var sellCell = document.querySelector('[data-row="' + i + '"][data-field="sell"]');

      if (buyCell) buyCell.textContent = row.buy ? formatVND(row.buy) + "đ" : "—";
      if (sellCell) sellCell.textContent = row.sell ? formatVND(row.sell) + "đ" : "—";
    }
  }

  async function loadPrices() {
    try {
      var res = await fetch("/api/prices", { cache: "no-store" });
      if (!res.ok) return;
      var data = await res.json();
      updatePriceCells(data && data.prices);
    } catch (e) {}
    try {
      if (window.__tvChartRefresh) {
        await window.__tvChartRefresh();
      }
    } catch (e2) {}
  }

  tick();
  loadPrices();
  setInterval(tick, 1000);
  setInterval(loadPrices, 30000);

  initTvChartIfNeeded();
})();
