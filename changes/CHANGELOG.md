# Change log — ख़बर सेतु (Khabar Setu)

Newest first. One entry per task; entries are never rewritten.

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
