import type { ReactNode } from "react";
import type { ServiceIcon } from "@/lib/data";

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {children}
    </svg>
  );
}

export const GitHubIcon = () => (
  <Svg>
    <path fill="currentColor" stroke="none" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </Svg>
);
export const LinkedInIcon = () => (
  <Svg>
    <path fill="currentColor" stroke="none" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-1 1.84-2.05 3.8-2.05 4.06 0 4.82 2.67 4.82 6.15v5.4h-4v-4.79c0-1.14-.02-2.61-1.59-2.61-1.6 0-1.84 1.24-1.84 2.53v4.87h-4v-11Z" />
  </Svg>
);
export const LeetCodeIcon = () => (
  <Svg>
    <path fill="currentColor" stroke="none" d="M13.48 0a1.37 1.37 0 0 0-.96.44L7.12 6.21l-2.87 3.07a5.16 5.16 0 0 0-1.2 2.11 5.7 5.7 0 0 0-.13.94c-.03.4 0 .82.08 1.22a5.3 5.3 0 0 0 1.46 2.75l4.36 4.39c1.66 1.66 4.37 1.67 6.03 0l2.64-2.65a1.38 1.38 0 0 0-1.95-1.95l-2.64 2.65a1.53 1.53 0 0 1-2.13 0L6.4 14.35a2.57 2.57 0 0 1-.7-1.27 2.8 2.8 0 0 1 0-1.08c.08-.44.29-.84.6-1.17l2.92-3.13 5.39-5.78A1.38 1.38 0 0 0 13.48 0Zm-3.02 13.06a1.38 1.38 0 1 0 0 2.75h9.88a1.38 1.38 0 1 0 0-2.75Z" />
  </Svg>
);
export const InstagramIcon = () => (
  <Svg><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></Svg>
);
export const YouTubeIcon = () => (
  <Svg>
    <path fill="currentColor" stroke="none" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </Svg>
);
export const PencilIcon = () => (<Svg><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></Svg>);
export const FlameIcon =() => (<Svg><path d="M12 22c4 0 7-2.7 7-6.8 0-4.4-3.6-6.6-4.4-10.7-.1-.5-.7-.7-1-.3C12 6 11 8.5 11.5 11c-1.2-.7-2-2.1-2.1-3.4 0-.5-.6-.7-.9-.3C6.6 9.3 5 12 5 15.2 5 19.3 8 22 12 22Z" /></Svg>);
export const MailIcon =() => (<Svg><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Svg>);
export const PhoneIcon = () => (<Svg><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></Svg>);
export const PinIcon = () => (<Svg><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></Svg>);
export const DownloadIcon = () => (<Svg><path d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16" /></Svg>);
export const ExternalIcon = () => (<Svg><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></Svg>);
export const ArrowUpRight = () => (<Svg><path d="M7 17 17 7M8 7h9v9" /></Svg>);
export const ChevronLeft = () => (<Svg><path d="m15 18-6-6 6-6" /></Svg>);
export const ChevronRight = () => (<Svg><path d="m9 18 6-6-6-6" /></Svg>);
export const ChevronUp = () => (<Svg><path d="m6 15 6-6 6 6" /></Svg>);
export const TrophyIcon = () => (<Svg><path d="M8 4h8v5a4 4 0 0 1-8 0Z" /><path d="M8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8" /></Svg>);
export const UserIcon = () => (<Svg><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></Svg>);
export const CodeIcon = () => (<Svg><path d="m8 6-6 6 6 6M16 6l6 6-6 6" /></Svg>);
export const CapIcon = () => (<Svg><path d="M2 9l10-5 10 5-10 5Z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></Svg>);

const SERVICE_PATHS: Record<ServiceIcon, ReactNode> = {
  agent: (<><rect x="5" y="7" width="14" height="11" rx="3" /><path d="M12 3v4M9 12h.01M15 12h.01M9 15h6M2 12h3M19 12h3" /></>),
  ml: (<><circle cx="6" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="12" r="2" /><circle cx="12" cy="12" r="1.5" /><path d="M8 6.8 10.8 11M8 17.2l2.8-4.2M13.5 12H16" /></>),
  web: (<><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 8h18M8 21h8M12 18v3M9 12l-2 2 2 2M15 12l2 2-2 2" /></>),
  data: (<><path d="M3 3v18h18" /><path d="m7 15 4-5 3 3 5-7" /><circle cx="19" cy="6" r="1" /></>),
  dsa: (<><path d="M12 2 3 7v10l9 5 9-5V7Z" /><path d="M3 7l9 5 9-5M12 12v10" /></>),
};
export const ServiceGlyph = ({ name }: { name: ServiceIcon }) => <Svg>{SERVICE_PATHS[name]}</Svg>;
