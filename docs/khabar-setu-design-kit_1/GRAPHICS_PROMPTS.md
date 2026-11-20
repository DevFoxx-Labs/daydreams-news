# ख़बर सेतु — Graphics Prompt Pack (Hindi News Portal)

Image-generation prompts for the graphics a news portal needs: category fallback images, illustrated explainers, section banners, breaking/live templates, web-story covers, icons, social/OG templates, house ads and empty states. They match `DESIGN.md` (brand red `#C8102E`, ink `#111`, navy `#0F1B33`, gold `#F6B40E`, white).
Works with ChatGPT / GPT-Image, Midjourney, Ideogram, Gemini (Imagen / Nano Banana), Adobe Firefly, Leonardo, Flux.

---

## ⚠️ 0. News ethics: read first

AI images are for **illustrations, templates, icons and fallbacks only**.
- **Never** generate a realistic "photo" of a real event, disaster, protest, accident, crime scene or real person and publish it as news. Real stories use real photos (staff, agencies, handouts) with credits.
- When a story uses an AI illustration, caption it **"(प्रतीकात्मक चित्र / AI से बनाई गई तस्वीर)"** and keep it clearly illustrative (flat, stylised), not photorealistic.
- No real politicians, celebrities, logos of parties/brands, flags of other organisations, or real newspaper mastheads in generated images.
- Text inside images (social cards) must be checked for spelling and facts before posting.

---

## 1. How to use

### 1.1 Style lock: paste in place of `[STYLE]` at the end of each prompt
```
Modern flat editorial news illustration, clean vector shapes, limited palette of crimson red #C8102E, deep navy #0F1B33,
warm gold #F6B40E, charcoal #111111 and white, soft subtle grain, simple geometric forms, clear focal point,
generous negative space, Indian context, no text, no letters, no logos, no watermark, not photorealistic.
```
**Short version:** `flat editorial vector illustration, crimson red #C8102E, navy #0F1B33, gold #F6B40E, white, Indian context, minimal, no text`

### 1.2 Negative prompt (Midjourney `--no`, Leonardo/Flux negative field)
```
text, letters, watermark, logo, signature, photorealistic faces, real people, celebrity, politician, party symbol, flag of party,
gore, blood, violence, cluttered, neon, glitch, low resolution, distorted hands
```

### 1.3 Tool tips
| Tool | Tip |
|---|---|
| Midjourney | `--style raw --v 7` + aspect ratio; once one image looks right, reuse it with `--sref <url>` for a consistent set. |
| ChatGPT / GPT-Image | Upload `reference/01-news-homepage-desktop.png` and say "match this colour palette". Ask for "transparent background" for icons and cutouts. |
| Ideogram | Best when the image needs **Hindi text** (social cards, thumbnails). Put the exact Hindi in quotes and verify it afterwards. Hindi text from AI often breaks matras; if it does, generate without text and add the text in Canva or Figma using Mukta. |
| Gemini / Nano Banana | Good for edits: "convert this to the same flat style, palette #C8102E/#0F1B33/#F6B40E". |
| Firefly | Commercially safe; Style → "Flat design" / "Vector look". |

### 1.4 Sizes
| Use | Size (px) | Ratio |
|---|---|---|
| Story image / fallback | 1600 × 900 | 16:9 |
| List thumbnail | 800 × 600 | 4:3 |
| Web story slide | 1080 × 1920 | 9:16 |
| Video thumbnail | 1280 × 720 | 16:9 |
| OG / link preview | 1200 × 630 | 1.91:1 |
| Instagram post | 1080 × 1350 | 4:5 |
| Section banner | 2560 × 640 | 4:1 |
| Icon set | 1024 × 1024 per icon (export SVG/PNG 96px) | 1:1 |
| House ad | 300×250, 728×90, 320×100 (design at 2×) | fixed |

Export WebP (photos/illustrations, ~80%), PNG (transparent), SVG (icons after vectorising). Keep story images < 200 KB.

---

## 2. Category fallback images (used when a story has no photo)

One per category, 16:9, illustrative. Generate 2–3 variants each so repeated fallbacks don't look identical.

| Category | Prompt |
|---|---|
| **देश (National)** | `Stylised map silhouette of India made of geometric shapes with small location pins, abstract roads connecting cities, calm composition. [STYLE] --ar 16:9` |
| **दुनिया (World)** | `Stylised globe with longitude lines, small paper planes circling it, abstract continents in navy and red. [STYLE] --ar 16:9` |
| **राज्य / शहर (State/City)** | `Generic Indian city skyline at dusk with mixed old and new buildings, a domed generic heritage gate, auto-rickshaw silhouettes on the road, no real landmark. [STYLE] --ar 16:9` |
| **राजनीति (Politics)** | `Abstract ballot box with a hand dropping a blank paper slip, podium with microphones in the background, no people's faces, no party symbols. [STYLE] --ar 16:9` |
| **मौसम (Weather)** | `Weather illustration: half the frame sunny, half rainy, with clouds, umbrella and thermometer icon, Indian rooftops below. [STYLE] --ar 16:9` (variants: dense fog over a highway with dim headlights; heatwave with sun and mirage; winter cold with shawl-wrapped figure seen from behind) |
| **क्राइम (Crime)** | `Abstract police barricade tape in the foreground (no text on the tape), blurred city lights, a generic police cap on a table, no violence, no people. [STYLE] --ar 16:9` |
| **कोर्ट / क़ानून** | `Scales of justice and a wooden gavel on a desk with stacked law books, calm and neutral. [STYLE] --ar 16:9` |
| **बिज़नेस** | `Rising stock market candlestick chart on a screen with a rupee coin stack in the foreground, abstract arrows. [STYLE] --ar 16:9` |
| **सोना-चांदी** | `Gold bars and silver coins arranged neatly with a small price-tag shape (blank), warm lighting in flat style. [STYLE] --ar 16:9` |
| **टेक** | `Smartphone with abstract app icons floating above it, a microchip pattern in the background, no brand logos. [STYLE] --ar 16:9` |
| **ऑटो** | `Generic modern hatchback and an electric scooter side by side on a clean road, charging plug icon, no brand logos. [STYLE] --ar 16:9` |
| **क्रिकेट** | `Cricket stadium at night under floodlights, bat and ball in the foreground on the pitch, stumps, crowd as abstract dots, no team logos or jerseys. [STYLE] --ar 16:9` |
| **खेल (other sports)** | `Collage of sports equipment: football, hockey stick, badminton racket, kabaddi court lines, medal. [STYLE] --ar 16:9` |
| **मनोरंजन** | `Cinema hall with red velvet seats, a glowing blank screen, film reel and popcorn bucket, spotlight beams. [STYLE] --ar 16:9` |
| **OTT / वेब सीरीज़** | `Living room with a TV showing a blank play button screen, sofa, remote control and snacks, cosy evening. [STYLE] --ar 16:9` |
| **लाइफस्टाइल** | `Healthy breakfast bowl, yoga mat, plant and a water bottle arranged in a calm flat lay. [STYLE] --ar 16:9` |
| **स्वास्थ्य** | `Stethoscope, medicine strip and a heart-rate line on a soft background, hospital cross icon in red. [STYLE] --ar 16:9` |
| **धर्म / अध्यात्म** | `Generic Indian temple silhouette at sunrise with diyas and marigold garlands, no specific real temple. [STYLE] --ar 16:9` |
| **शिक्षा** | `Classroom blackboard with blank lines, stacked textbooks, pencil and a graduation cap. [STYLE] --ar 16:9` |
| **नौकरी (Jobs)** | `Office desk with a laptop, a printed resume sheet (no readable text), a pen and an ID card lanyard, sunrise window. [STYLE] --ar 16:9` |
| **कृषि (Agriculture)** | `Green farm fields with a tractor, a farmer seen from behind with a turban, sun over the horizon. [STYLE] --ar 16:9` |
| **ज्योतिष** | `Zodiac wheel with 12 constellation symbols, stars and a crescent moon on navy background with gold lines. [STYLE] --ar 16:9` |
| **विज्ञान / अंतरिक्ष** | `Rocket launching into a starry sky with a crescent moon, satellite orbiting, no agency logos. [STYLE] --ar 16:9` |

---

## 3. Explainer & data illustrations (for "समझिए" stories)

- **Step diagram:** `Infographic-style illustration of a 4-step process shown as connected circles with simple icons (form, upload, payment, check mark), arrows between them, empty space for labels. [STYLE] --ar 16:9`
- **Comparison:** `Split-screen illustration comparing two scenes, left side "before" in muted tones, right side "after" bright, with an arrow in the middle, no text. [STYLE] --ar 16:9`
- **Budget / money:** `Illustration of a big rupee coin split like a pie chart into colourful slices, small icons around it (house, school, hospital, road). [STYLE] --ar 16:9`
- **Timeline:** `Horizontal timeline with 5 milestone markers and small icons above each, clean navy line with red dots. [STYLE] --ar 16:9`
- **Map highlight:** `Simplified outline map of India with five northern states highlighted in red and the rest light grey, small weather icons over the highlighted region. [STYLE] --ar 4:3` (use for weather/alerts; add state names in Figma)
- **Q&A / FAQ:** `Large question-mark shape built from newspaper fold shapes, magnifying glass, minimal. [STYLE] --ar 16:9`

---

## 4. Breaking / Live / alert templates (generate without text, add text in HTML or Figma)

- **Breaking background:** `Bold abstract breaking-news background: diagonal crimson and black bands, subtle world map lines, glowing dots, dynamic motion, strong empty area in the centre for headline text. [STYLE] --ar 16:9`
- **Live blog header:** `Abstract broadcast background: radio-wave circles emanating from a red dot on the left, navy background with fine grid, empty right two-thirds. [STYLE] --ar 4:1`
- **Weather alert card:** `Orange-alert style weather background: dark clouds, fog layers and a small warning triangle icon (blank), gradient from navy to grey, empty space for text. [STYLE] --ar 16:9`
- **Election / results (neutral):** `Neutral election results background: abstract bar chart columns in grey and navy, ballot box icon, confetti dots, no party colours or symbols. [STYLE] --ar 16:9`
- **Exam results:** `Results-day background: mark sheet icon (blank), trophy, confetti, books, cheerful. [STYLE] --ar 16:9`
- **Cricket live score card:** `Navy stadium-lights background with abstract scoreboard panels (blank), cricket ball and bat icon at the side. [STYLE] --ar 16:9`

---

## 5. Section banners & homepage decoration

| Section | Prompt |
|---|---|
| **वेब स्टोरीज़ band** | `Dark charcoal background with faint vertical phone-shaped frames fading into the distance, subtle red glow, very minimal. [STYLE] --ar 4:1` |
| **वीडियो band** | `Deep navy background with a large faint play-button shape and soft light streaks, minimal. [STYLE] --ar 4:1` |
| **फ़ोटो गैलरी header** | `Vintage camera with film strip unrolling across the frame, flat style. [STYLE] --ar 4:1` |
| **राशिफल header** | `Navy night sky with gold zodiac constellation lines and a crescent moon across a wide banner. [STYLE] --ar 4:1` |
| **State news strip** | `Wide panoramic illustration of a generic Indian landscape changing from mountains to plains to river ghats to desert, left to right, soft colours. [STYLE] --ar 4:1` |
| **ई-पेपर promo** | `Folded morning newspaper on a tea table with a cup of chai, a smartphone showing a blank newspaper page beside it, warm morning light. [STYLE] --ar 16:9` |
| **Newsletter box** | `Envelope opening with small newspaper icons flying out, sunrise behind, flat. [STYLE] --ar 4:3` |
| **App download promo** | `Hand holding a smartphone with a blank news app screen, notification bell icon popping out, red accents. [STYLE] --ar 16:9` |

---

## 6. Web story covers & slide backgrounds (9:16)

- **Cover template:** `Vertical web story cover background, bold flat illustration in the upper two-thirds, plain dark gradient bottom third for headline text. Subject: [SUBJECT]. [STYLE] --ar 9:16`
  Example subjects: "hill station with snow and pine trees", "Indian street food stall", "7 tips to save phone battery: phone with battery icon", "ancient temple architecture", "winter superfoods on a plate", "space mysteries with planets", "top OTT releases: TV and popcorn".
- **List-slide background:** `Vertical background with a big empty circle in the centre for a number, subtle pattern of [SUBJECT] icons around the edges. [STYLE] --ar 9:16`
- **End slide (CTA):** `Vertical background with a smartphone and a swipe-up arrow, red and navy, empty centre. [STYLE] --ar 9:16`

---

## 7. Icon sets (transparent PNG → vectorise to SVG)

- **Navigation / category icons (one set):** `Set of 16 matching line icons, 2px rounded stroke in charcoal with a single crimson accent each: home, India map, globe, city building, film clapper, cricket bat and ball, trophy, rupee chart, smartphone, heart pulse, temple, graduation cap, briefcase, car, zodiac star, newspaper. Evenly spaced 4×4 grid, transparent background. [STYLE]`
- **Weather icons:** `Set of 10 flat weather icons: sunny, partly cloudy, cloudy, rain, thunderstorm, fog, haze/smog, cold wave, heatwave, snow. Consistent style, crimson/gold/navy palette, transparent background, 5×2 grid. [STYLE]`
- **AQI faces:** `Set of 6 simple round face icons for air quality levels from good to severe, colours green, yellow-green, yellow, orange, red, maroon, minimal expressions. Transparent background. [STYLE]`
- **Zodiac (राशि) set:** `Set of 12 elegant zodiac sign icons (Aries to Pisces) as gold line art inside navy circles, consistent stroke, 4×3 grid, transparent background. [STYLE]`
- **Story-type badges:** `Set of 6 small badge icons: play (video), camera (photos), live dot, web-story (stacked vertical cards), podcast microphone, explainer (lightbulb). Flat, crimson and white, transparent background. [STYLE]`

---

## 8. Social, OG & video thumbnails (text → Ideogram / GPT-Image, or add text later)

- **Default OG image:** `News website share card, white background with a crimson band on the left, a red square logo mark with the Devanagari letter "ख़" in white, large bold Hindi text "ख़बर सेतु", smaller text "सच की ख़बर, सबसे पहले", subtle world-map pattern in light grey. --ar 1.91:1`
- **Article share template (no text):** `Social card template, 1200×630, top 70% empty for a photo, bottom 30% solid crimson band with a thin white rule, small white square logo area at bottom right. --ar 1.91:1`
- **Breaking news post:** `Instagram post: black background, crimson banner at top with bold Hindi text "ब्रेकिंग न्यूज़", large empty middle area for the headline, small logo mark at the bottom. --ar 4:5`
- **Quote card:** `Instagram quote card, navy background, big gold quotation mark, empty centre for a Hindi quote, thin red line at the bottom. --ar 4:5`
- **Video thumbnail template:** `YouTube thumbnail template: left 55% empty for a photo, right side crimson diagonal panel with a white bold area for 3–4 Hindi words, small red "LIVE" style tag top-left (blank), high contrast. --ar 16:9`
- **Daily rashifal post:** `Instagram post background with navy night sky, gold zodiac wheel in the centre, space at top for Hindi title "आज का राशिफल" and date. --ar 4:5`
- **Morning briefing ("सुबह की 10 बड़ी ख़बरें"):** `Instagram carousel cover: sunrise over a city skyline in flat style, big empty area for the number "10" and Hindi title, crimson and gold palette. --ar 4:5`

> Write the headline yourself in Canva or Figma using Mukta 800. It looks sharper, and AI-generated Hindi letters are often wrong.

---

## 9. House ads & promos (fill empty ad slots)

- **Subscribe 300×250:** `Ad banner background 300x250: folded newspaper and a smartphone on crimson background, empty space on top for Hindi headline and a white button shape at the bottom. [STYLE] --ar 6:5`
- **App download 728×90:** `Wide leaderboard background: phone mockup on the left, crimson to navy gradient, empty centre for text, space for two store badges on the right. [STYLE] --ar 8:1`
- **WhatsApp channel 320×100:** `Small mobile banner background: green chat bubble shape and a newspaper icon, white background, empty space for text. --ar 16:5`
- **Advertise with us:** `Megaphone with abstract audience dots and rising chart, crimson and navy, empty space for text. [STYLE] --ar 6:5`

---

## 10. Empty, error & system states

| State | Prompt |
|---|---|
| 404 | `Newspaper with a torn-out hole in the middle, a paper plane flying through the hole, friendly, flat. [STYLE] --ar 4:3` |
| No search results | `Magnifying glass over a blank newspaper page, small question marks, minimal. [STYLE] --ar 4:3` |
| Offline (PWA) | `Smartphone with a disconnected Wi-Fi symbol and a folded newspaper beside it, calm. [STYLE] --ar 4:3` |
| No saved stories | `Empty bookmark ribbon on a blank page, small sparkle, minimal. [STYLE] --ar 4:3` |
| Notifications opt-in | `Bell icon ringing with small newspaper icons around it, crimson accent, friendly. [STYLE] --ar 1:1` |
| Image failed to load (fallback) | `Very minimal light-grey placeholder with a faint newspaper icon in the centre, flat. --ar 16:9` |

---

## 11. Brand assets

- **Logo mark exploration:** `Minimal news logo mark: crimson rounded square with a bold white Devanagari letter "ख़", flat vector, centred, plenty of padding, white background. --ar 1:1` (Redraw the chosen version as a clean SVG in Figma; check that the nukta under ख is correct.)
- **App icon:** `App icon, crimson rounded square with a white Devanagari "ख़" and a small gold dot, flat, iOS style, no other text. --ar 1:1`
- **Favicon:** use the logo mark SVG simplified to 32×32 / 16×16.
- **Splash screen (app/PWA):** `Vertical splash screen, crimson background with the white logo mark centred and a subtle lighter world-map pattern. --ar 9:19.5`
- **Pattern:** `Seamless subtle pattern of tiny newspaper, globe and play icons in light grey on white, for backgrounds. --ar 1:1 --tile`

---

## 12. Placement map

| Where | Graphics |
|---|---|
| Story without photo | §2 category fallback (rotate variants) |
| Lead / hero for explainers | §3 |
| Breaking banner, live blog header | §4 |
| Section bands (web stories, video, rashifal, gallery) | §5 |
| Web stories | §6 |
| Nav, category chips, weather/AQI widgets, rashifal grid | §7 icons |
| OG image, social posts, YouTube | §8 |
| Unfilled AdSlots | §9 house ads |
| 404, search, offline, saved | §10 |
| Header, favicon, app, PWA | §11 |

---

## 13. Prompt for Claude Code (after you've generated the images)

```
I've added images to /public/graphics with these folders: fallbacks/<category>-<n>.webp, icons/*.svg,
banners/*.webp, empty/*.webp, ads/*.webp, brand/*. Read GRAPHICS_PROMPTS.md §12 and wire them in:
- getFallbackImage(categorySlug, storyId) picks a deterministic variant for stories without a photo,
  and sets the caption to "(प्रतीकात्मक चित्र)".
- Use the icon SVGs in nav chips, weather/AQI widgets and the rashifal grid (inline SVG, currentColor).
- AdSlot shows a random house ad from /public/graphics/ads when no ad fills.
- Empty states use the /empty images. All decorative images: alt="" aria-hidden. next/image everywhere, lazy below the fold.
```
