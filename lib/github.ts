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

