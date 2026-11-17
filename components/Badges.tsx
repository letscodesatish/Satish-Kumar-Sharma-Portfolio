export type BadgeItem = { key: string; name: string; img: string; sub?: string; tier?: string | null; href: string };

/** Compact badge row that sits inside the GitHub / LeetCode profile cards. Images come from each platform. */
export default function Badges({ items }: { items: BadgeItem[] }) {
  if (!items.length) return null;
  return (
    <div className="mini-badges">
      <span className="mini-badges__label">Badges · {items.length}</span>
      <ul>
        {items.map(b => {
          const label = [b.name, b.tier, b.sub].filter(Boolean).join(" · ");
          return (
            <li key={b.key}>
              <a href={b.href} target="_blank" rel="noopener noreferrer" title={label} aria-label={label}>
                {/* eslint-disable-next-line @next/next/no-img-element -- remote badge art from GitHub/LeetCode */}
                <img src={b.img} alt="" width={44} height={44} loading="lazy" />
                {b.tier && <span className="mini-badges__tier">{b.tier}</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
