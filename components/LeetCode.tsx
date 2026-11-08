import Image from "next/image";
import { PROFILE } from "@/lib/data";
import type { LeetCodeData } from "@/lib/leetcode";
import { ArrowUpRight, LeetCodeIcon } from "./Icons";
import Heatmap from "./Heatmap";
import ActivityStats from "./ActivityStats";

const LANG: Record<string, string> = { java: "Java", python3: "Python", python: "Python", cpp: "C++", c: "C", javascript: "JavaScript", typescript: "TypeScript", mysql: "MySQL" };
const fmt = (sec: number) =>
  new Date(sec * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

function SolvedRing({ solved, total }: { solved: number; total: number }) {
  const R = 52, C = 2 * Math.PI * R;
  const pct = total ? solved / total : 0;
  return (
    <svg viewBox="0 0 128 128" className="lc__ring" role="img" aria-label={`${solved} of ${total} problems solved`}>
      <circle cx="64" cy="64" r={R} className="lc__ring-bg" />
      <circle cx="64" cy="64" r={R} className="lc__ring-fg" strokeDasharray={`${Math.max(pct * C, 2)} ${C}`} transform="rotate(-90 64 64)" />
      <text x="64" y="62" textAnchor="middle" className="lc__ring-num">{solved}</text>
      <text x="64" y="82" textAnchor="middle" className="lc__ring-sub">solved</text>
    </svg>
  );
}

export default function LeetCode({ data }: { data: LeetCodeData | null }) {
  const levels = data
    ? ([
        ["Easy", data.solved.easy, data.totals.easy, "easy"],
        ["Medium", data.solved.medium, data.totals.medium, "medium"],
        ["Hard", data.solved.hard, data.totals.hard, "hard"],
      ] as const)
    : [];

  return (
    <section className="section" id="leetcode">
      <div className="container">
        <div className="section__head reveal">
          <div>
            <h2 className="section__title">Problem solving<br />on LeetCode</h2>
            <p className="section__sub">Live stats from LeetCode, refreshed every hour: problems solved, recent accepted solutions and my daily streak.</p>
          </div>
          <a href={PROFILE.leetcode} target="_blank" rel="noopener noreferrer" className="btn btn--outline">View LeetCode profile</a>
        </div>

        {data ? (
          <>
            <div className="gh">
              <div className="gh__profile lc__profile reveal">
                <Image src="/assets/img/profile.png" alt="" width={110} height={110} />
                <h3>{data.username}</h3>
                <p>{data.ranking ? `Rank #${data.ranking.toLocaleString("en-IN")}` : "LeetCode"}</p>
                <SolvedRing solved={data.solved.all} total={data.totals.all} />
                <ul className="lc__bars">
                  {levels.map(([label, solved, total, cls]) => (
                    <li key={label} className={`lc__bar lc__bar--${cls}`}>
                      <div className="lc__bar-top"><span>{label}</span><b>{solved}<small>/{total}</small></b></div>
                      <div className="lc__track"><i style={{ width: `${total ? Math.max((solved / total) * 100, solved ? 2 : 0) : 0}%` }} /></div>
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="gh__list reveal">
                {data.recent.map(s => (
                  <li key={s.slug + s.timestamp}>
                    <a className="gh__item" href={`https://leetcode.com/problems/${s.slug}/`} target="_blank" rel="noopener noreferrer">
                      <span className="gh__date"><b>Solved</b>{fmt(s.timestamp)}</span>
                      <span>
                        <span className="gh__name">{s.title}</span>
                        <span className="gh__lang"><i />{LANG[s.lang] ?? s.lang}</span>
                      </span>
                      <span className="gh__go"><ArrowUpRight /></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="activity reveal">
              <div className="activity__head">
                <h3><LeetCodeIcon /> {data.calendar.total.toLocaleString("en-IN")} submissions in the last year</h3>
                <ActivityStats items={[
                  { label: "Current streak", value: `${data.calendar.currentStreak} ${data.calendar.currentStreak === 1 ? "day" : "days"}` },
                  { label: "Max streak", value: `${data.maxStreak} ${data.maxStreak === 1 ? "day" : "days"}` },
                  { label: "Active days", value: String(data.calendar.activeDays) },
                ]} />
              </div>
              <Heatmap cal={data.calendar} unit={["submission", "submissions"]} label="LeetCode submissions over the last year" />
            </div>
          </>
        ) : (
          <p className="activity__empty reveal">
            LeetCode stats are refreshing. <a href={PROFILE.leetcode} target="_blank" rel="noopener noreferrer">See my profile →</a>
          </p>
        )}
      </div>
    </section>
  );
}
