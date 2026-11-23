# PRD — Daydreams News: Hindi News Portal

| | |
|---|---|
| **Document** | Product Requirements Document v1.0 |
| **Date** | 20 Nov 2026 |
| **Companion docs** | `DESIGN.md` (UI spec — how it looks), `GRAPHICS_PROMPTS.md` (visual assets), `reference/` (screens) |
| **Status** | Draft for build |
| **Owner** | _[Your name]_ |

> **For Claude Code:** this PRD says **what** to build and **in what order**; `DESIGN.md` says **how it must look**. When they conflict on visuals, DESIGN.md wins; on behaviour or scope, this PRD wins. Build phase by phase (§12). Do not build Phase 2/3 items until Phase 1 acceptance criteria pass.

---

## 1. Summary

Daydreams News is a fast, mobile-first Hindi news website with its own newsroom CMS. Readers get national, state/city, sports, business, entertainment and utility news (jobs, education, weather, rashifal), plus live blogs, videos, web stories and photo galleries. Editors publish, update and promote stories in minutes. Revenue comes from display ads, with subscriptions and the e-paper later.

## 2. Problem & opportunity

- Hindi readers are mostly on mobile, often on mid-range phones and patchy 4G. Many existing portals are slow and ad-heavy, and their layout jumps around while ads load.
- Readers want their **own state and city** news first, along with quick utility info (weather, AQI, markets, scores, results).
- A small newsroom needs a simple CMS: write, add a photo, publish, push breaking news. No developer should be needed per story.

## 3. Goals & success metrics

| Goal | Metric | Target (6 months after launch) |
|---|---|---|
| Fast experience | Core Web Vitals (mobile, p75) | LCP < 2.5s, CLS < 0.1, INP < 200ms |
| Reach | Monthly unique visitors | _[set target]_ |
| Engagement | Pages per session / avg. engaged time | ≥ 2.5 / ≥ 90s |
| Loyalty | Returning visitors (7-day) | ≥ 30% |
| Search & Discover | Share of traffic from Google Search + Discover + News | ≥ 50% |
| Newsroom speed | Time from draft to published (breaking) | < 3 minutes |
| Revenue | Ad viewability / fill rate | ≥ 60% / ≥ 85% |
| Quality | Corrections published within | 24h of report |

**Non-goals for v1:** paywall, user comments, native mobile apps, English edition, video hosting infrastructure (we embed YouTube), print e-paper production.

## 4. Users & personas

| Persona | Needs |
|---|---|
| **Ramesh, 42, Lucknow** (Android, Hindi only) | UP and Lucknow news first, big readable text, WhatsApp sharing, works on slow data |
| **Priya, 22, Patna, job aspirant** | Sarkari naukri, exam dates, results, quick updates |
| **Amit, 30, Delhi, office worker** | Morning headlines in 2 minutes, markets, cricket score, live blogs during big events |
| **Editor / Desk** | Publish and update fast, mark breaking, schedule, reorder the home page |
| **Reporter** | Write from a phone, upload photos, submit for review |
| **Admin / Owner** | Manage users, ads, SEO settings, see analytics |

## 5. Scope by phase

| Area | Phase 1 — MVP (launch) | Phase 2 | Phase 3 |
|---|---|---|---|
| Reader website | Home, category, state/city, article, search, author, static pages, 404 | Live blogs, web stories, photo galleries, video pages, rashifal | E-paper viewer, English edition, dark mode |
| Personalisation | Choose state (saved), font size | Bookmarks, followed topics (login) | Personalised home feed |
| Engagement | Share (WhatsApp first), newsletter signup | Web push for breaking news, PWA offline | Comments (moderated), polls/quizzes |
| Widgets | Weather + AQI (city), market snapshot (mock → API) | Live cricket scorecard, exam results widget | Election results module |
| CMS | Stories, categories, tags, authors, media library, home page curation, breaking ticker, roles & workflow, scheduling | Live blog editor, web story builder, gallery builder, push composer | Analytics dashboard in CMS, A/B headlines |
| Monetisation | Ad slots (Google Ad Manager/AdSense) with house-ad fallback | Sponsored content label & tracking | Subscriptions, ad-free plan, e-paper paywall |
| SEO & distribution | Sitemaps, Google News sitemap, NewsArticle schema, RSS, OG images | AMP web stories, LiveBlogPosting schema | Google News Showcase readiness |
| Accounts | — (anonymous) | Login with phone OTP / Google | Profile, preferences sync |

---

## 6. Functional requirements: reader website

Priority: **P0** = must have for launch, **P1** = Phase 2, **P2** = Phase 3.

### 6.1 Global (P0)
- **FR-G1** Header, nav, breaking ticker, trending tags, footer and mobile bottom tab bar, exactly as specified in `DESIGN.md` §4.
- **FR-G2** The breaking ticker shows up to 6 active "breaking" items from the CMS, newest first. Items auto-expire after a CMS-set time (default 6h). It is hidden when empty.
- **FR-G3** Trending tags are managed in the CMS (ordered list, up to 10).
- **FR-G4** The utility bar shows the Hindi date, weather and AQI for the reader's city. Default city: New Delhi. The reader can change the city, and the choice is saved in a cookie.
- **FR-G5** Language switch link (points to English edition URL; hidden until it exists).
- **FR-G6** All pages are server-rendered with ISR (home/category: revalidate ≤ 60s; articles: on-demand revalidate on publish/update).

### 6.2 Homepage (P0)
- **FR-H1** Sections and order as in `DESIGN.md` §5. Every section is driven by the CMS (**Home Curation**, §7.4): editors pin stories into slots. Unpinned slots auto-fill with the latest stories of that section.
- **FR-H2** **Lead block:** 1 hero, 2 secondary, 5 "Top News", plus a live-updates box. The box shows the latest 4 updates of the featured live blog (P1). In P0 it shows the latest 4 breaking items.
- **FR-H3** **State strip:** shows the reader's saved state first. Selecting a state loads that state's latest 6 stories without a full page reload and saves the choice (cookie, 1 year).
- **FR-H4** **Most read:** top 6 stories by page views in the last 24h (from analytics), refreshed every 15 min. Fallback: editor-picked list.
- **FR-H5** **Category blocks** (देश, दुनिया, खेल, मनोरंजन, बिज़नेस·टेक·ऑटो·नौकरी): latest stories by category. Sub-category tabs filter on the client.
- **FR-H6** Web stories row (P1), video section (P0: YouTube-embedded videos), photo gallery (P1), rashifal (P1).
- **FR-H7** Market widget and cricket scorecard read from service adapters. Until real APIs are connected they show mock data with a visible "डेमो" label. They must never show stale data without an "अपडेटेड <time>" stamp.

### 6.3 Category / state / city pages (P0)
- **FR-C1** URL patterns: `/desh`, `/duniya`, `/state/uttar-pradesh`, `/state/uttar-pradesh/lucknow`, `/cricket`, etc. Slugs are Latin transliterations.
- **FR-C2** The lead block shows 1 big + 4 stories. After that comes a paginated list of 20 stories per page with "और ख़बरें लोड करें" (load more) on mobile and numbered pagination on desktop (SEO-friendly `?page=2`).
- **FR-C3** Sub-category tabs, the city selector on state pages, and a right rail (most read in category + ads).
- **FR-C4** Empty category: friendly empty state plus latest stories.

### 6.4 Article page (P0)
- **FR-A1** Layout per `DESIGN.md` §6: category label, H1, deck, highlights (मुख्य बातें, 0–5 bullets), byline (author link, dateline city, published and updated time in IST, read time), featured image with caption and credit, rich body, tags, follow box, related stories, right rail.
- **FR-A2** The body supports: paragraphs, H2/H3, bold/italic/links, bullet and number lists, images with caption and credit, image galleries, YouTube/X/Instagram/Facebook embeds (lazy, click-to-load facade), tables, pull quotes, "यह भी पढ़ें" story links, and info boxes.
- **FR-A3** Auto-insert "यह भी पढ़ें" after paragraph 2 when the editor hasn't added one (related story from the same category or tag). Insert an in-article ad after paragraph 4, then every 6 paragraphs, max 3.
- **FR-A4** "Updated" stories show "अपडेटेड: <time>". Corrections show a correction note at the bottom with its date.
- **FR-A5** Font size control (A-/A+, 3 steps), saved in localStorage.
- **FR-A6** Share: native Web Share on mobile; WhatsApp, Facebook, X, LinkedIn, Copy link on desktop. Shared URLs include UTM `utm_source=<network>&utm_medium=social`.
- **FR-A7** Reading progress bar. A sticky 300×600 ad in the rail on desktop.
- **FR-A8** Related stories: 3, chosen by shared tags, then category, then recency. The current story is excluded.
- **FR-A9** Sponsored/partner content shows a clear "प्रायोजित" (sponsored) label above the headline and has `rel="sponsored"` on outbound links.
- **FR-A10** (P1) "Next story" infinite scroll on mobile, behind a feature flag.

### 6.5 Live blog (P1)
- **FR-L1** Live page with a key-events summary, a reverse-chronological timeline of updates (time, title, rich body), a pinned update and LIVE status. An "Ended" state turns the badge into "समाप्त".
- **FR-L2** New updates appear within 30s (polling or SSE). A "नए अपडेट (n)" pill shows when the reader has scrolled down. Clicking it scrolls to the top.
- **FR-L3** `LiveBlogPosting` JSON-LD.

### 6.6 Web stories (P1)
- **FR-W1** Full-screen player (`DESIGN.md` §7): 4–15 slides, tap left/right, hold to pause, auto-advance 6s, swipe down to close, progress bars, last slide with CTA link to the full article.
- **FR-W2** Also served as AMP Web Stories at `/web-stories/<slug>/amp` for Google Discover.
- **FR-W3** Web stories listing page and the homepage row.

### 6.7 Video (P0 basic, P1 full)
- **FR-V1** (P0) Video stories embed YouTube via a lightweight facade (thumbnail + play button, the iframe loads on click). They show the title, description and duration.
- **FR-V2** (P1) Videos listing with tabs (न्यूज़, शॉर्ट्s, इंटरव्यू), a video page with an up-next list, and `VideoObject` schema.

### 6.8 Photo galleries (P1)
- **FR-P1** Gallery page with one image at a time, caption and credit, counter "3/12", thumbnail strip, and keyboard/swipe navigation. An ad after every 4 images. Each image view updates the URL hash (for analytics).

### 6.9 Search (P0)
- **FR-S1** Search across headlines, deck, tags and body. Typo-tolerant, and Hindi plus transliterated queries work (e.g. "mausam" finds "मौसम"). Recommended: Meilisearch or Typesense, or Postgres full-text search to start.
- **FR-S2** Filters: category, date range (24h, 7 days, 30 days, any). Sort by relevance or latest.
- **FR-S3** Suggestions (top 5) as the reader types, after 2 characters.

### 6.10 Utility modules
- **FR-U1** (P0) Weather and AQI for the selected city, from a weather API, cached 30 min.
- **FR-U2** (P1) Rashifal: 12 signs, daily/weekly/monthly text from the CMS, `/rashifal/<sign>`.
- **FR-U3** (P1) Cricket live scorecard from a sports-data API, polled every 30s during matches.
- **FR-U4** (P0 mock, P1 live) Market snapshot (Sensex, Nifty, gold, silver) from a market-data API, with delay disclosure.
- **FR-U5** (P2) Exam results and election results modules.

### 6.11 Engagement
- **FR-E1** (P0) Newsletter signup ("सुबह की 10 बड़ी ख़बरें"): email plus double opt-in and consent text. Stored in our DB or the email provider's list. Daily digest auto-generated at 7:00 IST from the top 10 stories (editor can edit before send) (P1 for automated send).
- **FR-E2** (P1) Web push for breaking news: opt-in prompt only after the 2nd visit or 3rd article; topic choice (breaking, my state, cricket). Sent from the CMS.
- **FR-E3** (P1) PWA: installable, offline page, cached last 20 viewed articles.
- **FR-E4** (P1) Bookmarks: with no login, saved in localStorage; with login, synced.
- **FR-E5** (P1) Login: phone OTP and Google sign-in. Profile shows saved state, city, topics, bookmarks and notification settings.

### 6.12 Static & legal pages (P0)
About, Contact, Advertise, Privacy Policy, Terms, Cookie Policy, Corrections & Ethics Policy, Grievance Redressal (grievance officer name and contact), Sitemap (HTML). These are edited in the CMS as pages.

---

## 7. Functional requirements: Newsroom CMS (admin)

**Recommendation:** Payload CMS (runs inside the Next.js app, TypeScript, Postgres). Alternatives: Strapi, Sanity, headless WordPress. The reader site reads through a `lib/cms` data-access layer, so the CMS can be swapped.

### 7.1 Roles & permissions (P0)
| Role | Can |
|---|---|
| **Reporter** | Create and edit own drafts, upload media, submit for review |
| **Sub-editor / Desk** | Edit any draft, publish, update published stories, mark breaking, add to ticker, manage tags |
| **Editor** | Everything Desk can, plus home page curation, delete/unpublish, live blogs, push notifications, corrections |
| **Admin** | Users and roles, categories, site settings, ads config, SEO settings, integrations |

Every action is written to an **audit log** (who, what, when, before/after).

### 7.2 Story editor (P0)
- Fields: headline (max 120 chars, live counter), SEO title (≤ 65), deck/summary (≤ 200), highlights (0–5), body (block editor with the elements from FR-A2), category (required) and sub-category, state/city, tags (autocomplete, create new), author(s), dateline city, featured image (required for publishing; system fallback by category per GRAPHICS_PROMPTS §2, marked "प्रतीकात्मक चित्र"), image caption and credit, story type (article / video / gallery / live / web story / sponsored), slug (auto-transliterated, editable before first publish, locked after), canonical URL override, noindex toggle, scheduled publish time.
- Statuses: Draft → In review → Published → Updated, plus Unpublished and Scheduled.
- Autosave every 10s, revision history with diff and restore, and a lock warning when 2 people edit the same story.
- Preview: mobile and desktop preview before publishing, plus a shareable preview link that expires in 24h.
- Checks before publish: required fields; image alt text present; headline not duplicate (warn); body length ≥ 80 words (warn, can override for breaking).
- **Breaking mode:** a quick form with headline, one paragraph, category and image (optional, fallback allowed) that publishes in under 1 minute. The story is marked breaking and pushed to the ticker.

### 7.3 Media library (P0)
Upload (drag and drop, from phone camera), auto-resize to WebP/AVIF in several widths, focal point picker, required alt text (Hindi), caption, credit, source/licence field, a "AI-generated illustration" flag (forces the caption suffix "(AI से बनाई गई प्रतीकात्मक तस्वीर)"), search by caption and tags, and a duplicate warning.

### 7.4 Home page curation (P0)
- A visual board mirroring the homepage slots (hero, 2 secondary, top news 1–5, each category block's lead).
- Drag a story into a slot and set a pin duration. Pinned slots show an expiry timer. Empty slots auto-fill (FR-H1).
- Ticker manager (add/remove/reorder, expiry), trending tags manager, and featured live blog selector.
- Changes go live within 60s (on-demand revalidation).

### 7.5 Taxonomy (P0)
Categories (2 levels, ordered, with nav visibility), states and cities (pre-seeded list of Indian states and UTs with major cities), tags (merge and rename), authors (bio, photo, social, role).

### 7.6 Live blog editor (P1)
Create a live blog (title, summary, key events). Post updates in a quick composer (time auto, title, body, media). Pin, edit and delete updates. Set status to live or ended. Updates appear on the site within 30s.

### 7.7 Web story & gallery builders (P1)
Web story builder: add slides (image, title ≤ 70 chars, text ≤ 150 chars), reorder, add a CTA link, live 9:16 preview. Gallery builder: multi-upload, reorder, captions.

### 7.8 Push & newsletter (P1)
Push composer: title, body, link, image, audience (all / state / topic), schedule, and a send preview. Max 1 push per 30 min (an editor can override for breaking). Shows delivery and click stats.
Newsletter: daily digest editor, send log.

### 7.9 Corrections (P0)
"Add correction" on a published story: text + date, shown at the end of the article and added to the corrections log page.

### 7.10 Settings (P0)
Site name, logo, colours (read by `lib/site.ts`), social links, ad slot IDs per placement, analytics IDs, API keys for widgets (stored server-side), default city, robots and noindex controls, redirects manager (old URL → new URL, 301).

---

## 8. Ads (P0)

- **AD-1** Ad placements as in `DESIGN.md` §5 and §6: header 728×90 / mobile 320×50, home in-feed 300×250 every ~6 stories, between-section 970×250 / 320×100, rail 300×250 and sticky 300×600, in-article (max 3).
- **AD-2** Every slot reserves its size before the ad loads (no layout shift). Slots below the fold are lazy-loaded.
- **AD-3** Google Ad Manager / AdSense via a single `AdSlot` component. Placement-to-unit mapping lives in CMS settings. `ads.txt` is served from the CMS setting.
- **AD-4** If no ad fills, show a house ad (newsletter, app, WhatsApp channel, advertise with us).
- **AD-5** Rules: no ad above the article H1; ads cover at most ~30% of the mobile viewport; no pop-ups or interstitials on first page view; every slot is labelled "विज्ञापन".
- **AD-6** Consent: personalised ads load only after the reader consents through the cookie banner (§10.4).

---

## 9. SEO & distribution (P0 unless noted)

- **SEO-1** Clean, stable URLs: `/<category>/<slug>-<id>`. Changing a slug after publishing creates an automatic 301 redirect.
- **SEO-2** Metadata on every page: title, description, canonical, Open Graph and Twitter card (image 1200×630; default OG image if none).
- **SEO-3** Structured data: `NewsArticle` (headline, image ≥ 1200px, datePublished, dateModified, author with URL, publisher with logo), `BreadcrumbList`, `Organization`, `WebSite` with SearchAction. `LiveBlogPosting` and `VideoObject` in P1.
- **SEO-4** Sitemaps: `/sitemap.xml` (index), per-month article sitemaps, `/news-sitemap.xml` (last 48h, Google News format), plus category, author and video sitemaps.
- **SEO-5** RSS: `/rss` overall and `/rss/<category>`.
- **SEO-6** `robots.txt`, `noindex` for search results, tag pages with fewer than 3 stories, and previews.
- **SEO-7** (P1) AMP Web Stories; Google Discover readiness (large images, `max-image-preview:large`).
- **SEO-8** Author pages with bio, the "about us" page, and ethics/corrections pages (E-E-A-T signals).

---

## 10. Non-functional requirements

### 10.1 Performance
- Core Web Vitals targets from §3, measured with real-user monitoring (web-vitals) and Lighthouse CI on each deploy (mobile score ≥ 90).
- JS budget for an article page: ≤ 120 KB gzipped (excluding ads). Hero image ≤ 120 KB.
- Fonts: Mukta via `next/font`, Devanagari and Latin subsets only, `display: swap`.
- CDN caching for HTML (ISR) and media. Uncached TTFB < 600ms in India (use a Mumbai region).

### 10.2 Scale & availability
- Handle traffic spikes of 20× normal during breaking news without errors: static/ISR pages from the CDN, an API rate limit, and a queue for push notifications.
- Availability 99.9% monthly. Daily DB backups kept for 30 days, with point-in-time recovery.
- Publishing must keep working even when the analytics or widget APIs are down (graceful degradation).

### 10.3 Security
- CMS behind authentication with 2FA for Editor and Admin. Session timeout 12h. Brute-force protection.
- Role-based access checks on the server for every CMS action.
- Sanitise all rich-text and embed HTML (allow-listed embeds only). Content Security Policy (CSP) headers.
- Secrets in environment variables, never sent to the client. Dependency audit in CI.
- OWASP top-10 basics: CSRF protection, rate limits on public forms (newsletter, search, OTP).

### 10.4 Privacy & compliance (India)
- Cookie and consent banner (Hindi and English) with Accept / Reject / Manage. Non-essential cookies and personalised ads wait for consent.
- Personal data (emails, phone numbers, push tokens) is collected only with clear consent and purpose, and can be deleted on request. Design for India's Digital Personal Data Protection Act, 2023.
- Publish a grievance redressal mechanism and an ethics policy for digital news publishers as required under India's IT Rules, 2021.
- Copyright: every image has a credit and licence field. Agency content follows agency terms.
- *Have a lawyer confirm the exact obligations before launch. This PRD is not legal advice.*

### 10.5 Accessibility & language
- WCAG 2.1 AA, `lang="hi"`, Hindi alt text, visible focus, captions on videos where available, ticker pausable.
- All UI strings in Hindi, from a single `messages/hi.json` (prepared for an `en.json` edition later). Dates and times in IST with Hindi month names. Numbers use the Indian format (1,25,000) in Hindi contexts.

### 10.6 Analytics
- GA4 (or Plausible/Umami for privacy) plus server-side page-view counts for "Most read".
- Events: article_view (category, author, type), scroll_75, share (network), newsletter_signup, push_optin, state_change, search, video_play, web_story_complete, ad_viewable (from GAM).
- A simple editorial dashboard (P2): top stories now, traffic sources, and real-time readers.

### 10.7 Browser & device support
Chrome/Android 10+, Safari iOS 15+, Samsung Internet, desktop Chrome, Edge, Firefox and Safari (latest 2 versions). Test devices: a ~₹10k Android phone on throttled 4G, iPhone, a 1366px laptop and a 1920px monitor.

---

## 11. Technical architecture

```
Next.js (App Router, TS, RSC)  ──  Tailwind + shadcn/ui (DESIGN.md tokens)
   ├─ Reader site (ISR, edge cache)          ├─ /admin  → Payload CMS (same repo)
   ├─ API routes: search, state feed,        │      └─ Postgres (Neon/Supabase/RDS)
   │   live updates (SSE/poll), newsletter,  ├─ Media → S3-compatible storage + image CDN
   │   push subscribe, revalidate webhook    ├─ Search → Meilisearch/Typesense (or Postgres FTS)
   ├─ lib/cms   (data access, swappable)     ├─ Push → Web Push (VAPID) / OneSignal / FCM
   ├─ lib/services/* weather, aqi, market,   ├─ Email → Resend / SES / Mailchimp
   │   cricket (adapters + mock)             ├─ Ads → Google Ad Manager
   └─ messages/hi.json                       └─ Hosting → Vercel (Mumbai) or AWS/Cloudflare
```

**Core content model:** Story, Category, Tag, Author, Media, State, City, LiveBlog/LiveUpdate, WebStory/Slide, Gallery, Page, HomeSlot, TickerItem, TrendingTag, Correction, Subscriber, PushSubscription, Redirect, SiteSettings, AuditLog. Field definitions follow `DESIGN.md` §9 and §7.2 of this document.

**Key public API routes**
| Route | Purpose |
|---|---|
| `GET /api/state-feed?state=up` | 6 latest stories for the state strip |
| `GET /api/live/:id/updates?since=ts` | Live blog updates (or SSE `/api/live/:id/stream`) |
| `GET /api/search?q=&cat=&range=&page=` | Search |
| `GET /api/widgets/weather?city=` · `/aqi` · `/market` · `/cricket` | Cached widget data |
| `POST /api/newsletter` | Signup (double opt-in) |
| `POST /api/push/subscribe` | Save push subscription with topics |
| `POST /api/revalidate` (secret) | Called by the CMS on publish/update |

---

## 12. Delivery plan (milestones for Claude Code)

| # | Milestone | Includes | Done when |
|---|---|---|---|
| M0 | Setup | Repo, Next.js + TS + Tailwind + shadcn, tokens & fonts (DESIGN §2), lint/format, CI with Lighthouse, `lib/site.ts`, `messages/hi.json` | App runs; `/dev/components` page renders |
| M1 | Design system | All primitives & StoryCard variants, AdSlot, Ticker, SectionHeader, Logo (DESIGN §3) | Visual match with reference crops |
| M2 | Layout shell | Utility bar, masthead, nav + mega menu, mobile header, menu sheet, tab bar, footer | Responsive at 360–1920 |
| M3 | Mock data layer | Typed mock data (≥ 80 stories across categories/states), `lib/cms` interface | Pages read only via `lib/cms` |
| M4 | Homepage | All Phase 1 sections + state strip + widgets (mock) | Matches `reference/01` desktop + mobile 01 |
| M5 | Article | Full article template, embeds, read-also, ads, share, font size, schema | Matches `reference/02` + mobile 02 |
| M6 | Category / state / city / author / search / static / 404 | FR-C, FR-S, §6.12 | Acceptance tests pass |
| M7 | CMS | Payload: collections, roles, workflow, media, home curation, ticker, corrections, settings, revalidation | Editor can publish a story that appears on home in < 60s |
| M8 | SEO & ads | Sitemaps, news sitemap, RSS, OG, JSON-LD, redirects, GAM integration, consent banner | Rich Results test passes; CLS < 0.1 with ads |
| M9 | Hardening & launch | Performance pass, security headers, backups, analytics events, legal pages, load test | §13 launch checklist complete |
| M10 | Phase 2 | Live blog, web stories (+AMP), galleries, video pages, rashifal, push, PWA, login & bookmarks, cricket API | Per FR-L, FR-W, FR-E acceptance |

**Prompt to start each milestone in Claude Code:**
```
Read PRD.md and DESIGN.md. Implement milestone M<n> only. List the requirement IDs (FR-…) you are covering,
build them, write tests for the acceptance criteria, run the app and compare with the reference images,
then summarise what is done and what is left. Don't start the next milestone.
```

---

## 13. Acceptance criteria (launch checklist)

**Reader**
- [ ] Home, category, state, article, search, author, static and 404 pages match DESIGN.md at 360, 768, 1024 and 1440px.
- [ ] A story published in the CMS appears on its article URL immediately and on the homepage/category within 60s.
- [ ] A breaking item appears in the ticker within 60s and expires on time.
- [ ] State selection persists across visits and changes the state block.
- [ ] Article shows highlights, byline, updated time, captions/credits, read-also, related, share. WhatsApp share opens with the URL and UTM.
- [ ] Search finds "मौसम" when the query is "mausam".
- [ ] No horizontal scroll at 360px. Lighthouse mobile ≥ 90 performance, ≥ 95 accessibility, 100 SEO on home and article.
- [ ] CLS < 0.1 with ads enabled. No ad above the article H1.

**CMS**
- [ ] Reporter cannot publish; Desk can; Editor can curate home and send corrections; Admin manages users. Server-side checks are verified by tests.
- [ ] Autosave, revisions and restore work. Two editors see a lock warning.
- [ ] Publishing without a featured image uses the category fallback with the "प्रतीकात्मक चित्र" caption.
- [ ] The AI-illustration flag adds the AI caption automatically.
- [ ] Slug change after publishing creates a 301 redirect.
- [ ] Audit log records publish, unpublish, delete and role changes.

**SEO / compliance**
- [ ] `news-sitemap.xml` lists only the last 48h of stories. `NewsArticle` JSON-LD validates.
- [ ] Consent banner blocks personalised ads until accepted. Privacy, terms, grievance and ethics pages are live.
- [ ] `ads.txt`, `robots.txt` and RSS are reachable.

---

## 14. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Traffic spike on big news crashes the site | ISR + CDN, no per-request DB reads on hot pages, load test at 20× |
| Ads slow the site and shift the layout | Reserved slots, lazy loading, ad script after consent and idle, CWV monitoring per deploy |
| Wrong or unverified news published fast | Review workflow for reporters, corrections feature, breaking mode only for Desk and above, audit log |
| Misleading AI images | Fallbacks only; AI flag forces the caption; ethics policy (GRAPHICS_PROMPTS §0) |
| Third-party data APIs fail | Adapters with cache and timeout; widgets hide gracefully, with an "अपडेटेड" stamp |
| Hindi rendering issues (matras clipped) | Mukta with tested line-heights; visual tests on Android Chrome |
| Legal non-compliance | Legal review of IT Rules and DPDP obligations before launch |

## 15. Open questions

1. ~~Final brand name and logo?~~ **Answered 23 Nov 2026: Daydreams News**, with the
   owner's logo generated into `public/brand/` (`docs/brand/BRAND.md`). The **domain**
   is still open — it is read from `NEXT_PUBLIC_SITE_URL`.
2. Which states and cities get dedicated desks at launch?
3. Photo sources: own photographers, a news agency subscription, or both?
4. CMS choice confirmed as Payload, or an existing WordPress?
5. Ad partner: AdSense to start, or Google Ad Manager with direct deals?
6. Which providers for weather, AQI, market and cricket data (and budget)?
7. Is the English edition planned within 12 months? (Affects URL structure: `/` vs `/hi/`.)
8. Newsletter and push providers and budget?

## 16. Glossary
**ISR**: Incremental Static Regeneration (pages cached and refreshed in the background). **CWV**: Core Web Vitals. **CLS**: layout shift score. **Ticker**: scrolling breaking-news strip. **Deck**: summary under the headline. **Dateline**: city where the story was filed. **House ad**: our own promo shown when no paid ad fills. **GAM**: Google Ad Manager.
