import type { Calendar } from "@/lib/heatmap";

const CELL = 11, GAP = 3, STEP = CELL + GAP, LEFT = 28, TOP = 18;
const WEEKDAYS: [number, string][] = [[1, "Mon"], [3, "Wed"], [5, "Fri"]];

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Server-rendered contribution heatmap. Scrolls horizontally on small screens, starting at the most recent week. */
export default function Heatmap({ cal, unit, label }: { cal: Calendar; unit: [string, string]; label: string }) {
  const width = LEFT + cal.weeks.length * STEP;
  const height = TOP + 7 * STEP;
  const word = (n: number) => (n === 1 ? unit[0] : unit[1]);

  return (
    <div className="heatmap">
      <div className="heatmap__scroll">
        <svg className="heatmap__svg" viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={label}>
          {cal.months.map(m => (
            <text key={`${m.label}-${m.col}`} x={LEFT + m.col * STEP} y={11} className="heatmap__lbl">{m.label}</text>
          ))}
          {WEEKDAYS.map(([row, d]) => (
            <text key={d} x={0} y={TOP + row * STEP + 9} className="heatmap__lbl">{d}</text>
          ))}
          {cal.weeks.map((week, c) =>
            week.map((day, r) =>
              day ? (
                <rect key={day.date} x={LEFT + c * STEP} y={TOP + r * STEP} width={CELL} height={CELL} rx={2.5} className={`hm-${day.level}`}>
                  <title>{`${day.count === 0 ? "No" : day.count} ${word(day.count)} on ${fmt(day.date)}`}</title>
                </rect>
              ) : null
            )
          )}
        </svg>
      </div>
      <div className="heatmap__legend" aria-hidden="true">
        Less {[0, 1, 2, 3, 4].map(l => <i key={l} className={`hm-${l}`} />)} More
      </div>
    </div>
  );
}
