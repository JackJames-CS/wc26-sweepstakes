// All times shown in the viewer's local timezone.
export function fmtTime(d: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(d);
}

// Local-timezone day key, e.g. "2026-06-11"
export function dayKey(d: Date): string {
  return d.toLocaleDateString("sv-SE");
}

export function isToday(d: Date | null): boolean {
  return d !== null && dayKey(d) === dayKey(new Date());
}

export function minsAgo(d: Date): string {
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  return `${mins} mins ago`;
}

export function countdown(to: Date): string {
  const ms = to.getTime() - Date.now();
  if (ms <= 0) return "now";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
