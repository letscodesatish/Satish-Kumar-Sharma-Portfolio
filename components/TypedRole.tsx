"use client";

import { useEffect, useState } from "react";

export default function TypedRole({ roles }: { roles: string[] }) {
  const [text, setText] = useState(roles[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let r = 0, i = roles[0].length, deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = roles[r];
      i += deleting ? -1 : 1;
      setText(word.slice(0, i));
      let wait = deleting ? 35 : 70;
      if (!deleting && i === word.length) { deleting = true; wait = 2200; }
      else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; wait = 350; }
      timer = setTimeout(tick, wait);
    };
    timer = setTimeout(tick, 2600);
    return () => clearTimeout(timer);
  }, [roles]);

  return (
    <p className="hero__role">
      <span className="sr-only">{roles[0]}</span>
      <span aria-hidden="true">{text}</span>
      <span className="caret" aria-hidden="true" />
    </p>
  );
}
