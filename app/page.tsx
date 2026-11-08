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
import { getGitHubCalendar, getGitHubData } from "@/lib/github";
import { getLeetCodeData } from "@/lib/leetcode";

// Rebuild the page in the background at most once an hour (keeps GitHub stats fresh).
export const revalidate = 3600;

export default async function Home() {
  // All three are cached for an hour and refreshed together with the page.
  const [github, ghCalendar, leetcode] = await Promise.all([getGitHubData(), getGitHubCalendar(), getLeetCodeData()]);
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
        <GitHubFeed data={github} graph={ghCalendar} />
        <LeetCode data={leetcode} />
        <Sketches />
        <Contact />
      </main>
      <Footer />
      <Effects />
    </>
  );
}
