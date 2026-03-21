/** Calendar YYYY-MM-DD in the environment's local timezone (matches existing /api/prices). */
export function getCalendarDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function calendarDateKeyFromDate(d: Date): string {
  const x = new Date(d);
  return getCalendarDateString(x);
}
