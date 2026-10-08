# Viki Portfolio

Personal portfolio of **Vishnu "Viki" Muthukumar** — Frontend Developer & Motion Nerd.

Built with **Next.js 14 (App Router)**, **Tailwind CSS v3**, **GSAP** (ScrollTrigger · Draggable · Flip), and **Lenis** smooth scroll.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → http://localhost:3000

# 3. Production build
npm run build
npm start
```

---

## Editing Content

All content lives in `/data/` — no component changes needed.

| File | What to edit |
|------|-------------|
| `data/profile.js` | Name, role, email, social links, resume path, company logos |
| `data/tools.js` | Tool Kit grid items (name, react-icons key, brand colour) |
| `data/experience.js` | Work history, roles, highlights, metrics, award |
| `data/projects.js` | Projects list — each entry generates `/projects/[slug]` |

---

## Replacing Assets

| Asset | Path | Notes |
|-------|------|-------|
| Avatar photo | `/public/avatar.svg` or `avatar.png` | Replace SVG placeholder with your photo; update `profile.js` `avatar` field |
| Company logos | `/public/logos/mai.svg` etc. | Replace with real logos; keep same filenames |
| Project covers | `/public/projects/homura.png` etc. | 1200×630 recommended |
| Resume PDF | `/public/resume.pdf` | Drop your PDF here |
| OG image | `/public/og-image.png` | Replace the SVG with a 1200×630 PNG |
| Favicon | `/public/favicon.ico` | Standard 32×32 ICO |

---

## Updating Social Links

Edit `data/profile.js`:

```js
social: {
  linkedin:  'https://linkedin.com/in/your-handle',
  github:    'https://github.com/your-handle',
  instagram: 'https://instagram.com/your-handle',
  twitter:   'https://twitter.com/your-handle',
},
```

---

## Adding a New Project

Open `data/projects.js` and add an entry:

```js
{
  slug:        'my-project',          // URL: /projects/my-project
  title:       'My Project',
  tagline:     'One-line description',
  description: 'Longer paragraph...',
  cover:       '/projects/my-project.png',
  color:       '#BFFFC9',             // note colour for card bg
  tech:        ['Next.js', 'GSAP'],
  role:        'Solo Developer',
  year:        '2025',
  liveUrl:     'https://...',
  githubUrl:   'https://...',
  challenges:  'What was hard...',
  outcome:     'What was achieved...',
  featured:    true,
}
```

---

## Deploying to Vercel

1. Push your repo to GitHub / GitLab.
2. Import the repository on [vercel.com](https://vercel.com).
3. Vercel auto-detects Next.js — no config needed.
4. Set your production domain and update these two spots:
   - `app/layout.js` → `metadataBase` URL
   - `app/sitemap.js` → `BASE_URL`
   - `app/robots.js` → sitemap URL

### Environment Variables

No env vars are required by default. If you add analytics or a contact form later, add them in the Vercel dashboard.

---

## Architecture Overview

```
/app
  layout.js           Root layout (server) — fonts, metadata, providers
  AppShell.jsx        Client — Loader + page fade reveal
  page.js             Home page (server) — assembles sections
  /projects/[slug]/   Dynamic project detail pages (SSG)
  sitemap.js          Auto-generated sitemap.xml
  robots.js           Auto-generated robots.txt

/components
  layout/
    SmoothScrollProvider  Lenis + GSAP ticker sync
    Sidebar               Desktop left panel
    MobileHeader          Compact top bar (mobile/tablet)
    Dock                  Floating bottom nav with magnification
    Cursor                Custom dot + ring cursor
    Loader                Intro animation screen
  sections/
    Hero / About / Experience / Projects / Contact
  ui/
    StickyNote / ToolCard / SectionTitle / SocialIcon
    ProjectCard / Toast / MascotEyes

/data          Edit these for content changes
/hooks         useMediaQuery, useReducedMotion, useMousePosition
/lib           gsap.js (plugin registration), utils.js
/public        Static assets — replace placeholders with your own
```

---

## Animation Notes

- **GSAP context** (`gsap.context()`) used in every component for clean cleanup.
- **`prefers-reduced-motion`**: heavy animations (parallax, float, cursor, tilt) are disabled; simple fades remain.
- **Lenis** ticked via `gsap.ticker.add(t => lenis.raf(t * 1000))` — never double-RAF.
- **Sticky notes**: GSAP Draggable with `edgeResistance` + elastic settle on release.
- **Dock**: distance-based magnification math (no library), `gsap.quickTo` for smooth resize.

---

## Self-Review: Intentionally Simplified

| Item | Status | Note |
|------|--------|------|
| Avatar photo | ⚠️ SVG placeholder | Replace `/public/avatar.svg` with your photo |
| Company logos | ⚠️ SVG placeholders | Replace with real brand logos |
| Project covers | ⚠️ No images | Add PNGs to `/public/projects/` |
| Resume PDF | ⚠️ Missing | Add your PDF to `/public/resume.pdf` |
| OG image | ⚠️ SVG (not PNG) | Replace with a proper 1200×630 PNG for social sharing |
| GSAP Flip transition | Deferred | ProjectCard → detail page uses a simple scroll reveal instead of GSAP Flip (would require shared layout key across routes) |
| Page transitions | Simple fade | AppShell fade-in; full wipe transition between routes deferred (needs view-transitions API or route-change listener) |
| Search in dock | UI only | Search button visible; modal not implemented |

---

Made with ❤️ in Chennai 🌶️
