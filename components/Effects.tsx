"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "./Icons";

/** Scroll-reveal for every `.reveal` element plus the back-to-top button. */
export default function Effects() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal:not(.is-in)").forEach(el => io.observe(el));

    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <button className={`to-top${showTop ? " is-visible" : ""}`} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0 })}>
      <ChevronUp />
    </button>
  );
}
