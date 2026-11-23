# Change log — Daydreams News

Newest first. One entry per task; entries are never rewritten.

---

## 2026-11-23 — Remove the last traces of the placeholder brand name

**Scope:** the owner confirmed the app is **Daydreams News** and the old placeholder
name must appear nowhere. The visible brand was already switched over with the logo
work below; this entry clears the leftovers — storage keys, demo account addresses,
doc titles and folder names.

### Threat model (built with the change)

| Asset | Actor | Entry point | Abuse case | Defence (layer) |
|---|---|---|---|---|
| Reader consent proof | — | Renamed consent cookies | A renamed cookie reads as "no choice made", so a reader who had chosen is asked again | Accepted deliberately pre-launch: the ledger rows are untouched, optional purposes stay **off** until re-accepted, and the `cookies` notice version is bumped so new records say which text was shown · *prevent* |
| Panel accounts | Operator | Renamed scrypt salt | Hashes derived from a different salt could silently accept a stale password | Hashes are derived at module load from `ADMIN_DEV_PASSWORD`, never stored, so the salt change has no persisted effect; sign-in re-verified end to end · *prevent* |
| Dev credentials | — | `.env.local` | The old name survives in a local password value | Left untouched on purpose (changing it would break the owner's logins) and recorded in `docs/owner-todo.md` — it is local-only and not in git · *detect* |

### Changed

- **Storage keys `ks_*` → `dn_*`** — `dn_consent`, `dn_visitor`, `dn_consent_log`,
  `dn_city`, `dn_state`, `dn_font_step` (`lib/consent/client.ts`,
  `lib/preferences.ts`) and the panel's `dn_admin_session`
  (`lib/admin/session.ts`), plus the two helper scripts that set them.
- **Cookie Policy** (`lib/legal/notices.ts`): the table lists the new names, and
  `NOTICE_VERSIONS.cookies` is bumped to `2026-11-23` because the text changed.
  Every consent record written from now on carries `cookies@2026-11-23`.
- **Demo panel accounts**: `@khabarsetu.test` → `@daydreamsnews.test` and the scrypt
  salt renamed (`lib/admin/users.ts`, `scripts/admin-screens.mjs`,
  `tests/admin-rbac.test.ts`).
- **Docs**: titles of `README.md`, `docs/project-rules.md`, `docs/known-gaps.md`,
  `docs/owner-todo.md`, `docs/ROLES_AND_DASHBOARDS.md`, `changes/CHANGELOG.md`, plus
  the brand passages in `docs/PRD.md` (open question §15.1 answered), `docs/DESIGN.md`
  (the §0 "placeholder name" note and the §4 Logo row now describe the real logo) and
  `docs/GRAPHICS_PROMPTS.md` (the OG-card prompt is replaced by "generated from the
  real logo — never AI-generate the brand card").
- **Renamed** `docs/khabar-setu-design-kit_1/` → `docs/design-kit-original/` and the
  delivered zip alongside it. Contents are byte-identical to the as-delivered kit.

### Deliberately left alone

- `docs/reference/**` and `docs/design-kit-original/**` — the prototypes and the three
  reference PNGs are the visual baseline the build is compared against. The PNGs show
  the placeholder masthead and cannot be re-rendered, so editing only the HTML would
  break the pair. They are design input, never shipped.
- The body of the brand-identity entry below, which records the placeholder it
  replaced. Old change-log entries are not rewritten.
- `.env.local` (see the threat model).

### Verified

| Check | Command | Result |
|---|---|---|
| Types | `npx tsc --noEmit` | clean |
| Lint | `npx eslint .` | 0 errors, 0 warnings |
| Tests | `npx vitest run` | 76 passed (6 files) |
| Build | `npx next build` | 327 pages, compiled clean |
| Built output | `grep` for the old name across `.next/server/app` (310 HTML files) + `.next/static` | **no match** |
| Reader, on `next start` | accept-all on `/`, then read cookies + localStorage | `dn_consent`, `dn_visitor`, `dn_consent_log`; no `ks_*`; page text has the new brand and not the old |
| Cookie Policy | `/cookies` | lists `dn_city` / `dn_consent`, no `ks_` key |
| Panel | sign in as `desk@daydreamsnews.test` | works; session cookie `dn_admin_session`; dashboard shows the new brand |

Readers who had already made a cookie choice locally will see the banner once more —
that is the cost of renaming the cookie, and it is the right time to pay it.

---

## 2026-11-23 — Brand identity: Daydreams News logo, favicons, app icons, SEO and social images

**Scope:** the owner supplied the Daydreams News logo (transparent and on-light
versions). All brand files are now generated from it, and the site uses it in
place of the placeholder "ख़बर सेतु" mark.

### Added
- **Master and generator.** `docs/brand/source/` holds the supplied logos.
  `scripts/brand-assets.mjs` (Playwright Chromium only, nothing new installed)
  derives 44 files. It splits each pixel into navy/gold/white weights to make
  reverse and mono versions, and upscales the ~350 px swan 3× with re-sharpened
  edges. Composed designs are HTML rendered to PNG, so Devanagari is shaped correctly.
- **Logo set** (`public/brand/logo`, `public/brand/mark`): full colour, reverse,
  mono white/navy/black, stacked, wordmark only, and 1200/600/300 px email widths.
- **Icons:** `app/favicon.ico` (16/32/48), `app/icon.png` (192),
  `app/apple-icon.png` (180), manifest icons 192/512 in `any`, `maskable`
  and `monochrome` versions, and `app/manifest.ts` (`/manifest.webmanifest`).
- **SEO:** a static `app/opengraph-image.png` and `app/twitter-image.png` with
  Hindi alt text, a square organisation logo used in `NewsMediaOrganization`
  JSON-LD, a 60 px publisher logo, and a web-story publisher logo.
- **Social:** avatars (white and navy), plus covers for X, Facebook, YouTube
  and LinkedIn.
- **Docs:** `docs/brand/BRAND.md` (colours, versions, clear space, where each
  file goes) and the contact sheet `docs/brand/preview.png`.
- **Tests:** `tests/brand-assets.test.ts` (9). Each `site.brand` file and
  manifest icon must exist at its declared size, the app icon conventions must
  be present, and the ICO must hold 16/32/48 px frames.

### Changed
- `lib/site.ts`: the brand name is **Daydreams News** (`name` and `nameLatin`).
  New `site.brand` image paths and `logoNavy`/`logoGold` colours. Removed
  `site.mark`.
- `components/layout/logo.tsx`: `Logo` renders the logo image (reverse version
  in the dark footer) at the old masthead heights. `LogoMark` is the swan on a
  white tile and is now used by the mobile reading header, the web-story
  player, the admin sidebar and topbar, and the admin login.
- Removed `app/opengraph-image.tsx` (the Latin-only "KS" card), replaced by the
  static card.
- Replaced the hard-coded old name in the newsletter consent text, the admin
  title template, the web-story chrome and the demo data.
- **Privacy Notice version bumped to `2026-11-23`**, because its text includes
  the brand name. New consents record the new version. Other versioned notices
  don't mention the name and are unchanged.

### Threat model (2 min)
Static public images and a manifest only. No new input, endpoint, personal
data, tracker or processor, so no DPDP purpose change. The generator is
dev-only, reads one local file, and serves it to the headless browser from an
intercepted fake origin with no network fetch. Nothing needs a new rate limit
or authorisation check.

### Verified
| Check | Command | Result |
|---|---|---|
| Types / lint / tests | `pnpm check` | clean, 0 lint errors, 76 tests passed (67 existing + 9 new) |
| Build | `next build` | succeeded, 327 static pages |
| Head tags | `curl /` on `next start` | favicon.ico, icon.png 192, apple-touch-icon 180, manifest, og:image and twitter:image 1200×630 with alt |
| Responsive | `scripts/screenshot.mjs` home 390/1440, `/admin/login` 390, `/web-stories` 390 | 0 px overflow; header, mobile header and footer logos checked by eye |

### Notes
- Lighthouse was not re-run. The logo is a `next/image` (served as AVIF/WebP at
  display size, `loading="eager"`), not the LCP element.
- The site's UI colours are still the earlier red theme (G29).

---

## 2026-11-21 — Fix: cookie-banner hydration mismatch + Cache Components insights on the panel

**Scope:** a reported hydration error on the homepage, and the two dev-overlay
insights it uncovered on `/admin`. No feature or UI change — the banner, the
panel and the consent ledger behave exactly as before.

### Fixed

- **Hydration mismatch in `components/consent/cookie-banner.tsx`.** The banner sits
  in its own `<Suspense>` boundary (it reads `usePathname()` to stay off `/admin`),
  while `ConsentProvider` sits above it in the root layout. The provider hydrates
  first, so by the time the boundary hydrated the consent store had already swapped
  in the browser value: the hydration render drew a banner the server HTML did not
  contain, and React discarded and re-rendered the tree.
  New `useHasMounted()` in `lib/client-store.ts` — a per-instance flag that is
  `false` on the server **and** on the hydration render — gates the banner, so both
  renders agree and the real value is applied in the commit right after.
- **`blocking-prerender-current-time` on `/admin/login`.** `currentUser()` compared
  the session expiry with `Date.now()` during a prerender. It now `await`s
  `connection()` first (`lib/admin/session.ts`), which states the truth: a session
  can only be verified once there is a request.
- **`blocking-prerender-dynamic` on every panel route.** `instant = false` on
  `app/admin/layout.tsx` does not relax validation for the page segments below it —
  Cache Components validates each page on its own — so every `app/admin/*/page.tsx`
  now declares it, with a one-line reason. On `/admin/login` the session check moved
  inside the existing `<Suspense>` boundary instead, so the sign-in card, logo and
  heading prerender; the route went from dynamic (ƒ) to partially prerendered (◐).

### Added

- **`scripts/hydration-check.mjs`** — loads routes at 390 and 1440 px with a fresh
  profile (no stored consent, so the banner is in its "must appear" state) and exits
  non-zero on any console error, page error or hydration warning. `AS_USER=u-desk`
  signs the panel session cookie locally instead of posting the login form, so
  checking every screen does not eat into the sign-in rate limit.
- A Next-App-Router note in `~/.claude/skills/admin-panel-design/SKILL.md`: panel
  pages need `instant = false` per page segment, and a session read outside
  `<Suspense>` blocks the whole route.

### Verified

| Check | Command | Result |
|---|---|---|
| Types | `npx tsc --noEmit` | clean |
| Lint | `npx eslint .` | 0 errors, 0 warnings |
| Tests | `npx vitest run` | 67 passed (5 files) |
| Build | `npx next build` | 323 static pages; `/admin/*` dynamic, `/admin/login` now ◐ |
| Reader hydration | `ROUTES=/,/tag/mausam,/search,/desh/…-1001,/rashifal,/photos node scripts/hydration-check.mjs` | 12 loads, 0 px overflow, **no console or hydration errors** (banner present on all 6 routes) |
| Panel hydration | same script with `AS_USER=u-admin` / `u-bureau` / `u-stringer` over all 9 panel routes | 0 px overflow, **no console or hydration errors** |

Not covered: the check runs against `next dev`, where these insights surface. It is
run by hand — wiring it into CI is still gap G13.

---

## 2026-11-21 — Newsroom admin panel (`/admin`) + global admin-panel design standard

**Scope:** the panel shell, RBAC, sign-in and the phase-1 dashboards from
`docs/ROLES_AND_DASHBOARDS.md`, built to the AstroGaon `weblaravel` admin design.
Also extracted that design into a reusable global skill + rule so every future
panel starts the same way.

### Threat model (built with the change)

| Asset | Actor | Entry point | Abuse case | Defence (layer) |
|---|---|---|---|---|
| Newsroom accounts | Credential stuffer | `POST /admin/login` | Guessing passwords, enumerating accounts | 10 attempts / 10 min per IP · one generic error · constant-time compare against a same-length hash whether or not the account exists · *prevent* |
| Session | Attacker with a cookie jar | Any `/admin` route | Forged or extended session | HMAC-signed `userId.expiry.sig`, httpOnly, sameSite=lax, 12h; role is re-read per request so a demotion applies immediately · *prevent* |
| Other desks' stories | Curious staff | `/admin/stories`, `/admin/earnings` | Reading or editing out-of-scope records | Scope is applied **in the query** (`state`/`district`/`own`), plus `allow(user, permission, record)`; 19 tests in `tests/admin-rbac.test.ts` · *prevent + enforce* |
| Editorial integrity | Ad sales | Panel UI | Editing or re-labelling a story | `ad_sales` holds no `story.*` permission at all; asserted by test · *prevent* |
| Reader personal data | Any staff | Panel UI | Browsing subscriber data | `reader.pii.view` granted only to grievance + admin; test asserts the whole role list · *prevent* |
| Deployment | Operator mistake | Env | Demo accounts shipped to production | No default password; production additionally requires `ADMIN_ALLOW_DEV_USERS=true`; missing secret disables sign-in · *prevent* |
| Search engines | Crawler | `/admin/*` | Indexing the panel | `robots: noindex, nofollow, nocache` on the segment; `/admin` already disallowed in robots.txt · *prevent* |
| Session end | Another site | `/api/admin/logout` | Forced logout via `<img>` | POST only; GET returns 405 · *prevent* |

### Added — global (outside this repo)

- **`~/.claude/skills/admin-panel-design/SKILL.md`** — the reusable template extracted
  from `astrogaon/apps/weblaravel`: tokens (including the always-dark sidebar), the
  layout shell with exact class lists, the `NAV_CONFIG` data model, page patterns
  (PageHeader, KPI card, filter bar, data table, empty state, forms, charts), the
  mobile bottom-tab pattern, a behaviour checklist and per-stack notes.
- **`~/.claude/CLAUDE.md`** — new "Global Rule — Admin Panels: one design, every
  project" pointing at the skill.

### Added — this repo

- **Shell** (`components/admin/admin-shell.tsx`): dark sidebar with collapsible groups,
  section dividers, badges and tooltips; sticky topbar with date, theme switch,
  notification bell and user dropdown; mobile top bar + bottom tab bar derived from the
  same nav config; footer with version.
- **Tokens** (`app/globals.css`): shadcn/slate admin palette with `@custom-variant dark`
  and an `@theme inline` mapping, scoped so the reader-site palette is unaffected.
- **UI kit** (`components/admin/ui/*`): dropdown-menu, tooltip, button/input/select/
  status-badge/card primitives, `PageHeader`, `KpiCard`, `EmptyState`, `Panel`, a typed
  dependency-free `DataTable` with the reference's exact classes, and `TablePagination`.
- **RBAC** (`lib/admin/rbac.ts`): 14 roles, 32 permissions, five scope kinds, the
  sensitive-permission list, and `can` / `inScope` / `allow`.
- **Auth** (`lib/admin/session.ts`, `lib/admin/users.ts`, `app/admin/login`,
  `app/api/admin/logout`): signed-cookie sessions, scrypt password verification, demo
  newsroom accounts that only exist when the environment opts in.
- **Navigation** (`lib/admin/nav.ts`): a menu per role, two levels deep, with
  `IMPLEMENTED_ROUTES` so unbuilt screens show without linking.
- **Dashboards** (`components/admin/dashboards.tsx`): desk editor, editor-in-chief,
  reporter, stringer, bureau chief, grievance/DPO, system admin, plus an honest
  "planned" view for the roles whose dashboard is phase 2/3.
- **Pages**: `/admin` (role-dispatched), `/admin/stories` (filterable queue with the
  SLA timer), `/admin/coverage` (silent-district list), `/admin/earnings` (stringer
  money / payout recommendation), `/admin/grievances` (SLA queue), `/admin/users`,
  `/admin/audit`, `/admin/profile`.
- **Newsroom data** (`lib/admin/newsroom.ts`): the extended workflow states, review
  queue with waiting times, assignments, stringer filings and payouts, coverage gaps,
  grievances, audit log and the publish trend.
- **Tests** (`tests/admin-rbac.test.ts`): 19 new tests covering the permission matrix,
  scope boundaries, the nav invariants and the session/credential failure modes.

### Changed

- The reader site's `muted` colour token was renamed to `meta` (46 usages) so the admin
  could take the standard shadcn `muted` / `muted-foreground` pair. `meta` is also the
  better name — DESIGN.md §2.1 defines it as "time, bylines, captions".
- `CookieBanner` now stays out of `/admin` (a staff tool behind a login that loads no
  third-party scripts) and is wrapped in `<Suspense>` in the root layout, since reading
  the pathname is request-time data on open-ended routes.
- `docs/project-rules.md` gained an admin-panel section pointing at the global skill.

### Verified

| Check | Command | Result |
|---|---|---|
| Types | `pnpm typecheck` | clean |
| Lint | `pnpm lint` | 0 errors, 0 warnings |
| Tests | `pnpm test` | 67 passed (48 + 19 new) |
| Build | `next build` | 323 static reader pages; `/admin/*` correctly dynamic |
| Panel | `scripts/admin-screens.mjs` — signed in as five roles | desk, editor, stringer, bureau, grievance dashboards plus stories/coverage/earnings render at 1440 and 390 px with **0 px overflow** and no console errors |
| Fail-closed | removed `ADMIN_DEV_PASSWORD` | login page refuses to render a form and explains what to set |

### Notes

- MFA is specified for privileged roles but **not implemented** — 🔴 in
  `docs/known-gaps.md`. The panel shows each account's MFA status as "बंद" rather than
  implying otherwise.
- Editing/publishing from the panel is intentionally not wired: the stories screen is
  read-and-triage until the CMS supplies the write path (PRD M7).

---

## 2026-11-21 — Roles, users and dashboard analysis for the newsroom panels

**Scope:** planning only, no code. Preparation for PRD M7 (CMS).

### Added

- `docs/ROLES_AND_DASHBOARDS.md` — operational analysis written from the owner's seat:
  the full user universe (10 external types, 17 internal roles), a permission model of
  **permission + scope + ownership** (global / desk / state / district / own) with an
  abridged permission matrix, a separate personal-data access matrix for DPDP least
  privilege, the extended editorial workflow (adds Assigned, Filed, Needs-rewrite, Spiked,
  Legal hold), specifications for 18 dashboards, the data-model additions they imply,
  a 4-phase build order, what we deliberately will **not** build, risks, and the
  decisions only the owner can make.

### Key positions taken (open to challenge)

- Build **7 dashboards** in v1, not 17 — a dashboard nobody opens rots and then no number
  on any panel is trusted.
- The **stringer filing + payment module is a P1 feature**. Acceptance rate and payment
  date decide whether district correspondents keep filing for us; it is not a phase-3 nicety.
- **One admin app, three spaces** (`/desk`, `/business`, `/admin`) with Payload kept as the
  content model, API and media library underneath. A generic CRUD admin cannot deliver
  60-second breaking publishing or the home curation board.
- Three boundaries enforced in code, not policy: ad sales can never edit a story; the
  consent ledger and audit log are append-only for everyone including Admin; no shared
  logins (the Editor is named on the masthead under the IT Rules 2021).
- The **Grievance / DPO panel ships in v1** — its absence is non-compliance, not a gap.

### Updated

- `docs/owner-todo.md` — new dated section with the eight decisions the report needs.

### Verified

Documentation change only: no code touched, so no build or test run was required.
`docs/known-gaps.md` unchanged — the panels are future work (gap G7, "No CMS"), now with
a concrete scope behind it.

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
