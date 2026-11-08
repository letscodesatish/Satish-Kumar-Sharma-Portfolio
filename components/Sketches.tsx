"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { InstagramIcon, PencilIcon } from "./Icons";

import duringTheseDays from "@/public/assets/sketches/me-during-these-days.jpg";
import oldDays from "@/public/assets/sketches/me-in-my-old-days.jpg";
import secondInnings from "@/public/assets/sketches/my-second-innings.jpg";
import lostInMusic from "@/public/assets/sketches/lost-in-the-music.jpg";
import examPrep from "@/public/assets/sketches/real-preparation-of-exam.jpg";
import portrait from "@/public/assets/sketches/portrait-study.jpg";

type Sketch = { img: StaticImageData; title: string; note: string; when?: string };

/* Pencil sketches — edit titles/notes here; add a new one by dropping a JPG in public/assets/sketches */
const SKETCHES: Sketch[] = [
  { img: duringTheseDays, title: "Me During These Days", note: "Self-portrait buried under Maths, Physics, Python and C notes: the engineering-student life." },
  { img: portrait, title: "Portrait Study", note: "Graphite portrait focusing on hair texture and beard shading.", when: "May 2026" },
  { img: oldDays, title: "Me in My Old Days", note: "Imagining my future self, reading “A Search of Human Being in Machine”.", when: "Dec 2024" },
  { img: secondInnings, title: "My Second Innings, For Your First Innings", note: "A tribute portrait of an Indian Army officer in uniform.", when: "2024" },
  { img: lostInMusic, title: "Lost in the Music", note: "A singer mid-song, eyes closed, holding the mic.", when: "Dec 2024" },
  { img: examPrep, title: "The Real Preparation of Exam", note: "The honest version of a study session with my sibling." },
];

export default function Sketches() {
  const [current, setCurrent] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (current !== null && !d.open) d.showModal();
    if (current === null && d.open) d.close();
  }, [current]);

  const move = (dir: 1 | -1) =>
    setCurrent(c => (c === null ? c : (c + dir + SKETCHES.length) % SKETCHES.length));
  const s = current !== null ? SKETCHES[current] : null;

  return (
    <section className="section section--alt section--slant" id="sketches">
      <div className="container">
        <div className="section__head reveal">
          <div>
            <h2 className="section__title">Beyond code:<br />my sketches</h2>
            <p className="section__sub">When I&apos;m not coding, I draw. Pencil on paper: portraits, people and a few honest moments from student life.</p>
          </div>
          <a href={PROFILE.instagram} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
            <InstagramIcon /> More on Instagram
          </a>
        </div>

        <div className="sketches">
          {SKETCHES.map((sk, i) => (
            <button key={sk.title} className="sketch reveal" onClick={() => setCurrent(i)} aria-label={`View sketch: ${sk.title}`}>
              <div className="sketch__img">
                <Image src={sk.img} alt={`Pencil sketch: ${sk.title}`} sizes="(max-width: 640px) 92vw, (max-width: 1080px) 45vw, 370px" placeholder="blur" />
              </div>
              <div className="sketch__body">
                <h3><PencilIcon /> {sk.title}</h3>
                <p>{sk.note}</p>
                {sk.when && <span className="sketch__when">{sk.when}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Sketch viewer"
        onClose={() => setCurrent(null)}
        onClick={e => { if (e.target === dialog.current) setCurrent(null); }}
        onKeyDown={e => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
      >
        <button className="lightbox__close" onClick={() => setCurrent(null)} aria-label="Close">×</button>
        <button className="lightbox__nav lightbox__nav--prev" onClick={() => move(-1)} aria-label="Previous sketch">‹</button>
        {s && (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element -- natural size needed for the viewer */}
            <img src={s.img.src} alt={`Pencil sketch: ${s.title}`} />
            <figcaption>{s.title}{s.when ? ` · ${s.when}` : ""}</figcaption>
          </figure>
        )}
        <button className="lightbox__nav lightbox__nav--next" onClick={() => move(1)} aria-label="Next sketch">›</button>
      </dialog>
    </section>
  );
}
