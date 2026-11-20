# ख़बर सेतु (Khabar Setu) — Design Recipe for a Hindi News Portal

> **For Claude Code:** This file is the single source of truth for how the Khabar Setu Hindi news website **looks**. `PRD.md` defines **what** to build, the phases and the acceptance criteria. Read both.
> Build every screen **mobile-first and fully responsive** — one codebase, one component set, no separate m-site.
> Match the references in `./reference/`:
> - `reference/01-news-homepage-desktop.png` · `reference/02-news-article-desktop.png` · `reference/03-news-mobile-screens.png`
> - `reference/prototype/*.html` (+ `base.css`, `scenes.js`) — static prototypes with exact spacing, sizes and Hindi copy. **Reference only**: rebuild as React components. `scenes.js` draws placeholder illustrations; the real site uses real photos from the CMS.
>
> The brand name "ख़बर सेतु" is a placeholder — keep it in one config file (`lib/site.ts`) so it can be renamed in one place.
> Never copy another publisher's logo, name, colours-as-brand or content. The layout follows the common pattern of large Hindi news portals; everything else is original.

---

## 0. Quick-start prompt (paste into Claude Code)

```
Read PRD.md, DESIGN.md and everything in ./reference first. Follow the milestones in PRD.md §12.
Build the Khabar Setu Hindi news portal exactly as specified:
Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui, design tokens from §2, Hindi-first (lang="hi").
Build mobile-first; every page must work at 360, 390, 768, 1024, 1280, 1440 and 1920 px.
Use shadcn/21st.dev components where they fit (sheet, tabs, carousel, dialog, accordion, input) restyled to these tokens.
Use mock data from lib/data (typed) behind a data-access layer so a CMS can be plugged in later.
Work in the order of §11. After each page, run the dev server and compare with the reference PNG at desktop and mobile widths.
```

---

## 1. Product & tone

- **What:** A Hindi news portal — national, world, state/city, entertainment, cricket/sports, business, tech, lifestyle, religion, education, jobs, auto, astrology — plus live blogs, videos, web stories, photo galleries and an e-paper.
- **Audience:** Hindi readers across North & Central India, ~80% on mobile, many on mid-range Android phones and slow networks.
- **Feel:** trustworthy, fast, dense but scannable. Classic Indian news-portal grammar: strong red brand bar, black breaking ticker, many headlines above the fold, clear section tabs.
- **Principles:**
  1. **Headline first** — headlines are the UI. Bold, large, readable Devanagari.
  2. **Scannable density** — many stories per screen, separated by thin grey rules, not heavy cards.
  3. **Red = brand + urgency** only (nav, section tabs, category labels, LIVE, CTAs). Never red body text.
  4. **Speed** — instant first paint on 4G; ads never shift the layout.
  5. **Every story has:** category label (red), headline, time-ago, image (16:9 or 4:3).

---

## 2. Design tokens

### 2.1 Colours
| Token | Hex | Use |
|---|---|---|
| `brand` | `#C8102E` | nav bar, section tabs, category labels, LIVE, primary buttons, logo |
| `brand-dark` | `#9E0B22` | active nav item, hover, quote text |
| `brand-tint` | `#FFF6F7` | highlights box, newsletter box bg (border `#F3C6CD`) |
| `ink` | `#111111` | headlines, ticker label, footer bg `#141414` |
| `ink-2` | `#333333` | body/secondary text |
| `muted` | `#6B6B6B` | time, bylines, captions |
| `line` | `#E4E4E4` | dividers, card borders |
| `soft` | `#F5F5F5` | state strip, tag chips, utility bar `#F3F3F3` |
| `gold` | `#F6B40E` | reading progress bar, highlights on dark |
| `navy` | `#0F1B33` | video section, follow box, scorecard (gradient to `#1D3461`) |
| `up` / `down` | `#0A8F3D` / `#D0021B` | market widget |
| `white` | `#FFFFFF` | page background |

Dark sections: web stories `#111`, videos `navy`, footer `#141414` (text `#BDBDBD`, headings white, rules `#2C2C2C`).

### 2.2 Typography
- **Primary font: Mukta** (Devanagari + Latin) via `next/font/google`, `subsets: ['devanagari','latin']`, weights 400, 500, 600, 700, 800. CSS var `--font-hindi`.
- **Numbers/UI Latin: Inter** (times in live blog, market numbers, scores, "Advertisement" labels). `--font-ui`.
- Devanagari needs extra line-height: headlines 1.22–1.3, body 1.75–1.85. Never letter-space Devanagari.

| Name | Mobile → Desktop | Weight | Use |
|---|---|---|---|
| `article-h1` | 25px → 42px · `clamp(1.56rem, 3vw, 2.625rem)` | 800, lh 1.25–1.3 | article headline |
| `hero` | 22px → 34px | 700, lh 1.22 | lead story overlay |
| `section-tab` | 20px → 24px | 800 | red section tabs |
| `h-lg` | 20px → 25px | 700 | section lead story |
| `h-md` | 16px → 17.5px | 700 | cards |
| `h-sm` | 15px → 16.5px | 600–700 | lists, top news, sidebar |
| `deck` | 17px → 20px | 500, lh 1.55 | article standfirst |
| `body` | 17px → 20px | 400, lh 1.75–1.85 | article text (adjustable A-/A+) |
| `category` | 12px → 13px | 700, brand colour | labels above headlines |
| `meta` | 12px → 13.5px | 400, muted | time, byline |
| `nav` | 15px → 16.5px | 600, white | main nav |

### 2.3 Layout
- **Container:** `max-w-[1280px] mx-auto px-4 md:px-6 xl:px-0` (the reference uses a fixed 1280px content width inside a 1440px canvas).
- **Grid:** 12 columns, 24–30px gutters on desktop. Common splits: `300 | 1fr | 330` (lead), `1fr | 330` (section + sidebar), `1fr | 340` (article + sidebar).
- **Right rail:** 300–340px wide on ≥1024px; holds ads (300×250, 300×600 sticky), trending and newsletter. Below 1024px the rail content moves inline below the main column.
- **Section spacing:** 34–40px between sections on desktop, 8px grey "gutter bars" (`border-b-8 border-soft`) between blocks on mobile.
- **Radius:** images 4–6px, cards 6px, chips 4px or 16px pills, phone-style story cards 10px. Buttons 4px.
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.

### 2.4 Tailwind tokens (v4 `@theme`, or the v3 equivalent)
```css
@theme {
  --color-brand:#C8102E; --color-brand-dark:#9E0B22; --color-brand-tint:#FFF6F7;
  --color-ink:#111111; --color-ink-2:#333333; --color-muted:#6B6B6B;
  --color-line:#E4E4E4; --color-soft:#F5F5F5; --color-gold:#F6B40E; --color-navy:#0F1B33;
  --color-up:#0A8F3D; --color-down:#D0021B;
  --font-hindi: var(--font-mukta), "Noto Sans Devanagari", system-ui, sans-serif;
  --font-ui: var(--font-inter), system-ui, sans-serif;
}
```
`<html lang="hi">`, `body { font-family: var(--font-hindi) }`. shadcn: `--primary: brand`, `--border: line`, `--radius: 0.375rem`.

---

## 3. Core components (`components/news/*`)

| Component | Spec |
|---|---|
| **CategoryLabel** | `text-brand font-bold text-[13px]`, links to category. |
| **TimeAgo** | "10 मिनट पहले", "2 घंटे पहले", "कल", then date "20 नवंबर 2026". Use `Intl.RelativeTimeFormat('hi')` with a custom formatter. `<time dateTime>`. |
| **StoryImage** | `next/image`, fixed aspect (16:9 default, 4:3 for list thumbs), rounded 4–6px, `bg-soft` placeholder + blur. Optional overlays: `PlayBadge` (34px black circle with ▶, bottom-left), `Duration` (black pill bottom-right, Inter 11px), `PhotoCount` (pill top-right "◧ 12"), `LiveBadge`. |
| **LiveBadge** | Brand bg, white Inter 12px bold "LIVE", pulsing white dot (`animate-pulse`, motion-safe). |
| **StoryCard** variants | `hero` (image with gradient overlay `transparent → rgba(0,0,0,.85)`, white headline 34px, deck, LIVE badge top-left) · `stack` (image on top, category, headline, time) · `row` (text left, thumbnail right 96–120px — used in lists and mobile) · `row-left` (thumbnail left) · `numbered` (big light-grey Inter number 28px + headline) · `text` (headline only). |
| **SectionHeader** | Bottom border 2px ink. Red tab on the left: brand bg, white 24px/800 title, padding 4px 16px, with a **triangular notch** on its right edge (CSS border triangle, 14px). Optional sub-category links next to it (first active in brand), and "और पढ़ें →" link at right in brand. On dark sections the rule is `#444`/`#2d3c5e`. |
| **SideHeading** | 20px/800 with a 4px brand left bar (used in the rail: "सबसे ज़्यादा पढ़ी गईं", "ट्रेंडिंग", "बाज़ार"). |
| **AdSlot** | Reserved fixed-size box (`728×90`, `970×250`, `300×250`, `300×600`, `320×50`, `320×100`, in-article fluid min-h 120) with `bg-soft` diagonal stripes and a small "Advertisement / विज्ञापन" label until the ad loads. Size comes from props; **always reserve height to prevent CLS**. Lazy-load below the fold. Collapse in dev with an env flag. |
| **Ticker** | Black label "⚡ ब्रेकिंग" with right-pointing notch, then a horizontally scrolling list of headlines separated by red dots. CSS marquee (`@keyframes`), pause on hover/focus, `prefers-reduced-motion` → static list with arrows. |
| **TagChip** | Pill, `border-line bg-[#fafafa]`, `#` in brand, 14px/600. |
| **ShareBar** | Circular 38px buttons: WhatsApp `#25D366`, Facebook `#1877F2`, X `#111`, LinkedIn `#0A66C2`, Copy `#888`; font-size control "अ- अ+" pill. Use the Web Share API on mobile first. |
| **Logo** | Brand square (54px desktop / 34px mobile, radius 6) with white "ख़" (800), plus wordmark "ख़बर सेतु" in brand 800 (40px / 24px) and tagline "सच की ख़बर, सबसे पहले" (13px muted). Build as an SVG/React component; white version for the footer. |

---

## 4. Global layout

### 4.1 Utility bar (desktop ≥1024)
`bg-[#F3F3F3]`, h-9, 13px. Left: Hindi date ("शुक्रवार, 20 नवंबर 2026"), weather ("☁ नई दिल्ली 18°C"), AQI pill ("AQI 212 · ख़राब", colour-coded). Right: ई-पेपर, वीडियो, वेब स्टोरीज़, पॉडकास्ट, "English" pill (language switch), लॉग इन.

### 4.2 Masthead
- Desktop: h-[108px]; logo left, **728×90 AdSlot** centre, right column with "सब्सक्राइब करें" (brand button) and "आज का ई-पेपर" with a mini paper icon.
- Mobile: h-14, logo (34px mark + 24px wordmark), right icons: search, notifications bell, hamburger. Sticky.

### 4.3 Main nav
- Desktop: full-width brand bar h-12; items 16.5px/600 white, padding 0 13px: ⌂ (home, active state `brand-dark` bg) · देश · दुनिया · राज्य ▾ · मनोरंजन · क्रिकेट · खेल · बिज़नेस · टेक · लाइफस्टाइल · धर्म · शिक्षा · नौकरी · ऑटो · ज्योतिष · और ▾; right: search + menu icons. **राज्य ▾** opens a mega-menu (states in 4 columns with their top cities). **और ▾** lists the remaining categories. Sticky on scroll (compact 44px height, logo mark appears at left).
- Mobile: horizontally scrollable red chip bar under the header (active item underlined with 3px white bar), snap scrolling, no visible scrollbar.

### 4.4 Breaking ticker + trending
Under the nav: Ticker (h-11, bottom border line). Then trending row (desktop: "ट्रेंडिंग:" + TagChips; mobile: scrollable).

### 4.5 Mobile bottom tab bar (<768)
Fixed, h-[76px] incl. safe area, white, top border line. 5 items: होम ⌂ · स्टोरीज़ ◧ · वीडियो ▶ · ई-पेपर 📰 · प्रोफ़ाइल/मेन्यू. Use lucide icons (Home, GalleryVerticalEnd, PlayCircle, Newspaper, User/Menu). Active = brand. Hidden on article pages (replaced by the share bar) and inside web stories.

### 4.6 Mobile menu (Sheet, full screen)
Header with logo + ✕; search input ("ख़बरें, शहर या विषय खोजें"); **"अपना राज्य चुनें"** 3-col grid of state buttons (selected = brand); "कैटेगरी" list with chevrons (17px/700, rules between); language toggle हिंदी / English (ink filled / outline). The chosen state is saved (cookie) and personalises the home page state block.

### 4.7 Footer
`#141414`. Desktop 5 columns (1.4fr + 4×1fr): white logo, one-line about, app badges (outline pills "Google Play", "App Store"), social circles (36px, `#2A2A2A`); link columns ख़बरें / खेल-मनोरंजन / काम की बात / हमारे बारे में (15px, lh 2, `#BDBDBD`). Bottom bar: © text left, legal links right. Mobile: logo block, then link columns as 2×2 grid, then accordions for long lists.

---

## 5. Homepage (`/`) — order of sections

Reference: `01-news-homepage-desktop.png`, mobile screen 01.

1. **Lead block** — desktop grid `300px | 1fr | 330px`, gap 26px.
   - **टॉप न्यूज़** list (left): heading 20px/800 with 3px brand underline + "सभी →"; 5 `row` cards (headline 16.5px left, 96×64 thumb right), rules between.
   - **Hero** (centre): `hero` card 420px tall with LIVE badge, category "मौसम · लाइव अपडेट" (light pink `#FFD0D6` on dark), headline 34px, one-line deck. Below: 2 `stack` cards (image 150px).
   - **Right rail**: **LiveUpdates** box (1px line border, 3px brand top border, heading "लाइव अपडेट" + LIVE badge, 4 timeline entries: Inter brand time "12:58", red dot, 15px headline, dashed separators; links to live blog) + 300×250 AdSlot.
   - Tablet: hero full width, then top news and live box side by side. Mobile: hero (image 220px + text below), then `row` list; live box after 3rd story.
2. **State strip** — full-width `bg-soft`, "अपने राज्य की ख़बरें" + state buttons (white, 1px border, radius 4; selected = brand). Mobile: horizontal scroll. Clicking swaps a state news block (client fetch) shown under the strip.
3. **देश section + rail** — grid `1fr | 330px`. Section: SectionHeader with sub-tabs (सभी, राजनीति, रक्षा, रेलवे, कृषि) → inner grid `1.25fr | 1fr`: lead story (image 280px, headline 25px, deck, time) + 4 `row-left` items (120×76 thumbs). Rail: **सबसे ज़्यादा पढ़ी गईं** — 6 numbered items.
   - Repeat this pattern for दुनिया, राज्य, etc. (`<CategoryBlock category="desh" />`).
4. **वेब स्टोरीज़** — full-width `#111` band. 7 vertical cards (≈9:16, h-300, radius 10) with segmented progress bars at top and a gradient title at the bottom; desktop grid of 7, tablet 4 + scroll, mobile horizontal snap scroll (140px wide cards).
5. **खेल · मनोरंजन · rail** — grid `1fr 1fr 330px`.
   - खेल: **Scorecard** widget (navy gradient, radius 6; match label + LIVE; team rows with flag chip, name, score "287/4 (42.3)" in Inter; status line in gold), then a `stack` card with play badge.
   - मनोरंजन: big `stack` card (image 220px) + 2 `row-left`.
   - Rail: **Market widget** (rows: सेंसेक्स, निफ़्टी, सोना, चांदी; value + ▲/▼ % in up/down colours; "Updated 3:30 PM" note) + 300×250 ad.
6. **वीडियो** — full-width navy band; SectionHeader on dark with sub-tabs (सभी, न्यूज़, शॉर्ट्स, इंटरव्यू); grid `1.6fr | 1fr`: main video (380px, big 76px brand circular ▶ in centre, headline 24px white, duration + time) + 4 `vl` rows (170×96 thumbs with duration pills). Mobile: main video then horizontal list.
7. **बिज़नेस · टेक · ऑटो · नौकरी** — 4-column `stack` cards (2 cols tablet, 1 col with row cards on mobile).
8. **फ़ोटो गैलरी** — bento grid: `2fr 1fr 1fr`, 2 rows of 180px; first tile spans 2 rows with caption overlay; photo-count pills.
9. **आज का राशिफल** — 12 tiles (zodiac glyph in brand 30px + Hindi name), 12 cols desktop, 6 tablet, 4 mobile (or a horizontal scroll). Each links to `/rashifal/[sign]`.
10. **Footer**.

Insert **AdSlots** between sections: after the state strip (970×250 desktop / 320×100 mobile), after web stories, before the footer. Mobile: one 300×250 "in-feed" ad after every ~6 stories.

---

## 6. Article page (`/[category]/[slug]-[id]`)

Reference: `02-news-article-desktop.png`, mobile screen 02.

- **Compact header** (76px) + nav; **reading progress bar** 4px gold under the nav (sticky).
- **Breadcrumb**: होम › **देश** › मौसम (14px, muted, current category in brand).
- Grid `1fr | 340px`, gap 44px.
- **Main column**
  1. CategoryLabel (15px) → **H1** 42px/800 lh 1.25 → **deck** 20px/500 ink-2.
  2. **मुख्य बातें** (key highlights) box: `brand-tint` bg, 4px brand left border, title brand 16px/800, 3–5 bullets 16.5px/500.
  3. **Byline row** (rules top/bottom): avatar circle (brand-tint bg, initials in brand), reporter name 16px/700, "नई दिल्ली · अपडेटेड: 20 नवंबर 2026, 01:10 PM IST · 4 मिनट में पढ़ें"; right: font-size pill "अ- अ+" + ShareBar.
  4. **Featured image** 16:9 (470px at desktop), radius 6, caption 14px muted with "(प्रतीकात्मक तस्वीर)" when it is a file photo. Optional: a video embed instead.
  5. **Body** (rich text from CMS): 20px/1.85, paragraphs mb-5; first word dateline bold ("**नई दिल्ली।**"); H2 26px/800; supported embeds: image with caption, YouTube/X/Instagram embeds (lazy, facade), table, list, blockquote.
  6. **यह भी पढ़ें** inline box: 1px line border + 4px brand left border, 130px thumb + "यह भी पढ़ें" label (brand 13px/800) + 18px headline. Auto-insert after paragraph 2 (and every ~5 paragraphs).
  7. **In-article AdSlot** after paragraph 4 (fluid, min-h 120).
  8. **Pull quote**: 3px brand top border, bottom rule, 26px/700 in brand-dark, attribution 15px muted.
  9. **Tags**: soft chips "# मौसम".
  10. **Follow box**: navy, radius 8, "… को Google News और WhatsApp पर फ़ॉलो करें" + two white buttons.
  11. **संबंधित ख़बरें**: SectionHeader + 3 `stack` cards.
  12. Optional comments (collapsed by default), then "अगली ख़बर" infinite scroll that loads the next article and updates the URL (history.replaceState) — feature-flagged.
- **Right rail** (desktop): 300×250 ad → ट्रेंडिंग (5 numbered) → newsletter box ("सुबह की 10 बड़ी ख़बरें", brand-tint, email input + "जुड़ें" brand button) → **sticky 300×600 ad** (`position: sticky; top: 64px`).
- **Mobile**: header becomes ← back · logo mark · "अ+" · bookmark; image full-bleed (200px) above the headline; H1 25px; body 17px/1.75; **fixed bottom ShareBar** (f, X, in, copy + wide green "WhatsApp" pill), safe-area padding. Rail content (trending, newsletter) moves below the related stories.

### 6.1 Live blog (`/live/[slug]`)
Same shell as the article, plus: sticky "LIVE" header with last-updated time and auto-refresh toggle; a key-events summary at the top; a vertical timeline of updates (time in Inter brand, red dot, 1px vertical line, each update can include images/embeds); "नए अपडेट (3)" pill appears when new posts arrive (poll every 30–60s or SSE).

---

## 7. Other templates

| Route | Layout |
|---|---|
| `/[category]` (e.g. `/desh`) | Category title as big SectionHeader + sub-category tabs; lead block (1 big + 4 rows) then an infinite/paginated list of `row` cards (desktop: 2-column list + rail). Ads every 6 items. |
| `/state/[state]` and `/state/[state]/[city]` | Same as category, with a city selector (chips) at the top. |
| `/videos`, `/videos/[slug]` | Video grid (16:9 cards with duration), video page with player, title, description, up-next list. Shorts row = 9:16 cards. |
| `/web-stories/[slug]` | Full-screen story player (mobile screen 03): segmented progress bars, header (logo + "वेब स्टोरीज़" + ✕), full-bleed image, bottom gradient with slide counter chip ("2 / 7" brand), headline 30px/800, short text 16px, "⌃ पूरी ख़बर पढ़ें" link. Tap left/right to navigate, hold to pause, swipe down to close. Desktop: centred 9:16 player (420px wide) on a blurred background with arrows. Consider also publishing them as AMP Web Stories for Google Discover. |
| `/photos/[slug]` | Gallery: big image, caption, counter "3/12", thumbnails strip, ad every 4 images. |
| `/rashifal`, `/rashifal/[sign]` | 12-sign grid; sign page with today/week/month tabs. |
| `/epaper` | Edition + city selector and page thumbnails (link to the e-paper viewer). |
| `/search` | Search input, filters (category, date), result `row` cards, highlighted matches. |
| `/author/[slug]` | Author bio card + their stories. |
| `/about`, `/contact`, `/privacy`, `/terms`, `/advertise` | Simple text pages using article typography. |
| `not-found` | Logo, "यह पेज नहीं मिला", search box and top 5 stories. |

---

## 8. Responsive summary

| Element | Mobile <768 | Tablet 768–1023 | Desktop ≥1024 |
|---|---|---|---|
| Header | 56px, logo + search/bell/menu | same + bigger logo | utility bar + masthead with 728×90 ad |
| Nav | red scrollable chips | red scrollable chips | full red bar + mega menu |
| Bottom tab bar | yes | no | no |
| Lead block | hero then list; live box inline | hero full width, list + live box in 2 cols | 3 columns |
| Category block | lead + rows; rail below | 2 cols, rail below | 2 cols + 330px rail |
| Web stories | scroll, 140px cards | scroll, 4 visible | 7 grid |
| Business grid | rows | 2 cols | 4 cols |
| Gallery | 1 big + 2×2 small | bento | bento |
| Rashifal | 4 cols | 6 cols | 12 cols |
| Article | full-bleed image, fixed share bar, no rail | 1 col, rail below | 2 cols + sticky rail |

Rules: no horizontal page scroll at 360px; tap targets ≥ 44px; mobile body text ≥ 16px; headline lines ≤ 3 on cards (`line-clamp-3`), 2 for small lists.

---

## 9. Data model (`lib/data/*`, typed; swap for CMS later)

```ts
export type Category = { slug: string; name: string; /* "देश" */ children?: Category[] };
export type Author = { slug: string; name: string; avatar?: string; bio?: string };
export type Media = { url: string; alt: string; width: number; height: number; caption?: string; credit?: string; isFile?: boolean };
export type Story = {
  id: string; slug: string; type: "article" | "live" | "video" | "gallery" | "webstory";
  title: string; deck?: string; highlights?: string[];
  category: Category; subCategory?: Category; state?: string; city?: string;
  image: Media; author: Author; dateline?: string;
  publishedAt: string; updatedAt?: string; readMinutes?: number;
  body?: RichTextBlock[]; tags?: string[];
  isLive?: boolean; isBreaking?: boolean; videoDuration?: string; photoCount?: number;
};
export type LiveUpdate = { id: string; time: string; title: string; body?: RichTextBlock[] };
export type WebStory = { slug: string; title: string; slides: { image: Media; title: string; text?: string }[] };
```
Mock data must be clearly fake (generic headlines, no real people's names or invented quotes from real people). Widgets (weather, AQI, markets, cricket score) use mock JSON behind `lib/services/*` interfaces so real APIs can be plugged in.

**Recommended backend (later):** a headless CMS (Sanity, Strapi, Payload or headless WordPress), ISR with `revalidate` 60s for home/category and on-demand revalidation on publish; breaking/live via polling or SSE.

---

## 10. Performance, SEO, ads, accessibility

- **Performance:** LCP < 2.5s on mid-range Android/4G. `next/image` (AVIF/WebP, sizes), priority only for the hero image; fonts via `next/font` with `display: swap` and Devanagari subset; no client JS for static sections (React Server Components), client components only for ticker, tabs, state selector, live box, carousels, share. Lazy-load everything below the fold. Facade for YouTube embeds.
- **Ads:** Google Ad Manager / AdSense later; for now `<AdSlot size="300x250" />` placeholders. Reserved sizes, lazy-loading, max ~30% of the viewport on mobile, never above the H1 on articles, clearly labelled "विज्ञापन".
- **SEO:** `NewsArticle` JSON-LD (headline, image, datePublished, dateModified, author, publisher), `LiveBlogPosting` for live pages, `BreadcrumbList`, `VideoObject`. Google News sitemap (`/news-sitemap.xml`, last 48h) + normal sitemap, RSS per category, canonical URLs, Hindi slugs transliterated to Latin (`/desh/uttar-bharat-kohra-alert-12345`), `hreflang` for an English edition, Open Graph/Twitter images (see GRAPHICS_PROMPTS.md §8).
- **PWA (optional):** manifest, offline page, web push for breaking news (opt-in prompt only after the second visit).
- **Accessibility:** `lang="hi"`, semantic `header/nav/main/article/aside/footer`, one H1 per page, alt text in Hindi, visible focus rings (2px brand), ticker pausable, colour contrast AA (brand on white passes for bold text ≥ 14px), font-size control persisted in localStorage.
- **Dark mode (optional, phase 2):** bg `#0E0E0E`, text `#EDEDED`, lines `#2A2A2A`, brand stays `#E0233F`.

---

## 11. Build order & structure

```
app/
  layout.tsx                 fonts, UtilityBar, Masthead, MainNav, Ticker, Footer, MobileTabBar
  page.tsx                   homepage
  [category]/page.tsx
  [category]/[slug]/page.tsx article (slug ends with -id)
  live/[slug]/page.tsx
  state/[state]/page.tsx
  videos/… web-stories/[slug]/… photos/[slug]/… rashifal/… search/… author/[slug]/…
components/
  layout/  UtilityBar, Masthead, MainNav, MegaMenu, MobileHeader, MobileMenuSheet, MobileTabBar, Footer, Logo
  news/    CategoryLabel, TimeAgo, StoryImage, LiveBadge, StoryCard(+variants), SectionHeader, SideHeading,
           Ticker, TrendingTags, AdSlot, ShareBar, TagChip
  home/    LeadBlock, TopNewsList, HeroStory, LiveUpdatesBox, StateStrip, CategoryBlock, MostRead,
           WebStoriesRow, ScoreCard, MarketWidget, VideoSection, BizGrid, PhotoGallery, RashifalGrid
  article/ ArticleHeader, Highlights, Byline, FontSizeControl, ArticleBody, ReadAlso, PullQuote, Tags,
           FollowBox, RelatedStories, ReadingProgress, MobileShareBar, NewsletterBox
  stories/ WebStoryPlayer
lib/  site.ts (brand name, colours, social links) · data/* (mock) · services/* · format/hindiDate.ts
```

Order: tokens + fonts + Logo → news primitives (make `/dev/components` to preview all StoryCard variants, AdSlot sizes, badges) → global layout (desktop + mobile header, nav, ticker, tab bar, menu sheet, footer) → homepage top to bottom → article page → category/state → live blog → web story player → videos/photos/rashifal/search → SEO, ads, performance pass.

---

## 12. Acceptance checklist
- [ ] Homepage matches `reference/01-news-homepage-desktop.png` at 1440px.
- [ ] Article matches `reference/02-news-article-desktop.png` at 1440px.
- [ ] Mobile home / article / web story / menu match `reference/03-news-mobile-screens.png` at 390px.
- [ ] No horizontal scroll at 360px; correct at 768/1024/1280.
- [ ] Devanagari renders with Mukta, no clipped matras (check line-height on 800-weight headlines).
- [ ] Every AdSlot reserves its size — CLS < 0.1.
- [ ] Ticker pauses on hover/focus; reduced-motion respected.
- [ ] State selection persists and changes the state block.
- [ ] Article has NewsArticle JSON-LD, OG image, canonical; Lighthouse mobile ≥ 90 performance, 100 SEO.
- [ ] Brand name comes only from `lib/site.ts`.
