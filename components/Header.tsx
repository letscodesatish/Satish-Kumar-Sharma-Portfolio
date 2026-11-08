"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "certificates", label: "Certificates" },
  { id: "github", label: "GitHub" },
  { id: "leetcode", label: "LeetCode" },
  { id: "sketches", label: "Sketches" },
  { id: "contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const spy = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));
    return () => { window.removeEventListener("scroll", onScroll); spy.disconnect(); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header__inner">
        <a href="#home" className="logo" aria-label="Satish Kumar Sharma, home">
          <svg className="logo__mark" viewBox="0 0 40 44" aria-hidden="true">
            <path d="M20 2 38 12v20L20 42 2 32V12Z" fill="none" stroke="currentColor" strokeWidth="2.4" />
            <path d="M20 10 31 16v12l-11 6-11-6V16Z" fill="none" stroke="currentColor" strokeWidth="1.6" opacity=".6" />
            <text x="20" y="27" textAnchor="middle" fontWeight="800" fontSize="13" fill="currentColor" stroke="none" style={{ fontFamily: "var(--ff-head)" }}>S</text>
          </svg>
          <span className="logo__text">satish<span className="logo__dot">.</span></span>
        </a>

        <nav id="nav" className={`nav${open ? " is-open" : ""}`} aria-label="Primary">
          <ul className="nav__list">
            {LINKS.map(l => (
              <li key={l.id}>
                <a href={`#${l.id}`} className={`nav__link${active === l.id ? " is-active" : ""}`} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn--solid" onClick={() => setOpen(false)}>Hire me</a>
        </nav>

        <button
          className="burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
