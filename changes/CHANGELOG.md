# Change log — ख़बर सेतु (Khabar Setu)

Newest first. One entry per task; entries are never rewritten.

---

## 2026-11-20 — Reader site M0–M6 + DPDP/consent foundation + SEO

**Scope:** PRD §12 milestones M0 (setup), M1 (design system), M2 (layout shell),
M3 (mock data layer), M4 (homepage), M5 (article), M6 (category / state / city /
author / tag / search / videos / web stories / photos / rashifal / live / static
/ 404), plus SEO (M8 partial) and the India DPDP compliance foundation that the
project rules require before features.

### Threat model (built with the change)

| Asset | Actor | Entry point | Abuse case | Defence (layer) |
|---|---|---|---|---|
| Consent ledger | Script kiddie | `POST /api/consent` | Flood the ledger, forge purposes/status | 20 writes / 10 min per IP (429) · 4 KB body cap · enum allow-list → 400 · *prevent + detect* |
| Email list | Spammer | `POST /api/newsletter` | List-bombing, signup without consent, address harvesting | 5 / hour per IP · server-side consent check · identical response regardless of membership · *prevent* |
| Personal data | Impersonator | `POST /api/privacy-request` | Request someone else's data / erasure | Request is only acknowledged; identity verified by the Grievance Officer before disclosure · 5 / hour per IP · *prevent + process* |
| Origin | Anyone | `/api/search`, `/api/state-feed`, `/api/live/*` | Hammer the most expensive reads | Per-IP limits (60/min, 120/min, 240/min) + cacheable responses · *prevent* |
| Reader privacy | Ad/analytics vendor | Any page | Tracking before consent | No vendor script is rendered at all until its purpose is granted **and** its flag is on; `AdSlot` never loads a network · *prevent* |
| Reader | Malicious content | Article body | HTML/script injection via CMS content | Body is structured blocks, never raw HTML; no `dangerouslySetInnerHTML` outside self-generated JSON-LD · *prevent* |

Negative tests for these live in `tests/consent.test.ts` and were also checked
end-to-end against the running server (forged purpose → 400, newsletter without
consent → 400, valid consent → 201 with a ledger row).

### Added

- **Tokens & fonts** (`app/globals.css`, DESIGN §2): brand/ink/line/soft/navy/gold
  palette, Mukta (Devanagari + Latin) and Inter via `next/font`, the type scale as
  `@utility` classes with Devanagari-safe line-heights, ticker marquee and
  reduced-motion rules.
- **Config**: `lib/site.ts` (brand, legal entity, grievance officer, social, fail-closed
  feature flags — all real-world facts read from env with visible placeholders),
  `messages/hi.json` (every UI string, ready for an `en.json` edition).
- **Data layer** (`lib/data/*`, `lib/cms/*`): typed content model, 100 demo stories
  across 14 categories and 18 states, 3 live blogs, 7 web stories, 5 galleries,
  12 rashi signs, ticker, trending tags and home curation. Pages read only through
  `lib/cms`, which caches with `use cache` + `cacheLife` (home/category 60s,
  articles daily + `cacheTag('story-<id>')` for on-demand revalidation).
- **Widget services** (`lib/services/widgets.ts`): weather, AQI, market and cricket
  adapters returning `{ data, updatedAt, isDemo }`; the UI shows a "डेमो" label and an
  "अपडेटेड" stamp (FR-H7).
- **Design system** (`components/news/*`, `components/ui/*`): CategoryLabel, TimeAgo,
  LiveBadge, TagChip, SideHeading, StoryImage with play/duration/photo-count/live
  overlays, seven StoryCard variants, SectionHeader with the notched red tab,
  AdSlot (every size reserves its box), Ticker, TrendingTags, Logo, plus shadcn-style
  Button/Input/Sheet/Tabs/Accordion/Dialog restyled to the tokens. Preview at
  `/dev/components` (404s in production).
- **Layout shell** (`components/layout/site-shell.tsx`): utility bar with weather/AQI
  city picker, 108px masthead, red nav with states mega-menu, mobile header (full and
  reading variants), full-screen menu sheet with the state grid, bottom tab bar and
  the five-column footer.
- **Pages**: homepage (all of DESIGN §5), article (highlights, byline, font size, share,
  auto read-also, in-article ads, pull quote, tags, corrections, related),
  category / state / city / author / tag / search / videos / web stories (full-screen
  player) / photos (gallery viewer) / rashifal / live blog (polling + "नए अपडेट" pill) /
  e-paper / newsletter / HTML sitemap / 404 / error boundary.
- **DPDP foundation**: versioned notices in one source (`lib/legal/notices.ts`) served to
  the site and to `/api/legal`, cookie banner with equal-weight accept/reject + per-purpose
  panel, append-only consent ledger, "आपकी सहमतियां" dashboard with history and withdrawal,
  grievance page with the rights-request form, and `ConsentScripts` as the only place a
  third-party script may load.
- **SEO**: per-page metadata and canonicals, `NewsArticle` / `LiveBlogPosting` /
  `BreadcrumbList` / `ProfilePage` / `WebSite`+SearchAction JSON-LD, `sitemap.xml`,
  `news-sitemap.xml` (48h), `/rss` and `/rss/<category>`, `robots.txt`, default OG image,
  301 from a stale slug to the canonical article URL.
- **Tests** (`tests/`, Vitest): 48 tests covering transliterated search, Hindi date/number
  formatting, the data layer's curation/pagination/related/ticker-expiry rules, consent
  validation, rate limiting and the legal notices.
- **Tooling**: `pnpm typecheck|lint|test|check`, `scripts/screenshot.mjs` (responsive
  screenshots + horizontal-overflow check), `scripts/overflow.mjs`.

### Changed

- `app/layout.tsx` replaced the create-next-app starter: `lang="hi"`, Mukta/Inter, consent
  provider, skip link.
- ESLint now ignores `docs/` (design-kit reference material) and `.screens/`.

### Verified

| Check | Command | Result |
|---|---|---|
| Types | `pnpm typecheck` | clean |
| Lint | `pnpm lint` | 0 errors, 0 warnings |
| Unit tests | `pnpm test` | 48 passed |
| Build | `next build` | 313 static pages, homepage `revalidate 1m / expire 1h` |
| Responsive | `scripts/screenshot.mjs` at 360/390/768/1024/1280/1440/1920 | no horizontal scroll on home, article, category, search, live, gallery, consent, 404 |
| Visual | compared with `docs/reference/01–03` | homepage, article and mobile screens match; deviations listed in `docs/known-gaps.md` |
| Security | live requests against `next start` | forged consent → 400, newsletter without consent → 400, valid consent → 201 + ledger row |

### Notes

- The demo clock is fixed at `2026-11-20T13:10 IST` (`lib/data/clock.ts`) so relative
  times are deterministic and the whole site prerenders. The CMS milestone replaces it
  with the real clock behind `<Suspense>`.
- Icons come from the free Hugeicons set, not lucide as DESIGN §4.5 suggests — the
  project-wide icon rule takes precedence.
- Known gaps and owner-only tasks: `docs/known-gaps.md`, `docs/owner-todo.md`.
