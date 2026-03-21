"use client";

import { useState, useEffect } from "react";

interface ClockClientProps {
  serverTime: string; // fallback time from server (e.g. "09/03/2026  |  21:56:30")
}

export default function ClockClient({ serverTime }: ClockClientProps) {
  const [dateTime, setDateTime] = useState(serverTime);

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
    <div
      className="font-bold text-white mb-2 xl:mb-0 md:mb-[1vh] text-clock"
      style={{
        letterSpacing: "0.15em",
        textShadow: "0 0 15px rgba(255,255,255,0.4)",
        whiteSpace: "nowrap",
      }}
    >
      {dateTime}
    </div>
  );
}
