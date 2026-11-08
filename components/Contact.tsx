"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import contactImg from "@/public/assets/img/contact.png";
import { PROFILE } from "@/lib/data";
import { DownloadIcon, GitHubIcon, InstagramIcon, LeetCodeIcon, LinkedInIcon, MailIcon, PhoneIcon, PinIcon, YouTubeIcon } from "./Icons";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Please enter a valid email address.";
  if (f.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
  return e;
}

export default function Contact() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "ok" | "bad"; text?: string; fallback?: boolean }>({ kind: "idle" });

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...fields, [k]: e.target.value };
    setFields(next);
    if (errors[k]) setErrors(validate(next));
  };

  const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent(`Portfolio enquiry from ${fields.name.trim() || "a visitor"}`)}&body=${encodeURIComponent(fields.message)}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`c-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, company: form.get("company") }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ kind: "ok", text: "Thanks! Your message has been sent. I'll reply soon." });
        setFields({ name: "", email: "", message: "" });
      } else {
        setStatus({ kind: "bad", text: data.error ?? "Something went wrong.", fallback: true });
      }
    } catch {
      setStatus({ kind: "bad", text: "Network error.", fallback: true });
    }
  }

  return (
    <section className="section" id="contact">
      <div className="container contact">
        <div className="contact__head reveal">
          <h2 className="section__title">Contact me</h2>
          <p className="section__sub">Have an internship, project or hackathon idea? Send me a message and I&apos;ll get back to you.</p>
        </div>

        <div className="contact__photo reveal">
          <Image src={contactImg} alt="Satish Kumar Sharma" sizes="(max-width: 640px) 120px, 260px" />
        </div>

        <div className="contact__info reveal">
          <ul className="contact__list">
            <li><span className="ic"><PhoneIcon /></span><a href={PROFILE.phoneHref}>{PROFILE.phone}</a></li>
            <li><span className="ic"><MailIcon /></span><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></li>
            <li><span className="ic"><PinIcon /></span><span>{PROFILE.location}</span></li>
          </ul>
          <ul className="contact__social" aria-label="Find me online">
            <li><a href={PROFILE.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon /></a></li>
            <li><a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a></li>
            <li><a href={PROFILE.leetcode} target="_blank" rel="noopener noreferrer" aria-label="LeetCode"><LeetCodeIcon /></a></li>
            <li><a href={PROFILE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a></li>
            <li><a href={PROFILE.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><YouTubeIcon /></a></li>
          </ul>
          <a href={PROFILE.resume} className="btn btn--outline contact__cv" download>
            <DownloadIcon /> Download resume
          </a>
        </div>

        <form className="form reveal" onSubmit={onSubmit} noValidate>
          {/* Honeypot: hidden from people, bots tend to fill it */}
          <input className="hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <div className={`field${errors.name ? " has-error" : ""}`}>
            <label htmlFor="c-name">Name</label>
            <input id="c-name" type="text" autoComplete="name" placeholder="Your name" value={fields.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby="e-name" maxLength={100} />
            <small className="err" id="e-name">{errors.name}</small>
          </div>
          <div className={`field${errors.email ? " has-error" : ""}`}>
            <label htmlFor="c-email">Email address</label>
            <input id="c-email" type="email" autoComplete="email" placeholder="you@example.com" value={fields.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby="e-email" maxLength={200} />
            <small className="err" id="e-email">{errors.email}</small>
          </div>
          <div className={`field${errors.message ? " has-error" : ""}`}>
            <label htmlFor="c-message">Message</label>
            <textarea id="c-message" rows={5} placeholder="Tell me about your project…" value={fields.message} onChange={set("message")} aria-invalid={!!errors.message} aria-describedby="e-message" maxLength={5000} />
            <small className="err" id="e-message">{errors.message}</small>
          </div>

          <button type="submit" className="btn btn--solid" disabled={status.kind === "sending"}>
            {status.kind === "sending" ? "Sending…" : "Send message"}
          </button>
          <p className={`form__note ${status.kind === "ok" ? "ok" : status.kind === "bad" ? "bad" : ""}`} role="status">
            {status.text}
            {status.fallback && <> You can also <a href={mailto}>email me directly</a>.</>}
          </p>
        </form>
      </div>
    </section>
  );
}
