"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { vi } from "date-fns/locale";

import { cn } from "@/lib/utils";

import "react-day-picker/style.css";

type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  locale = vi,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={locale}
      className={cn("rdp-root", className)}
      style={
        {
          "--rdp-accent-color": "hsl(var(--primary))",
          "--rdp-accent-background-color": "hsl(var(--accent))",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Calendar, type CalendarProps };
