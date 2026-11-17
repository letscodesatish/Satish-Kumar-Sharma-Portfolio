# Satish Kumar Sharma — Portfolio

Next.js 16 (App Router, TypeScript) portfolio.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production: `npm run build && npm start`

## Contact form

Works with **no password or API key**: messages are delivered to `satish.21.buv@gmail.com` through
[FormSubmit](https://formsubmit.co).

- One-time setup: FormSubmit emails an **Activate Form** link to that inbox the first time; click it once.
- To change the receiving address, edit `email` in `lib/data.ts` (and activate the new address the same way).

Optional: to send through your own Gmail instead, copy `.env.example` to `.env.local` and fill in an
App Password. The form uses it automatically when it's present.

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
