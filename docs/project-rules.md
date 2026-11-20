# Project rules — ख़बर सेतु (Khabar Setu)

The standards this repo is built to. Read before changing anything.

Source of truth for *what* to build: `docs/PRD.md`. For *how it looks*:
`docs/DESIGN.md`. On visuals DESIGN wins; on behaviour and scope the PRD wins.

---

## 1. Workflow

- Before a task: read `changes/CHANGELOG.md` for the area, `docs/known-gaps.md`, and this file.
- Use what is already installed and follow the existing pattern. A new dependency needs a
  stated reason and the owner's OK.
- Each business rule lives in **one** place — `lib/cms` for content, `lib/services/*` for
  widget data, `lib/legal/notices.ts` for legal text. Pages never import `lib/data/*`
  directly.
- Verify before calling anything done: `pnpm check` (typecheck + lint + tests) and, for UI,
  `node scripts/screenshot.mjs` at 360 and 1440 with the result reported.
- After a task: add a `changes/CHANGELOG.md` entry (never rewrite old ones), fix or log
  gaps in `docs/known-gaps.md` with 🔴/🟠/🟡, and put owner-only steps in
  `docs/owner-todo.md` under a dated heading.
- No placeholder buttons, no mock data presented as real, no native `confirm()`/`alert()`.

## 2. Compliance first (India DPDP)

- Any change that collects new personal data, adds a tracker/SDK/processor, or adds a new
  purpose **must** update the notices, the consent purposes and the ledger in the same change.
- Optional consent is off by default and unbundled; "सभी अस्वीकार करें" carries the same
  weight as "सभी स्वीकार करें"; closing the banner means reject.
- Every consent decision writes an append-only row (purpose, status, method, source,
  notice version, IP, user-agent, timestamp). Rows are never updated or deleted.
- Withdrawal is as easy as granting: the footer "कुकी प्रेफ़रेंस" link and `/consent` are on
  every page, and turning a purpose off reloads the page so the vendor script is unloaded.
- Third-party scripts load **only** from `components/consent/consent-scripts.tsx`, and only
  when the purpose is granted and the feature flag is on.
- Legal facts (company, address, officer) come from env via `lib/site.ts` — never hard-coded.
  Draft notices stay marked as drafts until a lawyer signs off.

## 3. Security

- Threat-model each feature in two minutes and record it in the change log entry.
- Every public write endpoint is rate-limited per IP and validated against an allow-list;
  oversized bodies are rejected. Add a negative test for each abuse case.
- Never trust the client for anything that matters: the newsletter consent flag, consent
  purposes and search parameters are all re-validated on the server.
- Rich text is structured blocks, never raw HTML. The only `dangerouslySetInnerHTML` in the
  app is self-generated JSON-LD.
- Secrets never reach the client. `NEXT_PUBLIC_*` is for non-secret configuration only.
- Feature flags fail closed: a feature is on only when its flag is exactly `"true"`.

## 4. Design system

- Tokens live in `app/globals.css` (`@theme`) and `lib/site.ts`. No hard-coded hex outside
  those two files except vendor brand colours in the share bar.
- Type scale: use the `t-*` utilities. Never letter-space Devanagari; keep headline
  line-height ≥ 1.22 and body ≥ 1.75 so matras are not clipped.
- **Icons: free Hugeicons only**, imported from `components/icons.ts`. No lucide, no
  heroicons, no ad-hoc inline SVG icons. Icon-only buttons need an `aria-label`; decorative
  icons are `aria-hidden`. (DESIGN §4.5 mentions lucide — this rule overrides it.)
- Build mobile-first and check 360, 390, 768, 1024, 1280, 1440 and 1920 px. No horizontal
  page scroll at any width; tap targets ≥ 44 px; mobile body text ≥ 16 px.
- shadcn-style primitives live in `components/ui/*`, restyled to the tokens; news-specific
  components in `components/news/*`, `components/home/*`, `components/article/*`.

## 5. Performance (Core Web Vitals)

- The LCP element is server-rendered. Only the hero image gets `priority`; everything else
  is lazy.
- **Every ad slot reserves its exact height before anything loads** — this is what keeps
  CLS under 0.1. Never render an ad without a reserved box.
- Client components only where interaction demands it (ticker is CSS, nav needs the path,
  consent needs storage). Prefer Server Components.
- Data access is cached with `use cache` + an explicit `cacheLife`: `minutes` for home and
  lists (60 s revalidate, FR-G6), `days` + `cacheTag('story-<id>')` for articles.
- Anything reading `searchParams`, cookies or `usePathname()` sits inside `<Suspense>` with
  a same-height fallback, so the rest of the route still prerenders.
- Never call `Date.now()`/`new Date()`/`Math.random()` in the prerendered shell — the demo
  clock (`lib/data/clock.ts`) exists for this reason.

## 6. Accessibility & language

- `lang="hi"`, semantic landmarks, one `h1` per page, visible 2px brand focus rings.
- All strings come from `messages/hi.json`. Dates and times are IST with Hindi month names;
  numbers use Indian grouping.
- Alt text in Hindi; decorative illustrations are hidden from screen readers.
- Respect `prefers-reduced-motion`: the ticker and the web-story auto-advance both do.

## 7. Content ethics

- Demo content is clearly fake: generic headlines, no real people, no invented quotes.
- Illustrations are never passed off as photographs; file photos carry
  "(प्रतीकात्मक तस्वीर)" and AI images "(AI से बनाई गई प्रतीकात्मक तस्वीर)".
- Sponsored stories show the "प्रायोजित" label above the headline and use `rel="sponsored"`
  on outbound links.
- Corrections are published at the end of the story with their date — stories are never
  changed silently.
