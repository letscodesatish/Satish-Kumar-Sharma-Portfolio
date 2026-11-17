import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Resume from "@/components/Resume";
import Certificates from "@/components/Certificates";
import Brands from "@/components/Brands";
import GitHubFeed from "@/components/GitHubFeed";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Effects from "@/components/Effects";
import LeetCode from "@/components/LeetCode";
import Sketches from "@/components/Sketches";
import { getGitHubAchievements, getGitHubCalendar, getGitHubData } from "@/lib/github";
import { getLeetCodeData } from "@/lib/leetcode";

// Rebuild the page in the background at most every 10 minutes, so new commits,
// LeetCode solves and badges show up soon. (~12 GitHub API calls/hour; the limit is 60.)
export const revalidate = 600;

export default async function Home() {
  // All four are cached for 10 minutes and refreshed together with the page.
  const [github, ghCalendar, leetcode, achievements] = await Promise.all([
    getGitHubData(), getGitHubCalendar(), getLeetCodeData(), getGitHubAchievements(),
  ]);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Projects />
        <Resume repoCount={github?.publicRepos ?? 41} />
        <Certificates />
        <Brands />
        <GitHubFeed data={github} graph={ghCalendar} achievements={achievements} />
        <LeetCode data={leetcode} />
        <Sketches />
        <Contact />
      </main>
      <Footer />
      <Effects />
    </>
  );
}
