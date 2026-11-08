import type { Metadata, Viewport } from "next";
import { DM_Sans, Noto_Serif } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-sans", display: "swap" });
const serif = Noto_Serif({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-serif", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Satish Kumar Sharma | AI/ML & Full-Stack Developer",
  description:
    "Portfolio of Satish Kumar Sharma, Computer Science student at CSJM University, Kanpur, building AI agents, machine learning models and full-stack web apps.",
  authors: [{ name: "Satish Kumar Sharma" }],
  keywords: ["Satish Kumar Sharma", "portfolio", "AI", "machine learning", "Next.js", "CSJMU", "Kanpur", "developer"],
  openGraph: {
    title: "Satish Kumar Sharma | AI/ML & Full-Stack Developer",
    description: "AI agents, machine learning and full-stack web projects by Satish Kumar Sharma.",
    images: ["/assets/img/profile.png"],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#141925" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available so scroll-reveal styles only apply when they can be undone */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
