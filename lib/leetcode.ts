import { PROFILE } from "./data";
import { buildCalendar, ymd, type Calendar } from "./heatmap";

export type LeetCodeData = {
  username: string;
  avatar: string | null;
  ranking: number | null;
  solved: { all: number; easy: number; medium: number; hard: number };
  totals: { all: number; easy: number; medium: number; hard: number };
  maxStreak: number;
  calendar: Calendar;
  recent: { title: string; slug: string; timestamp: number; lang: string }[];
};

const QUERY = `query($u: String!) {
  allQuestionsCount { difficulty count }
  matchedUser(username: $u) {
    username
    profile { ranking userAvatar }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    userCalendar { streak submissionCalendar }
  }
  recentAcSubmissionList(username: $u, limit: 6) { title titleSlug timestamp lang }
}`;

type Count = { difficulty: string; count: number };
const pick = (arr: Count[] = [], d: string) => arr.find(x => x.difficulty === d)?.count ?? 0;

/** Public LeetCode GraphQL, cached for one hour (refreshed with the page). */
export async function getLeetCodeData(): Promise<LeetCodeData | null> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: `https://leetcode.com/u/${PROFILE.leetcodeUser}/`,
        "User-Agent": "Mozilla/5.0 (compatible; satish-portfolio)",
      },
      body: JSON.stringify({ query: QUERY, variables: { u: PROFILE.leetcodeUser } }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    const u = data?.matchedUser;
    if (!u) return null;

    // submissionCalendar: {"<unix seconds at UTC midnight>": count, ...}
    const raw: Record<string, number> = JSON.parse(u.userCalendar?.submissionCalendar || "{}");
    const counts = new Map<string, number>();
    for (const [ts, n] of Object.entries(raw)) {
      const key = ymd(new Date(Number(ts) * 1000));
      counts.set(key, (counts.get(key) ?? 0) + n);
    }

    const ac: Count[] = u.submitStatsGlobal?.acSubmissionNum ?? [];
    const all: Count[] = data.allQuestionsCount ?? [];
    const calendar = buildCalendar(counts);

    return {
      username: u.username,
      avatar: u.profile?.userAvatar ?? null,
      ranking: u.profile?.ranking ?? null,
      solved: { all: pick(ac, "All"), easy: pick(ac, "Easy"), medium: pick(ac, "Medium"), hard: pick(ac, "Hard") },
      totals: { all: pick(all, "All"), easy: pick(all, "Easy"), medium: pick(all, "Medium"), hard: pick(all, "Hard") },
      maxStreak: Math.max(u.userCalendar?.streak ?? 0, calendar.longestStreak),
      calendar,
      recent: (data.recentAcSubmissionList ?? []).map((s: Record<string, string>) => ({
        title: s.title, slug: s.titleSlug, timestamp: Number(s.timestamp), lang: s.lang,
      })),
    };
  } catch {
    return null;
  }
}
