import Image from "next/image";
import { PROFILE } from "@/lib/data";
import { DownloadIcon, GitHubIcon, InstagramIcon, LeetCodeIcon, LinkedInIcon, MailIcon, YouTubeIcon } from "./Icons";
import TypedRole from "./TypedRole";
// Static import → content-hashed URL, so replacing the photo never shows a stale cached copy
import heroImg from "@/public/assets/img/hero.png";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__panel" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__media">
          <svg className="hero__swirl" viewBox="0 0 200 260" aria-hidden="true">
            <path d="M150 20C60 10 20 90 40 160s110 80 120 20-70-90-90-30" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          </svg>
          <div className="hero__photo-wrap">
            <Image src={heroImg} alt="Satish Kumar Sharma" className="hero__photo" priority sizes="(max-width: 900px) 220px, 360px" />
          </div>
          <div className="hero__badge"><span className="hero__badge-dot" /> {PROFILE.badge}</div>
        </div>

        <div className="hero__content">
          <p className="hero__hello">Hello, I&apos;m</p>
          <h1 className="hero__name">
            <span className="hero__first">{PROFILE.firstName}</span>
            <span className="hero__last">{PROFILE.lastName}</span>
          </h1>
          <span className="rule" />
          <TypedRole roles={PROFILE.roles} />
          <p className="hero__lead">{PROFILE.tagline}</p>
          <div className="hero__actions">
            <a href={PROFILE.resume} className="btn btn--outline" download>
              <DownloadIcon /> Download CV
            </a>
            <a href="#projects" className="btn btn--ghost">See my work →</a>
          </div>
        </div>

        <ul className="socials" aria-label="Social links">
          <li><a href={PROFILE.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon /></a></li>
          <li><a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a></li>
          <li><a href={PROFILE.leetcode} target="_blank" rel="noopener noreferrer" aria-label="LeetCode"><LeetCodeIcon /></a></li>
          <li><a href={PROFILE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a></li>
          <li><a href={PROFILE.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><YouTubeIcon /></a></li>
          <li><a href={`mailto:${PROFILE.email}`} aria-label="Email"><MailIcon /></a></li>
        </ul>
      </div>
    </section>
  );
}
