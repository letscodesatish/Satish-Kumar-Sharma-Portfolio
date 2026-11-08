"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AWARDS, EDUCATION, EXPERIENCE, PROFILE, SKILLS, STATS, type TimelineItem } from "@/lib/data";
import { CapIcon, CodeIcon, DownloadIcon, TrophyIcon, UserIcon } from "./Icons";

const TABS: { id: string; label: string; icon: ReactNode }[] = [
  { id: "about", label: "About me", icon: <UserIcon /> },
  { id: "skills", label: "My skills", icon: <CodeIcon /> },
  { id: "edu", label: "Education & experience", icon: <CapIcon /> },
  { id: "awards", label: "Awards", icon: <TrophyIcon /> },
];

function Counter({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [val, setVal] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    setVal(0); // server HTML shows the real value; animate up from 0 once JS runs
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const frame = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        setVal(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);

  return <strong ref={ref}>{val.toFixed(decimals)}</strong>;
}

const Timeline = ({ items }: { items: TimelineItem[] }) => (
  <ol className="timeline">
    {items.map(x => (
      <li key={x.title + x.when}>
        <span className="when">{x.when}</span>
        <h4>{x.title}</h4>
        <div className="org">{x.org}</div>
        <p>{x.text}</p>
      </li>
    ))}
  </ol>
);

export default function Resume({ repoCount }: { repoCount: number }) {
  const [tab, setTab] = useState("about");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const n = (i + d + TABS.length) % TABS.length;
    setTab(TABS[n].id);
    tabRefs.current[n]?.focus();
  };

  return (
    <section className="section" id="resume">
      <div className="container">
        <div className="section__head reveal">
          <div>
            <h2 className="section__title">My resume</h2>
            <p className="section__sub">B.Tech CSE at CSJMU (2024–2028), CGPA 8.5/10. Software development internship, industry mentorships in Data Science and AI/ML, and projects I&apos;ve shipped.</p>
          </div>
          <a href={PROFILE.resume} className="btn btn--outline" download><DownloadIcon /> Download CV</a>
        </div>

        <div className="tabs reveal" role="tablist" aria-label="Resume sections">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={el => { tabRefs.current[i] = el; }}
              id={`t-${t.id}`}
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={`tab-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              className={`tab${tab === t.id ? " is-active" : ""}`}
              onClick={() => setTab(t.id)}
              onKeyDown={e => onKey(e, i)}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {tab === "about" && (
          <div className="tabpanel" id="tab-about" role="tabpanel" aria-labelledby="t-about">
            <div className="about">
              <ul className="stats">
                <li><Counter to={repoCount} /><span>Public<br />repositories</span></li>
                <li><Counter to={STATS.certificates} /><span>Certificates<br />earned</span></li>
                <li><Counter to={STATS.hackathons} /><span>Hackathons<br />joined</span></li>
                <li><Counter to={STATS.cgpa} decimals={1} /><span>Current<br />CGPA</span></li>
              </ul>
              <div className="about__text">
                <h3>Why hire me for your next project?</h3>
                <p>I&apos;m Satish Kumar Sharma, a B.Tech Computer Science and Engineering student at Chhatrapati Shahu Ji Maharaj
                  University (CSJMU), Kanpur, with hands-on experience building AI agents, machine learning models and web
                  applications. During my software development internship at Coderva I built and deployed <strong>PG_Orchestrator</strong>,
                  a production AI agent on Groq Llama 3.3 70B that helps students find and book PG accommodation and sends
                  booking confirmations through AWS SES.</p>
                <p>I work mainly in Python, Machine Learning, RAG, SQL and Next.js. I&apos;ve built a house price model with an
                  R² score of 0.85, a movie recommender deployed on Streamlit, and data-analysis reports. I&apos;ve competed in
                  the <strong>AI for Bharat Hackathon</strong> (AWS and Hack2skill), the <strong>PFRDA Hackathon at IIT Kanpur</strong> and
                  <strong> HackShodh 2026</strong>, and I solve DSA problems on LeetCode regularly. I&apos;m looking for a
                  Software Development or AI/ML internship.</p>
                <p>Outside code I make content on <a className="inline-link" href={PROFILE.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>,
                  draw <a className="inline-link" href="#sketches">pencil sketches</a>, and was on the university&apos;s Media &amp; PR team,
                  so I&apos;m used to explaining technical work clearly.</p>
                <p className="signature">Satish Kumar Sharma</p>
              </div>
            </div>
          </div>
        )}

        {tab === "skills" && (
          <div className="tabpanel" id="tab-skills" role="tabpanel" aria-labelledby="t-skills">
            <div className="skills">
              {SKILLS.map(g => (
                <div className="skill-card" key={g.group}>
                  <h4>{g.group}</h4>
                  <ul>{g.items.map(s => <li key={s}>{s}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "edu" && (
          <div className="tabpanel" id="tab-edu" role="tabpanel" aria-labelledby="t-edu">
            <div className="timeline-wrap">
              <div><h3 className="col-title">Experience</h3><Timeline items={EXPERIENCE} /></div>
              <div><h3 className="col-title">Education</h3><Timeline items={EDUCATION} /></div>
            </div>
          </div>
        )}

        {tab === "awards" && (
          <div className="tabpanel" id="tab-awards" role="tabpanel" aria-labelledby="t-awards">
            <ul className="awards">
              {AWARDS.map(a => (
                <li key={a.title}>
                  <span className="ic"><TrophyIcon /></span>
                  <div><h4>{a.title}</h4><p>{a.org} · {a.when}</p></div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
