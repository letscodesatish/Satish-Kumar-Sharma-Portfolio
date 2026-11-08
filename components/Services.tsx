import { SERVICES } from "@/lib/data";
import { ServiceGlyph } from "./Icons";

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <h2 className="section__title reveal">What I can do<br />for your team</h2>
        <div className="services">
          {SERVICES.map((s, i) => (
            <article key={s.title} className="service reveal" style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
              <div className="service__icon"><ServiceGlyph name={s.icon} /></div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
