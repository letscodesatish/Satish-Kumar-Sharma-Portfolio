"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CERTS, TYPE_LABEL, type CertType } from "@/lib/data";

const FILTERS: { key: "all" | CertType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hackathon", label: "Hackathons" },
  { key: "course", label: "Courses & internships" },
  { key: "competition", label: "Competitions" },
  { key: "activity", label: "Activities" },
];

const src = (img: string) => `/assets/certificates/${img}.jpg`;

export default function Certificates() {
  const [filter, setFilter] = useState<"all" | CertType>("all");
  const [current, setCurrent] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const visible = CERTS.map((c, i) => ({ c, i })).filter(({ c }) => filter === "all" || c.type === filter);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (current !== null && !d.open) d.showModal();
    if (current === null && d.open) d.close();
  }, [current]);

  const move = (dir: 1 | -1) => {
    if (current === null) return;
    const ids = visible.map(v => v.i);
    const pos = ids.indexOf(current);
    setCurrent(ids[(pos + dir + ids.length) % ids.length]);
  };

  const cert = current !== null ? CERTS[current] : null;

  return (
    <section className="section section--alt section--slant" id="certificates">
      <div className="container">
        <div className="section__head reveal">
          <div>
            <h2 className="section__title">Certificates &amp;<br />achievements</h2>
            <p className="section__sub">Click any certificate to view it full size.</p>
          </div>
        </div>

        <div className="chips reveal" role="tablist" aria-label="Filter certificates">
          {FILTERS.map(f => (
            <button key={f.key} role="tab" aria-selected={filter === f.key} className={`chip${filter === f.key ? " is-active" : ""}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="certs">
          {visible.map(({ c, i }) => (
            <button key={c.img} className="cert" onClick={() => setCurrent(i)} aria-label={`View certificate: ${c.title}`}>
              <div className="cert__img">
                <Image src={src(c.img)} alt={`${c.title} certificate`} fill sizes="(max-width: 640px) 90vw, (max-width: 1080px) 45vw, 280px" />
              </div>
              <div className="cert__body">
                <span className="cert__type">{TYPE_LABEL[c.type]}</span>
                <h3 className="cert__title">{c.title}</h3>
                <p className="cert__meta">{c.org} · {c.when}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Certificate viewer"
        onClose={() => setCurrent(null)}
        onClick={e => { if (e.target === dialog.current) setCurrent(null); }}
        onKeyDown={e => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
      >
        <button className="lightbox__close" onClick={() => setCurrent(null)} aria-label="Close">×</button>
        <button className="lightbox__nav lightbox__nav--prev" onClick={() => move(-1)} aria-label="Previous certificate">‹</button>
        {cert && (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element -- natural size needed for the viewer */}
            <img src={src(cert.img)} alt={`${cert.title} certificate`} />
            <figcaption>{cert.title} — {cert.org} · {cert.when}</figcaption>
          </figure>
        )}
        <button className="lightbox__nav lightbox__nav--next" onClick={() => move(1)} aria-label="Next certificate">›</button>
      </dialog>
    </section>
  );
}
