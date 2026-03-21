/**
 * Bảng giá TV: đồng hồ, poll giá, luân phiên slide, biểu đồ giá (Canvas 2D thuần — tương thích WebView Android ~66, không Chart.js).
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

  /** Trạng thái chart canvas (không dùng Chart.js) */
  var tvChartState = {
    canvas: null,
    payload: null,
    onResize: null,
    bumpTimer: null,
  };

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

  function segmentLineColor(v0, v1) {
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
    try {
      if (!document.body) return fallback;
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
    } catch (e) {
      return fallback;
    }
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

  function clonePayload(payload) {
    return {
      labels: payload.labels ? payload.labels.slice() : [],
      values: payload.values ? payload.values.slice() : [],
      title: payload.title || "",
      empty: !!payload.empty,
    };
  }

  function measureCanvasCssSize(canvas, payload) {
    var wrap = canvas.parentElement;
    var w = wrap ? wrap.clientWidth : 0;
    var h = wrap ? wrap.clientHeight : 0;
    if (w < 80) {
      w = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 800;
      w = Math.min(w - 32, 1200);
    }
    if (h < 80) {
      var ih = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 600;
      /* Ưu tiên chart cao trên TV (trước ~34% viewport → ~48%) */
      h = Math.max(520, Math.round(ih * 0.58));
    }
    return { w: Math.floor(w), h: Math.floor(h) };
  }

  function drawTvGoldCanvas(canvas, payload) {
    var ctx = canvas.getContext("2d");
    if (!ctx || !payload || payload.empty) return;

    var values = payload.values;
    var labels = payload.labels;
    var n = values.length;
    if (!n) return;

    var size = measureCanvasCssSize(canvas, payload);
    var cw = size.w;
    var ch = size.h;
    var dpr = window.devicePixelRatio || 1;
    if (dpr < 1) dpr = 1;

    canvas.width = Math.floor(cw * dpr);
    canvas.height = Math.floor(ch * dpr);
    canvas.style.width = cw + "px";
    canvas.style.height = ch + "px";
    canvas.style.display = "block";
    canvas.style.visibility = "visible";
    canvas.style.opacity = "1";

    try {
      if (ctx.setTransform) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      ctx.scale(dpr, dpr);
    } catch (eTransform) {
      try {
        ctx.scale(dpr, dpr);
      } catch (e2) {}
    }

    var fs = getTvFontSizes();
    var numFontEarly = getNumericFontFamily();
    var titleBlock = Math.max(36, fs.legend * 2);
    var sidePad = 16;

    /* Bề rộng nhãn giá (…tr) — tránh cắt ở điểm đầu/cuối */
    ctx.font = "600 " + fs.pointLabel + "px " + numFontEarly;
    var priceLabelMaxW = 0;
    var pi;
    for (pi = 0; pi < n; pi++) {
      var pw = ctx.measureText(formatVndTr(Number(values[pi]))).width;
      if (pw > priceLabelMaxW) priceLabelMaxW = pw;
    }
    if (priceLabelMaxW < 1) priceLabelMaxW = fs.pointLabel * 4;
    var lrInset = Math.min(Math.ceil(priceLabelMaxW * 0.55) + 14, Math.floor(cw * 0.22));

    /* Nhãn ngày nằm ngang — cần đủ cao chân chart */
    ctx.font = "600 " + fs.axis + "px " + numFontEarly;
    var dateLineH = Math.ceil(fs.axis * 1.35) + 8;
    var bottomAxis = Math.max(58, dateLineH + 26);

    /* Chừa chỗ phía trên plot cho nhãn giá lệch lên */
    var labelPad = Math.max(Math.round(fs.pointLabel * 1.45), Math.round(priceLabelMaxW * 0.35) + 28);

    var plotLeft = sidePad + lrInset;
    var plotRight = cw - sidePad - lrInset;
    var plotTop = titleBlock + labelPad;
    var plotBottom = ch - bottomAxis;
    var plotW = plotRight - plotLeft;
    var plotH = plotBottom - plotTop;
    if (plotW < 30 || plotH < 30) return;

    var vmin = Infinity;
    var vmax = -Infinity;
    var i;
    for (i = 0; i < n; i++) {
      var vv = Number(values[i]);
      if (isFinite(vv)) {
        if (vv < vmin) vmin = vv;
        if (vv > vmax) vmax = vv;
      }
    }
    if (!isFinite(vmin) || !isFinite(vmax)) return;
    if (vmin === vmax) {
      vmin -= 1;
      vmax += 1;
    }
    var vSpan = vmax - vmin;
    /* Padding trục Y vừa đủ: đường dùng gần hết chiều cao vùng vẽ (không kéo “rộng” mốc tiền) */
    var vpadEach = vSpan * 0.018;
    vmin -= vpadEach;
    vmax += vpadEach;
    vSpan = vmax - vmin || 1;

    function xAt(index) {
      if (n <= 1) return plotLeft + plotW / 2;
      return plotLeft + (plotW * index) / (n - 1);
    }
    function yAt(v) {
      return plotTop + ((vmax - v) / vSpan) * plotH;
    }

    var pts = [];
    for (i = 0; i < n; i++) {
      var nv = Number(values[i]);
      pts.push({ x: xAt(i), y: yAt(nv), v: nv });
    }

    var styles = pointStylesForValues(values);
    var numFont = numFontEarly;

    ctx.clearRect(0, 0, cw, ch);

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = "bold " + fs.legend + "px 'Playfair Display', Georgia, serif";
    ctx.fillStyle = "#f5d27a";
    ctx.fillText(payload.title, cw / 2, 6);

    ctx.strokeStyle = "rgba(201, 168, 76, 0.12)";
    ctx.lineWidth = 1;
    var gn;
    for (gn = 0; gn <= 4; gn++) {
      var gy = plotTop + (plotH * gn) / 4;
      ctx.beginPath();
      ctx.moveTo(plotLeft, gy);
      ctx.lineTo(plotRight, gy);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(201, 168, 76, 0.1)";
    var vx;
    for (vx = 0; vx <= 6; vx++) {
      var gx = plotLeft + (plotW * vx) / 6;
      ctx.beginPath();
      ctx.moveTo(gx, plotTop);
      ctx.lineTo(gx, plotBottom);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(pts[0].x, plotBottom);
    for (i = 0; i < n; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.lineTo(pts[n - 1].x, plotBottom);
    ctx.closePath();
    ctx.fillStyle = "rgba(245, 210, 122, 0.14)";
    ctx.fill();

    var lw = Math.max(2, Math.round(fs.axis / 16));
    ctx.lineWidth = lw;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (i = 0; i < n - 1; i++) {
      ctx.strokeStyle = segmentLineColor(pts[i].v, pts[i + 1].v);
      ctx.beginPath();
      ctx.moveTo(pts[i].x, pts[i].y);
      ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
      ctx.stroke();
    }

    var pr = Math.max(4, Math.round(fs.axis / 11));
    var pbw = Math.max(1, Math.round(lw / 2));
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, pr, 0, Math.PI * 2);
      ctx.fillStyle = styles.backgrounds[i];
      ctx.fill();
      ctx.strokeStyle = styles.borders[i];
      ctx.lineWidth = pbw;
      ctx.stroke();
    }

    ctx.font = "600 " + fs.pointLabel + "px " + numFont;
    ctx.textAlign = "center";
    var gap = Math.max(8, fs.pointLabel * 0.55);
    var lowBand = plotTop + plotH * 0.68;
    var highBand = plotTop + plotH * 0.32;
    for (i = 0; i < n; i++) {
      if (!isFinite(pts[i].v)) continue;
      var txt = formatVndTr(pts[i].v);
      ctx.fillStyle = styles.backgrounds[i];
      var py = pts[i].y;
      var above;
      if (py >= lowBand) {
        above = true;
      } else if (py <= highBand) {
        above = false;
      } else {
        above = i % 2 === 0;
      }
      ctx.textBaseline = above ? "bottom" : "top";
      var dy = above ? -gap : gap;
      ctx.fillText(txt, pts[i].x, Math.round(py + dy));
    }

    /* Trục X: chữ ngang, bước theo chỗ trống để không đè nhau */
    ctx.fillStyle = "#c9a84c";
    ctx.font = "600 " + fs.axis + "px " + numFont;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    var minDateGap = ctx.measureText("99/99").width + 14;
    var ui;
    for (ui = 0; ui < n; ui++) {
      var uw = ctx.measureText(labels[ui] != null ? String(labels[ui]) : "").width + 14;
      if (uw > minDateGap) minDateGap = uw;
    }
    var maxSlots = Math.max(2, Math.floor(plotW / minDateGap));
    var dateStep = Math.max(1, Math.ceil(n / maxSlots));
    var dateY = plotBottom + 14;
    var drawnDates = [];
    for (i = 0; i < n; i += dateStep) {
      drawnDates.push(i);
    }
    if (n > 1 && drawnDates[drawnDates.length - 1] !== n - 1) {
      var lastI = n - 1;
      var prevIx = drawnDates[drawnDates.length - 1];
      if (pts[lastI].x - pts[prevIx].x >= minDateGap * 0.85) {
        drawnDates.push(lastI);
      } else if (drawnDates.length > 1) {
        drawnDates[drawnDates.length - 1] = lastI;
      } else {
        drawnDates.push(lastI);
      }
    }
    for (i = 0; i < drawnDates.length; i++) {
      var di = drawnDates[i];
      var dlab = labels[di] != null ? String(labels[di]) : "";
      ctx.fillText(dlab, pts[di].x, dateY);
    }
  }

  function destroyTvGoldChart() {
    if (typeof window !== "undefined") {
      try {
        delete window.__tvChartRefresh;
      } catch (e) {}
      try {
        delete window.__tvChartRedraw;
      } catch (eDel) {}
    }
    if (tvChartState.onResize && window.removeEventListener) {
      window.removeEventListener("resize", tvChartState.onResize, false);
    }
    tvChartState.onResize = null;
    if (tvChartState.bumpTimer) {
      clearTimeout(tvChartState.bumpTimer);
      tvChartState.bumpTimer = null;
    }
    tvChartState.canvas = null;
    tvChartState.payload = null;
  }

  function mountTvGoldChart(canvas, payload) {
    destroyTvGoldChart();
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    tvChartState.canvas = canvas;
    tvChartState.payload = clonePayload(payload);

    function bumpLayout() {
      var wrap = canvas.parentElement;
      if (wrap) {
        var ih = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 600;
        var minPx = Math.max(520, Math.round(ih * 0.58));
        if (wrap.offsetHeight < minPx * 0.85 || wrap.clientHeight < minPx * 0.85) {
          wrap.style.minHeight = minPx + "px";
        }
      }
      if (tvChartState.canvas && tvChartState.payload) {
        drawTvGoldCanvas(tvChartState.canvas, tvChartState.payload);
      }
    }

    function onResize() {
      if (tvChartState.bumpTimer) clearTimeout(tvChartState.bumpTimer);
      tvChartState.bumpTimer = setTimeout(function () {
        tvChartState.bumpTimer = null;
        bumpLayout();
      }, 100);
    }

    tvChartState.onResize = onResize;
    if (window.addEventListener) {
      window.addEventListener("resize", onResize, false);
    }

    bumpLayout();
    setTimeout(bumpLayout, 50);
    setTimeout(bumpLayout, 300);
    setTimeout(bumpLayout, 1000);

    window.__tvChartRefresh = function () {
      return fetch("/api/prices/history")
        .then(function (res) {
          if (!res.ok) return null;
          return res.json();
        })
        .then(function (json) {
          if (!json || !json.chart || json.chart.empty) return;
          if (!tvChartState.canvas) return;
          tvChartState.payload = clonePayload(json.chart);
          drawTvGoldCanvas(tvChartState.canvas, tvChartState.payload);
        })
        .catch(function () {});
    };

    window.__tvChartRedraw = function () {
      if (tvChartState.canvas && tvChartState.payload) {
        try {
          drawTvGoldCanvas(tvChartState.canvas, tvChartState.payload);
        } catch (eR) {}
      }
    };
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

  function initTvChartIfNeeded() {
    var canvas = document.getElementById("tv-gold-price-chart");
    if (!canvas) return;

    function tryMount(pl) {
      if (!pl || pl.empty) return;
      try {
        mountTvGoldChart(canvas, pl);
        window.__tvChartDiag = "ok-canvas";
      } catch (e) {
        window.__tvChartDiag = e && e.message ? e.message : String(e);
      }
    }

    var payload = parseInitialChartPayload();
    if (payload && !payload.empty) {
      tryMount(payload);
      return;
    }

    fetch("/api/prices/history")
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
  if (typeof window.__tvChartRedraw === "function") {
    try {
      window.__tvChartRedraw();
    } catch (eSlide) {}
  }

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

  /* Không dùng async/await — một số WebView/TV (Chromium <55) parse lỗi và cả file script không chạy */
  function loadPrices() {
    fetch("/api/prices")
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (data) {
        if (data && data.prices) updatePriceCells(data.prices);
        if (window.__tvChartRefresh) return window.__tvChartRefresh();
      })
      .catch(function () {});
  }

  function bootTvChart() {
    initTvChartIfNeeded();
  }

  tick();
  loadPrices();
  setInterval(tick, 1000);
  setInterval(loadPrices, 30000);

  bootTvChart();
  setTimeout(bootTvChart, 50);
  setTimeout(bootTvChart, 250);
  setTimeout(bootTvChart, 800);
  setTimeout(bootTvChart, 2500);
  if (document.readyState === "complete") {
    setTimeout(bootTvChart, 0);
  } else if (window.addEventListener) {
    window.addEventListener(
      "load",
      function () {
        setTimeout(bootTvChart, 0);
      },
      false
    );
  }
})();
