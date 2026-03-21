"use client";

import { useState, useEffect } from "react";

export function useClock() {
  const [dateTime, setDateTime] = useState("");

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

  return dateTime;
}
