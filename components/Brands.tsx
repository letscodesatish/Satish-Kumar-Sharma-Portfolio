import { BRANDS } from "@/lib/data";

export default function Brands() {
  return (
    <section className="section" id="brands">
      <div className="container">
        <h2 className="section__title reveal">Organisations I&apos;ve<br />learned &amp; competed with</h2>
        <p className="section__sub reveal">Programs, hackathons and platforms behind my certificates.</p>
        <ul className="brands reveal">
          {BRANDS.map(b => (
            <li key={b.name}><strong>{b.name}</strong><span>{b.sub}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
