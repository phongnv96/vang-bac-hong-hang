"use client";

import { useEffect } from "react";
import type { TvChartClientPayload } from "@/lib/load-tv-chart-payload";

interface TvChartBootstrapProps {
  initialPayload: TvChartClientPayload;
}

export function TvChartBootstrap({ initialPayload }: TvChartBootstrapProps) {
  useEffect(() => {
    if (initialPayload.empty) return;

    let cancelled = false;

    void (async () => {
      const canvas = document.getElementById("tv-gold-price-chart") as HTMLCanvasElement | null;
      if (!canvas || cancelled) return;
      const mod = await import("@/lib/tv-gold-chart");
      if (cancelled) return;
      mod.mountTvGoldChart(canvas, initialPayload);
    })();

    return () => {
      cancelled = true;
      void import("@/lib/tv-gold-chart").then((m) => m.destroyTvGoldChart());
    };
  }, [initialPayload]);

  return null;
}
