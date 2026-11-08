# Satish Kumar Sharma — Portfolio

Next.js 16 (App Router, TypeScript) portfolio.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production: `npm run build && npm start`

## Contact form setup (real emails)

1. Turn on 2-Step Verification on your Google account.
2. Create an App Password at https://myaccount.google.com/apppasswords
3. Copy `.env.example` to `.env.local` and paste the 16-character app password into `SMTP_PASS`.
4. Restart the dev server.

Without these variables the form shows a "not set up yet" message with a direct email link.

## Resume download

Put your PDF at `public/assets/resume/Satish_Kumar_Sharma_Resume.pdf` and rebuild.
The "Download CV" buttons appear automatically once the file exists.

## Editing content

All text lives in `lib/data.ts`: projects, skills, experience, education, awards, certificates.
Certificate images go in `public/assets/certificates/` (the `img` field is the file name without `.jpg`).

## GitHub & LeetCode sections (auto-updating)

Fetched on the server and refreshed every hour, with no action needed:
- **GitHub**: profile stats, latest repos, and the contribution graph (read from your public GitHub calendar).
- **LeetCode** (`letscodesatish18`): solved counts by difficulty, ranking, recent accepted problems, and the submission streak graph.

Optional: set `GITHUB_TOKEN` (a classic token with no scopes is enough) to load the contribution graph through
GitHub's official API instead of the public page, which is more reliable and raises API limits.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it at https://vercel.com/new
3. Add the `SMTP_*` and `CONTACT_TO` environment variables in Project → Settings → Environment Variables.
4. Optionally set `NEXT_PUBLIC_SITE_URL` to your live URL (used for link previews).
