/**
 * Bảng giá TV: đồng hồ, poll giá, luân phiên slide, gọi Chart refresh.
 * Tải qua next/script (WebView-safe, không qua bundle React).
 */
(function () {
  if (typeof window !== "undefined" && window.__tvBangGiaVanInit) {
    return;
  }
  if (typeof window !== "undefined") {
    window.__tvBangGiaVanInit = true;
  }

  function formatVND(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

  var showTable = true;
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
  setInterval(function () {
    showTable = !showTable;
    applySlides();
  }, slideSec * 1000);

  function tick() {
    var now = new Date();
    var d = String(now.getDate()).padStart(2, "0");
    var mo = String(now.getMonth() + 1).padStart(2, "0");
    var h = String(now.getHours()).padStart(2, "0");
    var m = String(now.getMinutes()).padStart(2, "0");
    var s = String(now.getSeconds()).padStart(2, "0");
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
})();
