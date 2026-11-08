import { PROFILE } from "./data";
import { buildCalendar, type Calendar, type Day } from "./heatmap";

export type Repo = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  pushedAt: string;
  fork: boolean;
};

export type GitHubData = {
  publicRepos: number;
  followers: number;
  bio: string | null;
  avatar: string;
  repos: Repo[];
  languages: number;
};

const API = "https://api.github.com";
const HIDDEN = new Set([PROFILE.githubUser.toLowerCase()]); // profile-README repo

/** Fetched on the server and cached for one hour (ISR), so visitors never hit GitHub rate limits. */
export async function getGitHubData(): Promise<GitHubData | null> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "satish-portfolio",
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  };
  const opts = { headers, next: { revalidate: 3600 } };

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${API}/users/${PROFILE.githubUser}`, opts),
      fetch(`${API}/users/${PROFILE.githubUser}/repos?per_page=100&sort=pushed`, opts),
    ]);
    if (!userRes.ok || !reposRes.ok) return null;

    const user = await userRes.json();
    const raw: Array<Record<string, unknown>> = await reposRes.json();

    const repos: Repo[] = raw.map(r => ({
      name: String(r.name),
      url: String(r.html_url),
      description: (r.description as string) ?? null,
      language: (r.language as string) ?? null,
      pushedAt: String(r.pushed_at ?? r.updated_at),
      fork: Boolean(r.fork),
    }));

    return {
      publicRepos: user.public_repos,
      followers: user.followers,
      bio: user.bio,
      avatar: user.avatar_url,
      repos: repos.filter(r => !r.fork && !HIDDEN.has(r.name.toLowerCase())),
      languages: new Set(repos.map(r => r.language).filter(Boolean)).size,
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------
   Contribution calendar (the green-squares graph, recoloured blue)
   1. GITHUB_TOKEN set  → official GraphQL API (most reliable)
   2. otherwise         → the public calendar fragment on github.com
   ------------------------------------------------------------------ */

const LEVEL: Record<string, Day["level"]> = {
  NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4,
};

async function viaGraphQL(token: string) {
  const res = await fetch(`${API}/graphql`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": "satish-portfolio" },
    body: JSON.stringify({
      query: `query($l:String!){user(login:$l){contributionsCollection{contributionCalendar{
        weeks{contributionDays{date contributionCount contributionLevel}}}}}}`,
      variables: { l: PROFILE.githubUser },
    }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
  if (!weeks) return null;
  const counts = new Map<string, number>(), levels = new Map<string, Day["level"]>();
  for (const w of weeks) for (const d of w.contributionDays) {
    counts.set(d.date, d.contributionCount);
    levels.set(d.date, LEVEL[d.contributionLevel] ?? 0);
  }
  return { counts, levels };
}

async function viaHtml() {
  // github.com sometimes answers 504 for a few seconds; retry once before giving up
  let res: Response | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    res = await fetch(`https://github.com/users/${PROFILE.githubUser}/contributions`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; satish-portfolio)" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    }).catch(() => null);
    if (res?.ok) break;
    await new Promise(r => setTimeout(r, 1500));
  }
  if (!res?.ok) return null;
  const html = await res.text();

  // <td ... data-date="2026-01-05" id="contribution-day-component-1-10" data-level="2" ...>
  const cells = new Map<string, { date: string; level: Day["level"] }>();
  for (const m of html.matchAll(/<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g)) {
    const tag = m[0];
    const id = /\bid="([^"]+)"/.exec(tag)?.[1];
    const level = Number(/\bdata-level="(\d)"/.exec(tag)?.[1] ?? 0) as Day["level"];
    if (id) cells.set(id, { date: m[1], level });
  }
  if (!cells.size) return null;

  // <tool-tip for="contribution-day-component-1-10">3 contributions on January 5th.</tool-tip>
  const tips = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = /^\s*(\d[\d,]*)\s+contribution/.exec(m[2]);
    tips.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0);
  }

  const counts = new Map<string, number>(), levels = new Map<string, Day["level"]>();
  for (const [id, { date, level }] of cells) {
    // tooltip count when present; otherwise approximate from the level so the graph still renders
    counts.set(date, tips.get(id) ?? level);
    levels.set(date, level);
  }
  return { counts, levels };
}

/** Fallback that only needs api.github.com: count commits per day via the commit search API. */
async function viaCommitSearch() {
  const since = new Date(Date.now() - 365 * 86_400_000).toISOString().slice(0, 10);
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "satish-portfolio",
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  };
  const counts = new Map<string, number>();
  // 100 per page; up to 5 pages (500 commits) keeps us well inside the 10 requests/minute search limit
  for (let page = 1; page <= 5; page++) {
    const q = `author:${PROFILE.githubUser} author-date:>=${since}`;
    const res = await fetch(
      `${API}/search/commits?q=${encodeURIComponent(q)}&sort=author-date&order=desc&per_page=100&page=${page}`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!res.ok) return page > 1 ? { counts, levels: undefined } : null;
    const json = await res.json();
    const items: { commit: { author: { date: string } } }[] = json.items ?? [];
    for (const it of items) {
      const day = it.commit.author.date.slice(0, 10); // author's local date, like GitHub's own graph
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }
    if (items.length < 100) break;
  }
  return { counts, levels: undefined };
}

