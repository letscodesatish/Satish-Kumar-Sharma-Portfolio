/** Shared helpers for the GitHub and LeetCode activity heatmaps (all dates are UTC "YYYY-MM-DD"). */

export type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type Calendar = {
  weeks: (Day | null)[][]; // columns of 7 (Sun..Sat); null = outside range
  total: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  months: { label: string; col: number }[];
};

const DAY = 86_400_000;
export const ymd = (d: Date) => d.toISOString().slice(0, 10);

/** Default level scale when a source doesn't supply one. */
export const levelFor = (n: number): Day["level"] => (n <= 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4);

/**
 * Build a 53-week calendar ending today (UTC) from per-day counts.
 * `levels` lets a source (GitHub) pass its own intensity levels.
 */
export function buildCalendar(counts: Map<string, number>, levels?: Map<string, Day["level"]>): Calendar {
  const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
  const start = new Date(today.getTime() - 364 * DAY);
  const gridStart = new Date(start.getTime() - start.getUTCDay() * DAY); // back to Sunday

  const weeks: (Day | null)[][] = [];
  const months: Calendar["months"] = [];
  let total = 0, activeDays = 0, run = 0, longestStreak = 0;
  const series: number[] = [];

  for (let t = gridStart.getTime(); t <= today.getTime(); t += DAY) {
    const d = new Date(t);
    if (d.getUTCDay() === 0) weeks.push([]);
    const key = ymd(d);
    if (t < start.getTime()) { weeks[weeks.length - 1].push(null); continue; }
    const count = counts.get(key) ?? 0;
    weeks[weeks.length - 1].push({ date: key, count, level: levels?.get(key) ?? levelFor(count) });
    total += count;
    series.push(count);
    if (count > 0) { activeDays++; run++; longestStreak = Math.max(longestStreak, run); } else run = 0;
  }

  // current streak: consecutive active days ending today, or yesterday if today has nothing yet
  let i = series.length - 1;
  if (i >= 0 && series[i] === 0) i--;
  let currentStreak = 0;
  for (; i >= 0 && series[i] > 0; i--) currentStreak++;

  // label each month above the week that contains its 1st
  weeks.forEach((week, col) => {
    const first = week.find(day => day?.date.endsWith("-01"));
    if (first) months.push({ label: new Date(first.date + "T00:00:00Z").toLocaleString("en-US", { month: "short", timeZone: "UTC" }), col });
  });

  return { weeks, total, activeDays, currentStreak, longestStreak, months };
}
