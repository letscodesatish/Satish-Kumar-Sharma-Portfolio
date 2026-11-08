import { FlameIcon } from "./Icons";

export default function ActivityStats({ items }: { items: { label: string; value: string }[] }) {
  return (
    <ul className="activity__stats">
      {items.map((s, i) => (
        <li key={s.label}>
          {i === 0 && <FlameIcon />}
          <strong>{s.value}</strong>
          <span>{s.label}</span>
        </li>
      ))}
    </ul>
  );
}
