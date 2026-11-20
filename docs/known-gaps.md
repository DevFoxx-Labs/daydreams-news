# Known gaps — ख़बर सेतु

Severity: 🔴 blocks launch · 🟠 fix before scale · 🟡 nice to have.
Every entry names the path, the impact and the fix.

Last updated: 20 Nov 2026 (reader site M0–M6).

---

## 🔴 Blocks launch

| # | Area | Path | Impact | Fix |
|---|---|---|---|---|
| G1 | Consent ledger storage | `lib/consent/ledger.server.ts` | Rows are appended to `.data/consent-ledger.jsonl`. A file on one instance is not durable, not backed up and not queryable — the DPDP Rules require us to *prove* consent. | Move to the `consent_records` Postgres table (same columns) in the CMS milestone; keep append-only, back up off-site. |
| G2 | Privacy-request inbox | `app/api/privacy-request/route.ts` | Requests land in `.data/privacy-requests.jsonl` with no access control, no acknowledgement email and no SLA tracking. | CMS grievance inbox with roles, auto-acknowledgement within 48 h and a resolution timer. |
| G3 | Newsletter storage | `app/api/newsletter/route.ts` | The address is validated and the consent recorded, but nothing stores the subscriber or sends the double-opt-in email. | Wire the email provider (Resend/SES) + `subscribers` table with a confirmation token. |
| G4 | Legal texts are drafts | `lib/legal/notices.ts` | Privacy, terms, cookie, ethics and grievance texts are drafted against the DPDP Act 2023 / Rules 2025 / IT Rules 2021 but have **not** been reviewed by a lawyer, and the processor list, company details and officer details are placeholders. | Owner fills the env values (see `docs/owner-todo.md`) and a lawyer reviews every notice. |
| G5 | Rate limiting is per-instance | `lib/rate-limit.ts` | In-memory buckets reset on deploy and don't apply across instances, so the limits are weaker than they look behind a load balancer. | Redis/Upstash-backed limiter before launch. |
| G6 | No CSP or security headers | `next.config.ts` | No `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` or HSTS. | Add headers (nonce-based CSP) in the hardening milestone (PRD M9). |
| G7 | No CMS | — | Everything is mock data; editors can't publish. PRD M7. | Payload CMS with the collections in PRD §7, writing through the same `lib/cms` interface. |

## 🟠 Fix before scale

| # | Area | Path | Impact | Fix |
|---|---|---|---|---|
| G8 | Per-story OG images | `app/opengraph-image.tsx`, `lib/seo/json-ld.ts` | The social card is the site-wide Latin card; `NewsArticle.image` points at it rather than at the story. `next/og` can't draw Devanagari without a TTF/OTF (only WOFF2 ships today). | Add `public/fonts/Mukta-ExtraBold.ttf`, then a per-route `opengraph-image.tsx` rendering the headline + photo. |
| G9 | Real photos | `lib/data/*`, `components/news/scene-art.tsx` | Stories use generated illustrations, not photographs; `media.url` is unused in practice. | CMS media library with `next/image` + remote patterns; `StoryImage` already prefers `media.url`. |
| G10 | Widget APIs | `lib/services/widgets.ts` | Weather, AQI, market and cricket are mock data (labelled "डेमो"). | Plug the real providers into the same adapters, keep the timeout + fallback, drop `isDemo`. |
| G11 | Most-read is static | `lib/cms/index.ts` (`getMostRead`) | Ranks by a fixed `views` field, not by real 24 h page views. | Server-side counter or analytics query, refreshed every 15 min (FR-H4). |
| G12 | Live updates poll a static source | `app/api/live/[id]/updates/route.ts` | Polling works, but the mock blog never gains updates, so the "नए अपडेट (n)" pill can't be seen in the demo. | Real live-blog collection + SSE option (FR-L2). |
| G13 | No E2E/visual regression in CI | `scripts/screenshot.mjs` | Responsive and overflow checks are run by hand. | Playwright test project + Lighthouse CI budget gate (PRD M9). |
| G14 | Sub-category tabs reload | `components/home/sections.tsx` | Home sub-category links navigate instead of filtering on the client (FR-H5 asks for client filtering). | Move to the shadcn Tabs already in `components/ui/tabs.tsx` with prefetched data. |
| G15 | Follow box hidden | `components/article/parts.tsx` | The navy "Google News / WhatsApp" box in reference 02 does not render because no channel URLs are configured — placeholder links would be worse. | Owner supplies the URLs (`docs/owner-todo.md`), box appears automatically. |
| G16 | Single sitemap file | `app/sitemap.ts` | All URLs in one file; fine now, breaks past ~10k URLs. | Split with `generateSitemaps()` per month once the archive grows. |

## 🟡 Nice to have

| # | Area | Path | Impact | Fix |
|---|---|---|---|---|
| G17 | Demo clock | `lib/data/clock.ts` | Relative times are measured against a fixed instant (20 Nov 2026, 13:10 IST). Deterministic and prerenderable, but not "live". | Real clock behind `<Suspense>` + `connection()` when the CMS lands. |
| G18 | Search engine | `lib/search/translit.ts` | Hand-rolled transliteration + one-edit fuzzy matching over an in-memory index. Good enough for 100 stories; no stemming, no ranking signals. | Meilisearch/Typesense with a Hindi analyser (FR-S1). |
| G19 | No search suggestions UI | `app/api/search/route.ts` | The endpoint supports type-ahead, but the header has no suggestion dropdown (FR-S3). | Add a combobox to the search field. |
| G20 | E-paper | `app/epaper/page.tsx` | Placeholder page explaining the feature is coming (viewer is Phase 3). | Build the viewer, or hide the nav entry until then. |
| G21 | "पॉडकास्ट" and "लॉग इन" omitted from the utility bar | `components/layout/utility-bar.tsx` | Reference 01 shows both; neither exists in Phase 1, and the project rule forbids placeholder buttons. | Add when podcasts and accounts ship (PRD Phase 2/3). |
| G22 | No AMP web stories | `app/web-stories/*` | Google Discover prefers AMP stories (FR-W2). | Add `/web-stories/<slug>/amp`. |
| G23 | Ticker marquee pauses only on hover/focus | `components/news/ticker.tsx` | There is no explicit pause button; reduced-motion users get a static scroll rail instead. | Add a visible pause toggle. |
