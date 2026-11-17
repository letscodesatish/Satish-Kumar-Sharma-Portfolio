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

const SITE_HEADERS = { "User-Agent": "Mozilla/5.0 (compatible; satish-portfolio)" };
const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'");
const parseCount = (s: string) => {
  const n = parseFloat(s.replace(/,/g, ""));
  return /k$/i.test(s) ? Math.round(n * 1000) : n;
};

/**
 * Profile + repositories read straight from github.com, the same pages you see in the browser.
 * No API key and no 60-requests/hour API limit, so it keeps updating on shared hosts like Vercel.
 */
async function viaSite(): Promise<GitHubData | null> {
  const get = async (url: string) => {
    const res = await fetch(url, { headers: SITE_HEADERS, next: { revalidate: 600 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.text();
  };

  const profile = await get(`https://github.com/${PROFILE.githubUser}`);
  const followers = /<span class="text-bold color-fg-default">([\d.,kK]+)<\/span>\s*followers?/.exec(profile)?.[1];
  const bio = /data-bio-text="([^"]*)"/.exec(profile)?.[1];
  const avatar = /<img\b[^>]*class="[^"]*avatar-user[^"]*"[^>]*\bsrc="([^"]+)"/.exec(profile)?.[1];

  // Repositories tab lists 30 per page, newest update first; read until a short page (max 5 pages).
  const repos: Repo[] = [];
  for (let page = 1; page <= 5; page++) {
    const html = await get(`https://github.com/${PROFILE.githubUser}?tab=repositories&page=${page}`);
    const items = [...html.matchAll(/<li\b([^>]*itemprop="owns"[^>]*)>([\s\S]*?)<\/li>/g)];
    for (const [, attrs, body] of items) {
      const name = /itemprop="name codeRepository"[^>]*>\s*([^<]+?)\s*</.exec(body)?.[1];
      if (!name) continue;
      repos.push({
        name,
        url: `https://github.com/${PROFILE.githubUser}/${name}`,
        description: (() => { const d = /itemprop="description">\s*([^<]*?)\s*</.exec(body)?.[1]; return d ? decode(d) : null; })(),
        language: /itemprop="programmingLanguage">([^<]+)</.exec(body)?.[1] ?? null,
        pushedAt: /<relative-time\b[^>]*datetime="([^"]+)"/.exec(body)?.[1] ?? "",
        fork: /\bclass="[^"]*\bfork\b/.test(attrs),
      });
    }
    if (items.length < 30) break;
  }
  if (!repos.length || followers === undefined) return null; // page layout changed → let the API take over

  return {
    publicRepos: repos.length,
    followers: parseCount(followers),
    bio: bio ? decode(bio) : null,
    avatar: avatar ? decode(avatar) : "",
    repos: repos.filter(r => !r.fork && !HIDDEN.has(r.name.toLowerCase())),
    languages: new Set(repos.map(r => r.language).filter(Boolean)).size,
  };
}

/** Profile + repos for the GitHub section: github.com first, the REST API only as a backup. Cached 10 minutes. */
export async function getGitHubData(): Promise<GitHubData | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const site = await viaSite().catch(() => null);
    if (site) return site;
    await new Promise(r => setTimeout(r, 1500)); // github.com sometimes answers 5xx for a moment
  }
  return viaApi();
}

async function viaApi(): Promise<GitHubData | null> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "satish-portfolio",
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  };
  const opts = { headers, next: { revalidate: 600 } };

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
    next: { revalidate: 600 },
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
      next: { revalidate: 600 },
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
      { headers, next: { revalidate: 600 } }
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

export type GitHubCalendar = { cal: Calendar; unit: "contribution" | "commit" };

/**
 * Tries, in order:
 *   1. GraphQL API (needs GITHUB_TOKEN)           — exact contributions
 *   2. github.com public calendar page             — exact contributions
 *   3. commit search API (api.github.com, no token) — commits only
 * so the graph still renders when github.com itself is having an outage.
 */
export async function getGitHubCalendar(): Promise<GitHubCalendar | null> {
  const token = process.env.GITHUB_TOKEN;
  const exact = (token && (await viaGraphQL(token).catch(() => null))) || (await viaHtml().catch(() => null));
  if (exact) return { cal: buildCalendar(exact.counts, exact.levels), unit: "contribution" };

  const commits = await viaCommitSearch().catch(() => null);
  if (commits) return { cal: buildCalendar(commits.counts), unit: "commit" };
  return null;
}

/* ------------------------------------------------------------------
   Achievements (Pull Shark, Quickdraw, YOLO …)
   GitHub has no API for these, so read them from the public profile page.
   ------------------------------------------------------------------ */

export type Achievement = { slug: string; name: string; img: string; tier: string | null; about: string };

const ACHIEVEMENT_ABOUT: Record<string, string> = {
  "pull-shark": "Opened pull requests that have been merged",
  quickdraw: "Closed an issue or pull request within 5 minutes of opening",
  yolo: "Merged a pull request without a code review",
  "pair-extraordinaire": "Co-authored commits on merged pull requests",
  starstruck: "Created a repository that many people starred",
  "galaxy-brain": "Answered discussions that were marked as accepted",
  "public-sponsor": "Sponsored an open source contributor",
  "arctic-code-vault-contributor": "Contributed code to the 2020 GitHub Archive Program",
  "mars-2020-contributor": "Contributed code to the Mars 2020 Helicopter Mission",
  "open-sourcerer": "Had pull requests merged in multiple public repositories",
  heart_on_your_sleeve: "Reacted to something on GitHub with an emoji",
};

export async function getGitHubAchievements(): Promise<Achievement[] | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`https://github.com/${PROFILE.githubUser}?tab=achievements`, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; satish-portfolio)" },
        next: { revalidate: 600 },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(String(res.status));
      const html = await res.text();

      // <a href="/user?achievement=pull-shark&amp;tab=achievements" …><img src="…" … alt="Achievement: Pull Shark" …>
      //   <span class="Label achievement-tier-label …">x2</span></a>
      const found = new Map<string, Achievement>();
      const re = /<a\b[^>]*href="[^"]*[?&](?:amp;)?achievement=([\w-]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
      for (const m of html.matchAll(re)) {
        const [, slug, inner] = m;
        const img = /<img\b[^>]*\bsrc="([^"]+)"/.exec(inner)?.[1];
        const name = /alt="Achievement: ([^"]+)"/.exec(inner)?.[1];
        if (!img || !name || found.has(slug)) continue;
        const tier = /achievement-tier-label[^>]*>\s*([^<\s][^<]*?)\s*</.exec(inner)?.[1] ?? null;
        found.set(slug, { slug, name, img, tier, about: ACHIEVEMENT_ABOUT[slug] ?? "" });
      }
      return [...found.values()];
    } catch {
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  return null;
}
