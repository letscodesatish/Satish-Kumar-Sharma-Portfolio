import Image from "next/image";
import { PROFILE, PROJECTS } from "@/lib/data";
import type { GitHubData } from "@/lib/github";
import type { GitHubCalendar } from "@/lib/github";
import { ArrowUpRight, GitHubIcon } from "./Icons";
import Heatmap from "./Heatmap";
import ActivityStats from "./ActivityStats";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

export default function GitHubFeed({ data, graph }: { data: GitHubData | null; graph: GitHubCalendar | null }) {
  const calendar = graph?.cal ?? null;
  const unit = graph?.unit ?? "contribution"; // "commit" when github.com was down and we fell back to commit search
  // If GitHub is unreachable at build/revalidate time, fall back to featured projects.
  const items = data
    ? data.repos.slice(0, 6).map(r => ({ name: r.name, url: r.url, lang: r.language ?? "Repository", meta: fmt(r.pushedAt), label: "Updated" }))
    : PROJECTS.slice(0, 6).map(p => ({ name: p.repo.split("/").pop()!, url: p.repo, lang: p.tags[0], meta: "project", label: "Featured" }));

  return (
    <section className="section section--alt section--slant" id="github">
      <div className="container">
        <div className="section__head reveal">
          <div>
            <h2 className="section__title">What&apos;s new?<br />Fresh from GitHub</h2>
            <p className="section__sub">Pulled from the GitHub API and refreshed every hour: my most recently updated repositories.</p>
          </div>
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn btn--outline">Follow on GitHub</a>
        </div>

        <div className="gh">
          <div className="gh__profile reveal">
            <Image src="/assets/img/profile.png" alt="" width={110} height={110} />
            <h3>{PROFILE.githubUser}</h3>
            <p>{data?.bio ?? "B.Tech in CSE at CSJMU Kanpur"}</p>
            <ul className="gh__stats">
              <li><strong>{data?.publicRepos ?? "40+"}</strong><span>Repos</span></li>
              <li><strong>{data?.followers ?? "–"}</strong><span>Followers</span></li>
              <li><strong>{data?.languages ?? "10+"}</strong><span>Languages</span></li>
            </ul>
          </div>

          <ul className="gh__list reveal">
            {items.map(r => (
              <li key={r.name}>
                <a className="gh__item" href={r.url} target="_blank" rel="noopener noreferrer">
                  <span className="gh__date"><b>{r.label}</b>{r.meta}</span>
                  <span>
                    <span className="gh__name">{r.name.replace(/[-_]/g, " ")}</span>
                    <span className="gh__lang"><i />{r.lang}</span>
                  </span>
                  <span className="gh__go"><ArrowUpRight /></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="activity reveal">
          <div className="activity__head">
            <h3><GitHubIcon /> {calendar ? `${calendar.total.toLocaleString("en-IN")} ${unit}s in the last year` : "Contribution graph"}</h3>
            {calendar && (
              <ActivityStats items={[
                { label: "Current streak", value: `${calendar.currentStreak} ${calendar.currentStreak === 1 ? "day" : "days"}` },
                { label: "Longest streak", value: `${calendar.longestStreak} ${calendar.longestStreak === 1 ? "day" : "days"}` },
                { label: "Active days", value: String(calendar.activeDays) },
              ]} />
            )}
          </div>
          {calendar ? (
            <Heatmap cal={calendar} unit={[unit, `${unit}s`]} label={`GitHub ${unit}s over the last year`} />
          ) : (
            <p className="activity__empty">
              GitHub isn&apos;t responding right now. The graph refreshes automatically.{" "}
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">See it on GitHub →</a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
