import { PROFILE } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>© {new Date().getFullYear()} {PROFILE.name}. Built with Next.js.</p>
        <ul className="footer__links">
          <li><a href={PROFILE.resume} download>Resume (PDF)</a></li>
          <li><a href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href={PROFILE.leetcode} target="_blank" rel="noopener noreferrer">LeetCode</a></li>
          <li><a href={PROFILE.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href={PROFILE.youtube} target="_blank" rel="noopener noreferrer">YouTube</a></li>
          <li><a href={`mailto:${PROFILE.email}`}>Email</a></li>
        </ul>
      </div>
    </footer>
  );
}
