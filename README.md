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
| `npm run dev` | Local development server |
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
| `/contact` | Manufacturing inquiry form (UI only; no email backend yet) |
| `/herbaceutical` | Botanical formula catalog |
| `/nutraceutical` | Dietary supplement formula catalog |
| `/organic` | Organic / clean-label formula catalog |

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
- SPA rewrites are already in `vercel.json`
- No server env vars required for the current static inquiry UI

## Project notes for team & client

- Contact and FAQ side forms simulate success locally; wire a real intake (Formspree, API, or CRM) when ready
- Organic catalog currently mirrors Herbaceutical formula lists by design (leave until unique SKUs are provided)
- Do not relocate component folders casually; MainSec layout/animations are sensitive — prefer copy-only edits there
- Production “Stats” block stays commented unless product asks to restore it
