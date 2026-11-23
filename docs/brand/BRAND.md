# Daydreams News — brand kit

Everything here is generated from **one master**:
`docs/brand/source/daydreams-news-logo-transparent.png` (the owner-supplied logo,
transparent background). `daydreams-news-logo-on-light.png` is the same logo on an
off-white background, kept as a reference.

To change the logo, replace the master and run:

```bash
node scripts/brand-assets.mjs
```

The script writes every file listed below and a contact sheet,
`docs/brand/preview.png`. If a size changes, update `site.brand` in `lib/site.ts`.
`tests/brand-assets.test.ts` fails if the config and the files disagree.

---

## 1. Colours

| Name | Hex | Use |
|---|---|---|
| Swan navy | `#013376` | Swan, wordmark, dark backgrounds |
| Deep navy | `#00214F` | Gradient end on covers and avatars |
| Sunrise gold | `#FAB736` | Sun, swoosh, "news" pill, underline, accents on navy |
| White | `#FFFFFF` | Backgrounds, "news" lettering, feather lines |
| Cream | `#FFF8EB` | Soft background on light designs (OG card) |

The website UI still uses the earlier red theme (`--color-brand #C8102E`). See
known gap G29.

## 2. Logo versions

| Version | File (`public/brand/…`) | Use on |
|---|---|---|
| Full colour | `logo/daydreams-news-logo.png` | White or light backgrounds (default) |
| Reverse | `logo/daydreams-news-logo-reverse.png` | Navy, black or dark backgrounds. The swan turns white and the feather lines and "news" lettering turn navy. |
| Mono white | `logo/daydreams-news-logo-mono-white.png` | Over photos, video and single-colour overlays |
| Mono navy / mono black | `logo/…-mono-navy.png`, `…-mono-black.png` | One-colour print, stamps, watermarks |
| Stacked | `logo/daydreams-news-logo-stacked.png` (+ `-reverse`) | Square or tall spaces |
| Wordmark only | `logo/daydreams-news-wordmark.png` (+ `-reverse`) | Where the swan is shown separately |
| Mark (swan) | `mark/daydreams-news-mark.png` (+ reverse / mono) | Icons, avatars, small spaces |
| Fixed widths | `logo/daydreams-news-logo-{1200,600,300}w.png` (+ reverse) | Email, newsletter, documents |

The swan in the master is only about 350 px wide. The mark files are upscaled
3× and their edges re-sharpened, which works because the logo is three flat
colours. A vector (SVG) master from the designer would still be better for print
and very large sizes (see owner TODO).

**Clear space:** leave at least the height of the "news" pill empty on every
side. **Minimum size:** full logo 120 px wide on screen. Below that, use the mark.
**Don't** recolour, stretch, rotate, add shadows or outlines, or put the
full-colour logo on navy (use the reverse version).

## 3. Favicon and app icons

| File | Size | Notes |
|---|---|---|
| `app/favicon.ico` | 16, 32, 48 | Swan on a white rounded tile, so it reads on dark browser tabs too |
| `app/icon.png` | 192 | `<link rel="icon">`. Google Search shows favicons from a multiple of 48 px. |
| `app/apple-icon.png` | 180 | iOS home screen, full white square (iOS rounds the corners) |
| `public/brand/icons/icon-{192,512}.png` | | Manifest `any` |
| `public/brand/icons/icon-maskable-{192,512}.png` | | Manifest `maskable`, swan inside the 80 % safe circle |
| `public/brand/icons/icon-monochrome-512.png` | | Manifest `monochrome` (Android themed icons) |
| `public/brand/icons/favicon-{16,32,48}.png` | | PNG copies of the ICO frames |

The manifest is `app/manifest.ts` and is served at `/manifest.webmanifest`.

## 4. SEO and structured data

| File | Size | Where it's used |
|---|---|---|
| `app/opengraph-image.png` / `app/twitter-image.png` | 1200 × 630 | Default share card for every page (with `.alt.txt` alt text) |
| `public/brand/social/og-default-1200x630.png` | 1200 × 630 | The same card at a stable URL, used as the `NewsArticle.image` fallback in JSON-LD |
| `public/brand/seo/organization-logo-512.png` | 512 × 512 | `NewsMediaOrganization.logo` in JSON-LD and as the publisher logo |
| `public/brand/seo/publisher-logo-60h.png` | 60 px high | Google's rectangular publisher logo (AMP / legacy `publisher.logo`) |
| `public/brand/seo/web-story-publisher-logo-192.png` | 192 × 192 | AMP Web Story `publisher-logo-src` (square, at least 96 px) |

## 5. Social profiles

| File | Size | Upload to |
|---|---|---|
| `social/avatar-800.png` | 800 × 800 | Profile photo: Facebook, Instagram, YouTube, WhatsApp Channel, LinkedIn, Google Business. The swan stays inside the circle crop. |
| `social/avatar-800-navy.png` | 800 × 800 | Alternative navy profile photo (stands out more in feeds) |
| `social/x-header-1500x500.png` | 1500 × 500 | X (Twitter) header |
| `social/facebook-cover-1640x624.png` | 1640 × 624 | Facebook page cover |
| `social/youtube-banner-2560x1440.png` | 2560 × 1440 | YouTube channel art (logo inside the 1546 × 423 safe area) |
| `social/linkedin-cover-1128x191.png` | 1128 × 191 | LinkedIn company page cover |

## 6. Typography in brand designs

The Hindi text on the cards is the site tagline from `lib/site.ts` (*सच की ख़बर,
सबसे पहले*). The script asks for Mukta (the site font) and falls back to
Nirmala UI / Noto Sans Devanagari. Mukta is not installed on the machine that
made the current files, so they use Nirmala UI. Install Mukta locally and
re-run to match the site exactly.
The wordmark itself is part of the logo image, not a font.
