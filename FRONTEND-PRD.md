# Frontend PRD — Sector 6 Jama Masjid Website

> Status: **Draft for approval** · Scope: full frontend (no backend yet) · Builds on [PRODUCT.md](PRODUCT.md) and [DESIGN.md](DESIGN.md).
> This document plans the *rest of the website* around the existing cinematic landing page. Nothing here is built yet — it is the plan to approve before building.

---

## 1. Goal

Grow the project from a single cinematic landing page into a **complete, fully functional frontend** for the Sector 6 Jama Masjid (Bhilai, Chhattisgarh). Every screen is wired with **real data where it can genuinely be real** (prayer times, qibla, Hijri date, map) and **clearly-structured placeholder data everywhere else**, so a future backend can be swapped in with no redesign. Motion stays **fluid, smooth, and catchy** throughout, matching the landing page's damped-scroll feel.

## 2. Scope (approved)

- **Themes:** 4 switchable palettes — Midnight Sapphire (current), Emerald & Gold, Desert Marble (light), Persian Teal & Brass. Gold/brass is the shared accent.
- **Sections:** Core + Media + Learn + Extras (full site).
- **Process:** this PRD → your approval → build in waves.

## 3. A reconciliation note (important)

`PRODUCT.md` lists "glass-heavy card layouts" and "flashy" motion as **anti-references** — for the *storytelling*. We keep that: **the landing page stays reverent and restrained.** The new **utility pages** adopt a *refined* glass system (frosted panels, soft specular highlights) and richer micro-interactions, but held to the same rule: **composed and architectural, never gaudy.** Glass is used for structure (nav, widgets, cards), always with a legibility scrim, never as decoration for its own sake.

---

## 4. Information architecture

```
/                     Landing — cinematic scrollytelling (exists)
/prayer-times         Daily salah timetable + next-prayer countdown (REAL)
/about                History, architecture, the 24 sections, community
/visit                Location, map, hours, directions, etiquette, parking
/events               Programs & calendar (Jummah, Taraweeh, classes, Eid)
/donate               Support tiers & campaigns (UI only)
/contact              Form, details, socials, newsletter
/gallery              Photos + 3D renders, lightbox
/live                 Jummah live-stream (placeholder player)
/sermons              Khutbah / lecture archive
/blog , /blog/[slug]  Announcements & articles
/resources            Learning resources + FAQ
/qibla                Qibla compass (REAL, device orientation)
/ramadan              Ramadan & Eid hub (iftar/sehri, moon sighting, Eid salah)
/volunteer            Volunteer & membership (UI only)
```

**App shell (every page):** glass top nav (logo, links, theme switcher, live "next prayer in …" chip), footer (quick links, prayer summary, socials, newsletter), and a persistent theme + reduced-motion context.

---

## 5. Page specs

| Page | Purpose | Key components | Data | Signature motion |
|---|---|---|---|---|
| **Prayer Times** | The #1 utility | Today's 5 prayers + sunrise/Jummah, next-prayer countdown ring, weekly/monthly table, Hijri date | **REAL** — Aladhan API (Bhilai coords) | Count-up timer, active-prayer glass card glows |
| **About** | Tell the story | Hero still from the 3D, history timeline, architecture breakdown (reuse the 24 sections + renders), community | Placeholder prose + **real** architecture facts from `build-stats.json` | Scroll-reveal timeline, parallax renders |
| **Visit** | Get people there | Embedded map, address, hours, directions, dress-code/etiquette cards, FAQ | **REAL** map/coords; placeholder hours | Pin drop, staggered card reveal |
| **Events** | What's on | Filterable calendar/list, event cards, recurring weekly schedule | Placeholder (`/src/data/events.ts`) | Filter transitions, hover lift |
| **Donate** | Support (UI) | Cause cards, amount selector, tier benefits, impact counters, mock checkout → success state | Placeholder | Animated amount pills, count-ups |
| **Contact** | Reach out | Form (validated, fake submit), details, socials, map mini | Placeholder submit | Inline validation, success morph |
| **Gallery** | Show the place | Masonry grid, lightbox, filter (renders / photos / details) | 3D renders + your photos | Shared-element zoom to lightbox |
| **Live** | Jummah stream | Placeholder player, schedule, past streams | Placeholder | Glass player chrome |
| **Sermons** | Learning archive | Searchable list, speaker/series filters, audio/video cards | Placeholder | Waveform/progress accents |
| **Blog** | News & articles | List + `[slug]` article, categories, share | Placeholder (MDX-ready) | View-transition between list↔article |
| **Resources / FAQ** | Help & links | Accordion FAQ, downloadable resources, external links | Placeholder | Smooth accordion, search filter |
| **Qibla** | Find the direction | Compass dial, heading, distance to Kaaba | **REAL** — computed from coords + device orientation | Needle easing, calibrate state |
| **Ramadan** | Seasonal hub | Sehri/iftar countdown, 30-day table, moon-sighting, Eid salah | **REAL** times + placeholder notices | Day-by-day reveal |
| **Volunteer** | Get involved (UI) | Roles, signup form, membership tiers | Placeholder | Step form transitions |

---

## 6. Theme system

Implemented as **CSS custom properties on `:root[data-theme="…"]`** (extends the OKLCH tokens already in `globals.css`), with a persisted switcher (localStorage) and `prefers-color-scheme` as the default. Gold/brass accent stays in-family across all four so the brand reads consistently. The 3D scene's light tint can optionally shift with the theme.

| Theme | Base | Surface | Primary | Accent | Text | Mode |
|---|---|---|---|---|---|---|
| **Midnight Sapphire** | `oklch(0.13 0.035 255)` | `oklch(0.18 0.05 255)` | `oklch(0.55 0.12 242)` | `oklch(0.72 0.11 78)` | `oklch(0.93 0.012 85)` | dark |
| **Emerald & Gold** | `oklch(0.15 0.045 160)` | `oklch(0.22 0.06 158)` | `oklch(0.55 0.12 160)` | `oklch(0.74 0.11 85)` | `oklch(0.93 0.015 120)` | dark |
| **Desert Marble** | `oklch(0.95 0.012 85)` | `oklch(0.90 0.02 80)` | `oklch(0.62 0.09 55)` | `oklch(0.66 0.10 75)` | `oklch(0.28 0.02 60)` | light |
| **Persian Teal & Brass** | `oklch(0.16 0.05 210)` | `oklch(0.24 0.07 205)` | `oklch(0.60 0.12 195)` | `oklch(0.68 0.11 65)` | `oklch(0.93 0.015 200)` | dark |

*(Starting tokens — tuned for WCAG AA contrast during the build.)*

---

## 7. Design language & motion

- **Glass system:** `backdrop-filter: blur() saturate()`, hairline border, inner top highlight, soft shadow; always a scrim behind glass that sits over imagery. Degrades to a solid translucent surface where `backdrop-filter` is unsupported.
- **Motion principles (the "catchy but smooth" rule):**
  - One shared easing language — exponential ease-out, damped, no bounce (same as the landing page).
  - **Scroll-reveal** on section entry (fade + rise), **count-ups** for numbers/timers, **magnetic** buttons, **parallax** heroes.
  - **View Transitions API** for route changes so navigation feels continuous (shared element: logo, hero image).
  - Every page opens with a brief, composed hero motion; content then settles quickly so it stays usable.
  - All of it respects `prefers-reduced-motion` (reveals become instant, transitions become short fades).
- **Reusable 3D:** page heroes can reuse the existing GLB as a small, static-lit canvas or a pre-rendered still, so the mosque stays the recurring subject without reloading a heavy scene on every page.

## 8. Data plan

- **Genuinely real (client-side, no backend):** prayer times & Jummah (Aladhan API, Bhilai ≈ 21.19°N, 81.38°E), Hijri date, qibla direction/distance, map embed, next-prayer countdown, Ramadan sehri/iftar.
- **Structured placeholders** in `website/src/data/*.ts` (typed, one module per domain: `events`, `sermons`, `blog`, `gallery`, `services`, `faq`, `donationTiers`, `team`) so a backend/CMS later is a drop-in swap.
- **Real facts I'll source:** I'll web-search for anything genuinely published about this specific masjid and use it where found; I won't present invented specifics (founding year, names) as real — those stay labelled placeholder until you provide them.

## 9. Tech & structure

- Next.js 16 App Router (existing). New routes under `src/app/<route>/page.tsx`; shared `(site)` layout with glass nav/footer/theme provider.
- Component library under `src/components/ui/*` (Glass surfaces, Button, Card, Accordion, Countdown, SectionReveal, ThemeSwitcher, PrayerWidget…).
- Keep the landing page untouched; it becomes the `/` route inside the new shell (shell hidden on `/` so the cinematic intro stays full-bleed).
- Performance: lazy-load media, one shared GLB, glass used sparingly; Lighthouse and `prefers-reduced-motion` honoured; WCAG 2.2 AA.

## 10. Build waves (after approval)

0. **Shell & system:** routing, glass nav/footer, theme switcher (4 themes), motion primitives, prayer-time widget.
1. **Core:** Prayer Times, About, Visit, Events, Donate, Contact.
2. **Media:** Gallery, Live, Sermons.
3. **Learn:** Blog, Resources/FAQ.
4. **Extras:** Qibla, Ramadan, Volunteer/Membership.

Each wave ships fully animated, theme-aware, responsive, and reviewable on GitHub before the next.

## 11. What I'll need from you (can start without these; placeholders used meanwhile)

- Logo / wordmark (or I'll design a simple one).
- Real **photos** — the old & aerial images you mentioned (for Gallery, About, and the future Eidgah).
- Real **contact details**: address, phone, email, social links.
- Confirm the **exact name** ("Sector 6 Jama Masjid" vs "Sector 6 Mosque") and exact map location/coords.
- **Languages**: English only for now, or plan Hindi/Urdu toggle?
- Donation provider & any real event/timing info (can come later).

## 12. Open questions

1. Keep the glass/micro-interactions **subtle** (lean toward PRODUCT.md restraint) or **bolder/showcase** on utility pages? (Default: subtle-premium.)
2. Should every page hero reuse the **live 3D** mosque, or **pre-rendered stills** for speed? (Default: stills, with live 3D on Home + About.)
3. Eidgah on the right side — add to the 3D model in a later pass once you share images (not in this frontend build). Confirmed?
