"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CAT_LABEL, PROFILE, PROJECTS, type ProjectCat } from "@/lib/data";
import { ChevronLeft, ChevronRight, ExternalIcon, GitHubIcon } from "./Icons";

const FILTERS: { key: "all" | ProjectCat; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ai", label: CAT_LABEL.ai },
  { key: "ml", label: CAT_LABEL.ml },
  { key: "web", label: CAT_LABEL.web },
  { key: "fun", label: CAT_LABEL.fun },
];

export default function Projects() {
  const [filter, setFilter] = useState<"all" | ProjectCat>("all");
  const [bar, setBar] = useState({ width: 30, x: 0, atStart: true, atEnd: false });
  const track = useRef<HTMLDivElement>(null);

  const list = filter === "all" ? PROJECTS : PROJECTS.filter(p => p.cat === filter);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = Math.min(1, el.clientWidth / el.scrollWidth);
    setBar({
      width: ratio * 100,
      x: max > 0 ? (el.scrollLeft / max) * (1 / ratio - 1) * 100 : 0,
      atStart: el.scrollLeft <= 4,
      atEnd: el.scrollLeft >= max - 4,
    });
  }, []);

  useEffect(() => {
    if (track.current) track.current.scrollLeft = 0;
    update();
  }, [filter, update]);

  useEffect(() => {
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>(".project");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 28;
    el.scrollBy({ left: dir * (card.offsetWidth + gap) });
  };

  return (
    <section className="section section--alt section--slant" id="projects">
      <div className="container">
        <div className="section__head reveal">
          <h2 className="section__title">My latest projects</h2>
          <div className="carousel-ctrl">
            <button className="arrow" onClick={() => scroll(-1)} disabled={bar.atStart} aria-label="Previous projects"><ChevronLeft /></button>
            <button className="arrow arrow--active" onClick={() => scroll(1)} disabled={bar.atEnd} aria-label="Next projects"><ChevronRight /></button>
          </div>
        </div>

        <div className="chips reveal" role="tablist" aria-label="Filter projects">
          {FILTERS.map(f => (
            <button key={f.key} role="tab" aria-selected={filter === f.key} className={`chip${filter === f.key ? " is-active" : ""}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        <div
          className="carousel"
          ref={track}
          tabIndex={0}
          aria-label="Projects"
          onScroll={update}
          onKeyDown={e => {
            if (e.key === "ArrowRight") { e.preventDefault(); scroll(1); }
            if (e.key === "ArrowLeft") { e.preventDefault(); scroll(-1); }
          }}
        >
          {list.map(p => (
            <article className="project" key={p.title}>
              <div className="project__thumb">
                <div className="project__dots"><i /><i /><i /></div>
                <span className="project__cat">{CAT_LABEL[p.cat]}</span>
                <div className="project__mono">{p.title.split(" — ")[0]}</div>
              </div>
              <div className="project__body">
                <span className="project__date">{p.date}</span>
                <h3 className="project__title">{p.title}</h3>
                <p className="project__desc">{p.desc}</p>
                <div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
                <div className="project__links">
                  <a href={p.repo} target="_blank" rel="noopener noreferrer"><GitHubIcon /> Code</a>
                  {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer"><ExternalIcon /> Live demo</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="progress" aria-hidden="true">
          <span style={{ width: `${bar.width}%`, transform: `translateX(${bar.x}%)` }} />
        </div>

        <div className="center reveal">
          <a href={`${PROFILE.github}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="btn btn--outline">View all on GitHub</a>
        </div>
      </div>
    </section>
  );
}
