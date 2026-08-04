# Zephyr

B2B marketing site for **Zephyr**, a CDMO / private-label dietary supplement manufacturing partner. Product ranges: Nutraceutical, Herbaceutical, and Organic.

Factual claims on the site (facility size, monthly capacity, address, CIN, GMP/ISO, formats, and India · Spain · USA partnerships) follow **Biofern Life Sciences** source-of-truth data, presented under the Zephyr brand. Do not invent new company claims.

## Tech stack

- Vite 8 + React 19 + TypeScript
- React Router 7
- Tailwind CSS 4
- Framer Motion
- `react-helmet-async` (per-route SEO)
- Deployed as a SPA on **Vercel** (`vercel.json` rewrites all routes to `index.html`)

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite SPA + local `/api/send-otp` and `/api/verify-otp` (loads `.env`) |
| `npx vercel dev` | Optional: same stack via Vercel CLI (closer to production) |
| `npm run build` | Typecheck (`tsc -b`) + production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `node scripts/compress-images.mjs` | Regenerate WebP variants for key PNGs (requires `sharp`) |

## Route map

| Path | Page |
|------|------|
| `/` | Homepage — hero ranges, about, capacity, formats, explore, FAQ |
| `/research` | R&D / NPD — pilot, stability, commercial transfer |
| `/production` | Facilities, QA/QC, process, partner advantage |
| `/gallery` | Facility & equipment photo gallery |
| `/contact` | Manufacturing inquiry — company email OTP, then EmailJS enquiry |
| `/herbaceutical` | Botanical formula catalog |
| `/nutraceutical` | Dietary supplement formula catalog |
| `/organic` | Organic / clean-label formula catalog |
| `/skincare` | ALFURIN® skincare showcase (lotion + cream) — partner MOQ via Zephyr |

## Content & facts

Keep published facts aligned with Biofern source material:

- **Facility:** 65,000 sq ft · Plot #168-P5, Vemgal Industrial Area, Kolar District, Karnataka, India  
- **CIN:** `U24100KA2019PTC120330`  
- **Capacity (monthly):** up to 5B tablets · 100M capsules · 60M sachets · 1M jars  
- **Quality:** GMP / ISO / cGMP systems  
- **Markets:** India manufacturing · Spain & USA partners  
- **Positioning:** private label / contract manufacturing / MOQ on inquiry — not retail

When editing copy, use US B2B CDMO tone (brand owners, procurement, R&D partners). Avoid retail or wellness-influencer language.

## SEO & performance

Already in place:

- Meta description, Open Graph / Twitter tags, canonical URLs via `src/Global/Seo.tsx` + `index.html`
- `public/robots.txt` and `public/sitemap.xml` (update the domain if the production URL changes)
- Favicon at `public/favicon.svg`
- Route-level code splitting (`React.lazy` in `App.tsx`)
- Primary heroes and packaging assets served as **WebP** (PNG masters kept for regeneration)
- Subset Google Fonts (Manrope + Plus Jakarta Sans, weights 400–700)
- Unused deps removed (`three`, `flubber`, `react-icons`); unused Unsplash CTA module removed

**Before / after (expected Lighthouse impact):**

| Area | Before | After approach |
|------|--------|----------------|
| LCP heroes | ~5–6 MB PNG each | ~60–70 KB WebP @ ≤900px |
| Packaging marquee | ~1 MB PNG × many | ~5–20 KB WebP each |
| SEO audit | Missing description / OG / robots / sitemap / favicon | Present |
| JS | Single ~500 KB chunk | Split by route |
| Dead weight | `three`, flag-icons CDN, unused branded PNGs | Removed |

Re-check after deploy:

1. `npm run build && npm run preview`
2. Chrome DevTools → Lighthouse (Mobile) on `/`
3. Confirm document title/description change on route navigation

If the live domain is not `https://zephyr.vercel.app`, update:

- `SITE_URL` in `src/Global/Seo.tsx`
- Canonical / OG URLs in `index.html`
- `public/robots.txt` and `public/sitemap.xml`

## Deploy (Vercel)

- Connect the Git repo to Vercel
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrites in `vercel.json` exclude `/api/*` so serverless OTP routes work
- Copy `.env.example` → `.env` locally; add the **same** keys in the Vercel project → Settings → Environment Variables, then **redeploy**

### Contact form env vars

| Variable | Where used | Notes |
|----------|------------|--------|
| `VITE_EMAILJS_SERVICE_ID` | Browser enquiry + OTP API fallback | EmailJS service |
| `VITE_EMAILJS_TEMPLATE_ID` | Browser enquiry only | Inquiry template |
| `VITE_EMAILJS_PUBLIC_KEY` | Browser enquiry + OTP API fallback | Public key |
| `EMAILJS_OTP_TEMPLATE_ID` | `/api/send-otp` | Params: `{{OTP}}` / `{{otp}}`, `{{time}}`, `{{email}}` (To Email = `{{email}}`) |
| `EMAILJS_SERVICE_ID` | Optional server override | Defaults to `VITE_EMAILJS_SERVICE_ID` |
| `EMAILJS_PUBLIC_KEY` | Optional server override | Defaults to `VITE_EMAILJS_PUBLIC_KEY` |
| `EMAILJS_PRIVATE_KEY` | `/api/send-otp` | **Required** when EmailJS Security uses API strict mode (Account → General → API keys → Private Key) |

**EmailJS Account → Security:** turn on **API requests from non-browser / Node.js**. If strict mode is on, also set `EMAILJS_PRIVATE_KEY`.
| `UPSTASH_REDIS_REST_URL` | OTP APIs | Upstash REST URL — **no** `VITE_` prefix |
| `UPSTASH_REDIS_REST_TOKEN` | OTP APIs | Upstash REST token — **no** `VITE_` prefix |
| `OTP_SECRET` | OTP APIs | Long random HMAC secret — **no** `VITE_` prefix |

Never commit `.env`. Do not expose Redis token or `OTP_SECRET` to the client.

### Contact OTP flow

1. User submits details (company email required) on step 1; OTP is verified on the same step.
2. `POST /api/send-otp` validates email, rate-limits, stores a hashed 6-digit OTP in Upstash (10 min TTL), emails the code via EmailJS OTP template.
3. User enters the code on step 1 → `POST /api/verify-otp` (attempt limits) marks the email verified in Redis.
4. Client then sends the existing enquiry EmailJS template and advances to step 2 (confirmation).

Local OTP APIs run under `npm run dev` via a Vite middleware plugin (`vite-otp-api.plugin.ts`). Production uses Vercel serverless functions as ESM JavaScript under `/api` (`.js`, not `.ts`) so they work with `"type": "module"`.

## Project notes for team & client

- Contact form: EmailJS OTP verify, then EmailJS enquiry to the configured inbox; FAQ side note is still local-only UI
- Organic catalog currently mirrors Herbaceutical formula lists by design (leave until unique SKUs are provided)
- Do not relocate component folders casually; MainSec layout/animations are sensitive — prefer copy-only edits there
- Production “Stats” block stays commented unless product asks to restore it
