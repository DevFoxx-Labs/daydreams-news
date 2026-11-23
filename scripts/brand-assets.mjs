/**
 * Brand asset generator — every logo size, favicon, app icon, SEO and social
 * image is derived from ONE master file, so a new logo means re-running this.
 *
 *   node scripts/brand-assets.mjs
 *
 * Master: docs/brand/source/daydreams-news-logo-transparent.png
 * Output: public/brand/**, app/favicon.ico, app/icon.png, app/apple-icon.png,
 *         app/opengraph-image.png, app/twitter-image.png, docs/brand/preview.png
 *
 * Uses only tooling already installed (Playwright's Chromium): canvas pixel
 * maths for the colour variants, HTML → PNG screenshots for composed designs
 * (Chromium shapes Devanagari correctly, which `next/og` cannot without a TTF).
 *
 * Colour variants work because the logo is three flat colours (navy, gold,
 * white). Each pixel is split into navy/gold/white weights, which can then be
 * re-mapped (reverse, mono) or sharpened after upscaling the small swan mark.
 *
 * Dev-only tooling; not shipped.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const SRC = "docs/brand/source/daydreams-news-logo-transparent.png";
/** Column (in the master) between the swan and the wordmark. */
const SPLIT_X = 430;
const UPSCALE = 3;

const NAVY = "#013376";
const NAVY_DEEP = "#00214F";
const GOLD = "#FAB736";
const CREAM = "#FFF8EB";

const siteTs = await readFile("lib/site.ts", "utf8");
const tagline = siteTs.match(/tagline:\s*"([^"]+)"/)?.[1] ?? "";
const FONT = `"Mukta","Nirmala UI","Noto Sans Devanagari",system-ui,sans-serif`;

const files = new Map(); // relPath -> Buffer (also served to the preview page)
async function save(rel, buf) {
  await mkdir(path.dirname(rel), { recursive: true });
  await writeFile(rel, buf);
  files.set(rel.replaceAll("\\", "/"), buf);
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

// Every asset (masters and generated files) is served from a fake origin.
const mem = new Map();
await page.route("https://brand.local/**", (route) => {
  const key = decodeURIComponent(new URL(route.request().url()).pathname.slice(1));
  const body = mem.get(key) ?? files.get(key);
  return body
    ? route.fulfill({ body, contentType: "image/png" })
    : route.fulfill({ status: 404, body: "" });
});
const url = (key) => `https://brand.local/${key}`;

// ── 1. Decompose the master into variants ────────────────────────────────
const master = await readFile(SRC);
await page.setContent("<!doctype html><title>brand</title>");
const prepared = await page.evaluate(
  async ({ src, split, up }) => {
    const N = [1, 51, 118];
    const G = [250, 183, 54];
    const W = [255, 255, 255];
    const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    const M0 = N.map((v, i) => v - W[i]);
    const M1 = G.map((v, i) => v - W[i]);
    const m00 = dot(M0, M0);
    const m01 = dot(M0, M1);
    const m11 = dot(M1, M1);
    const det = m00 * m11 - m01 * m01;
    /** [navy, gold, white] weights of a pixel, summing to 1. */
    const weights = (r, g, b) => {
      const d = [r - 255, g - 255, b - 255];
      const p = dot(M0, d);
      const q = dot(M1, d);
      let a = Math.max(0, (m11 * p - m01 * q) / det);
      let c = Math.max(0, (m00 * q - m01 * p) / det);
      const s = a + c;
      if (s > 1) {
        a /= s;
        c /= s;
      }
      return [a, c, 1 - a - c];
    };

    const img = new Image();
    img.src = src;
    await img.decode();
    const canvas = (w, h) => {
      const c = new OffscreenCanvas(w, h);
      return [c, c.getContext("2d", { willReadFrequently: true })];
    };
    const [c0, x0] = canvas(img.width, img.height);
    x0.drawImage(img, 0, 0);

    const bbox = (ctx, w, h, fromX = 0, toX = w) => {
      const d = ctx.getImageData(0, 0, w, h).data;
      let minX = w, minY = h, maxX = -1, maxY = -1;
      for (let y = 0; y < h; y++)
        for (let x = fromX; x < toX; x++)
          if (d[(y * w + x) * 4 + 3] > 8) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
      return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
    };
    const crop = (src, b) => {
      const [c, x] = canvas(b.w, b.h);
      x.drawImage(src, b.x, b.y, b.w, b.h, 0, 0, b.w, b.h);
      return c;
    };

    const fb = bbox(x0, img.width, img.height);
    const full = crop(c0, fb);
    const fctx = full.getContext("2d", { willReadFrequently: true });
    const sx = split - fb.x;
    const mark = crop(full, bbox(fctx, full.width, full.height, 0, sx));
    const word = crop(full, bbox(fctx, full.width, full.height, sx, full.width));

    /** Upscale, then pull soft edges back to ~1 px (flat-colour logo). */
    const upscaleSharp = (src) => {
      const [c, x] = canvas(src.width * up, src.height * up);
      x.imageSmoothingEnabled = true;
      x.imageSmoothingQuality = "high";
      x.drawImage(src, 0, 0, c.width, c.height);
      const id = x.getImageData(0, 0, c.width, c.height);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        let t = d[i + 3] / 255;
        t = Math.min(1, Math.max(0, (t - 0.5) * 2.6 + 0.5));
        t = t * t * (3 - 2 * t);
        d[i + 3] = Math.round(t * 255);
        if (t === 0) continue;
        const w = weights(d[i], d[i + 1], d[i + 2]).map((v) => v ** 3);
        const s = w[0] + w[1] + w[2] || 1;
        for (let k = 0; k < 3; k++)
          d[i + k] = Math.round((w[0] * N[k] + w[1] * G[k] + w[2] * W[k]) / s);
      }
      x.putImageData(id, 0, 0);
      return c;
    };

    const variant = (src, kind) => {
      const [c, x] = canvas(src.width, src.height);
      x.drawImage(src, 0, 0);
      if (kind === "color") return c;
      const id = x.getImageData(0, 0, c.width, c.height);
      const d = id.data;
      const mono = { "mono-white": W, "mono-navy": N, "mono-black": [0, 0, 0] }[kind];
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] === 0) continue;
        const [a, g, w] = weights(d[i], d[i + 1], d[i + 2]);
        if (mono) {
          d[i] = mono[0];
          d[i + 1] = mono[1];
          d[i + 2] = mono[2];
          d[i + 3] = Math.round(d[i + 3] * (a + g));
        } else {
          // reverse: navy → white, white → navy, gold stays gold
          for (let k = 0; k < 3; k++) d[i + k] = Math.round(a * W[k] + g * G[k] + w * N[k]);
        }
      }
      x.putImageData(id, 0, 0);
      return c;
    };

    const b64 = async (c) => {
      const buf = new Uint8Array(await (await c.convertToBlob({ type: "image/png" })).arrayBuffer());
      let s = "";
      for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      return btoa(s);
    };

    const markHi = upscaleSharp(mark);
    const kinds = ["color", "reverse", "mono-white", "mono-navy", "mono-black"];
    const out = {};
    for (const [name, base] of [["logo", full], ["mark", markHi], ["wordmark", word]]) {
      for (const k of kinds) {
        const v = variant(base, k);
        out[`${name}-${k}`] = { w: v.width, h: v.height, data: await b64(v) };
      }
    }
    return out;
  },
  { src: `data:image/png;base64,${master.toString("base64")}`, split: SPLIT_X, up: UPSCALE },
);

const dim = {};
for (const [key, { w, h, data }] of Object.entries(prepared)) {
  mem.set(key, Buffer.from(data, "base64"));
  dim[key] = { w, h };
}

// ── 2. Render helper ────────────────────────────────────────────────────
async function render(rel, w, h, body, { transparent = false, fullPage = false } = {}) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>
      *{box-sizing:border-box;margin:0;padding:0}
      html,body{width:${w}px;${fullPage ? "" : `height:${h}px;overflow:hidden;`}background:transparent}
      body{font-family:${FONT};-webkit-font-smoothing:antialiased}
      img{display:block}
    </style></head><body>${body}</body></html>`,
  );
  await page.evaluate(async () => {
    await Promise.all([...document.images].map((i) => i.decode()));
    await document.fonts.ready;
  });
  const buf = await page.screenshot({
    type: "png",
    omitBackground: transparent,
    ...(fullPage ? { fullPage: true } : { clip: { x: 0, y: 0, width: w, height: h } }),
  });
  if (rel) await save(rel, buf);
  return buf;
}

/** Square tile with the swan mark centred. */
const tile = ({ size, bg = "transparent", radius = 0, scale, kind = "color" }) => {
  const s = Math.round(size * scale);
  return `<div style="width:${size}px;height:${size}px;background:${bg};border-radius:${radius}px;display:flex;align-items:center;justify-content:center">
    <img src="${url(`mark-${kind}`)}" style="width:${s}px;height:${s}px;object-fit:contain"></div>`;
};
/** Image fitted to a width, aspect kept. */
const fitW = (key, width) =>
  `<img src="${url(key)}" style="width:${width}px;height:${Math.round((width * dim[key].h) / dim[key].w)}px">`;
const fitH = (key, height) =>
  `<img src="${url(key)}" style="height:${height}px;width:${Math.round((height * dim[key].w) / dim[key].h)}px">`;

// ── 3. Logo files ───────────────────────────────────────────────────────
const KINDS = ["color", "reverse", "mono-white", "mono-navy", "mono-black"];
for (const k of KINDS) {
  const suffix = k === "color" ? "" : `-${k}`;
  await save(`public/brand/logo/daydreams-news-logo${suffix}.png`, mem.get(`logo-${k}`));
  await save(`public/brand/mark/daydreams-news-mark${suffix}.png`, mem.get(`mark-${k}`));
}
for (const k of ["color", "reverse"]) {
  const suffix = k === "color" ? "" : `-${k}`;
  await save(`public/brand/logo/daydreams-news-wordmark${suffix}.png`, mem.get(`wordmark-${k}`));
  // Email / newsletter widths
  for (const w of [1200, 600, 300]) {
    const key = `logo-${k}`;
    await render(`public/brand/logo/daydreams-news-logo${suffix}-${w}w.png`, w, Math.round((w * dim[key].h) / dim[key].w), fitW(key, w), { transparent: true });
  }
  // Stacked lockup: swan above the wordmark (square-ish spaces, organisation logo)
  const wordW = dim[`wordmark-${k}`].w;
  const wordH = dim[`wordmark-${k}`].h;
  const markH = 600;
  const markW = Math.round((markH * dim[`mark-${k}`].w) / dim[`mark-${k}`].h);
  const gap = 40;
  const sw = Math.max(wordW, markW);
  const sh = markH + gap + wordH;
  const stacked = await render(
    `public/brand/logo/daydreams-news-logo-stacked${suffix}.png`,
    sw,
    sh,
    `<div style="display:flex;flex-direction:column;align-items:center;gap:${gap}px">${fitH(`mark-${k}`, markH)}${fitW(`wordmark-${k}`, wordW)}</div>`,
    { transparent: true },
  );
  mem.set(`stacked-${k}`, stacked);
  dim[`stacked-${k}`] = { w: sw, h: sh };
}

// ── 4. Favicon, app icons, PWA icons ────────────────────────────────────
const icoSizes = [16, 32, 48];
const icoPngs = [];
for (const size of icoSizes) {
  const radius = Math.round(size * 0.2);
  const scale = size === 16 ? 0.96 : size === 32 ? 0.9 : 0.86;
  const buf = await render(null, size, size, tile({ size, bg: "#fff", radius, scale }), { transparent: true });
  icoPngs.push(buf);
  await save(`public/brand/icons/favicon-${size}.png`, buf);
}
await save("app/favicon.ico", buildIco(icoSizes, icoPngs));

await render("app/icon.png", 192, 192, tile({ size: 192, bg: "#fff", radius: 42, scale: 0.8 }), { transparent: true });
await render("app/apple-icon.png", 180, 180, tile({ size: 180, bg: "#fff", scale: 0.72 }));

for (const size of [192, 512]) {
  await render(`public/brand/icons/icon-${size}.png`, size, size, tile({ size, bg: "#fff", radius: Math.round(size * 0.22), scale: 0.8 }), { transparent: true });
  // Maskable: full bleed, content inside the 80 % safe circle.
  await render(`public/brand/icons/icon-maskable-${size}.png`, size, size, tile({ size, bg: "#fff", scale: 0.56 }));
}
// Android themed icon (monochrome purpose): white shape on transparent.
await render("public/brand/icons/icon-monochrome-512.png", 512, 512, tile({ size: 512, scale: 0.56, kind: "mono-white" }), { transparent: true });

// ── 5. SEO: publisher / organisation / web-story logos ──────────────────
{
  const h = 60;
  const w = Math.round((h * dim["logo-color"].w) / dim["logo-color"].h);
  await render("public/brand/seo/publisher-logo-60h.png", w, h, fitH("logo-color", h), { transparent: true });
}
await render(
  "public/brand/seo/organization-logo-512.png",
  512,
  512,
  `<div style="width:512px;height:512px;background:#fff;display:flex;align-items:center;justify-content:center">${fitW("stacked-color", 430)}</div>`,
);
await render("public/brand/seo/web-story-publisher-logo-192.png", 192, 192, tile({ size: 192, bg: "#fff", scale: 0.72 }));

// ── 6. Open Graph / Twitter card ────────────────────────────────────────
const sun = (w, h, size, bottom, alpha = 0.3) =>
  `<div style="position:absolute;left:${w / 2 - size / 2}px;top:${h - size / 2 + bottom}px;width:${size}px;height:${size}px;border-radius:50%;
    background:radial-gradient(circle, rgba(250,183,54,${alpha}) 0%, rgba(250,183,54,${alpha / 3}) 42%, rgba(250,183,54,0) 70%)"></div>`;

const ogBody = `
  <div style="position:relative;width:1200px;height:630px;overflow:hidden;background:linear-gradient(180deg,#fff 0%,${CREAM} 100%)">
    ${sun(1200, 630, 1100, 40, 0.34)}
    <div style="position:absolute;inset:0 0 84px 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px">
      ${fitW("logo-color", 880)}
      <p style="font-size:46px;font-weight:700;line-height:1.3;color:${NAVY}">${tagline}</p>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:84px;background:${NAVY};display:flex;align-items:center;justify-content:center;gap:22px;color:#fff;font-size:30px;font-weight:600;line-height:1.3">
      <span>ताज़ा हिंदी समाचार</span><span style="color:${GOLD}">•</span><span>देश</span><span style="color:${GOLD}">•</span><span>राज्य</span><span style="color:${GOLD}">•</span><span>शहर</span>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:84px;height:6px;background:${GOLD}"></div>
  </div>`;
const og = await render("app/opengraph-image.png", 1200, 630, ogBody);
await save("app/twitter-image.png", og);
await save("public/brand/social/og-default-1200x630.png", og);

// ── 7. Social profile images and covers ─────────────────────────────────
await render("public/brand/social/avatar-800.png", 800, 800, tile({ size: 800, bg: "#fff", scale: 0.62 }));
await render(
  "public/brand/social/avatar-800-navy.png",
  800,
  800,
  `<div style="position:relative;width:800px;height:800px;overflow:hidden;background:radial-gradient(circle at 50% 50%, ${NAVY} 0%, ${NAVY_DEEP} 100%)">
     <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${tile({ size: 800, scale: 0.62, kind: "reverse" })}</div></div>`,
);

const cover = (w, h, logoW, taglinePx, offsetY = 0) => `
  <div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;background:linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)">
    ${sun(w, h, Math.max(w, h) * 1.1, Math.round(h * 0.18), 0.32)}
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${Math.round(taglinePx * 0.7)}px;transform:translateY(${offsetY}px)">
      ${fitW("logo-reverse", logoW)}
      ${taglinePx ? `<p style="font-size:${taglinePx}px;font-weight:700;line-height:1.3;color:${GOLD}">${tagline}</p>` : ""}
    </div>
  </div>`;
await render("public/brand/social/x-header-1500x500.png", 1500, 500, cover(1500, 500, 760, 36, -20));
await render("public/brand/social/facebook-cover-1640x624.png", 1640, 624, cover(1640, 624, 820, 40, -10));
await render("public/brand/social/youtube-banner-2560x1440.png", 2560, 1440, cover(2560, 1440, 1150, 54));
await render("public/brand/social/linkedin-cover-1128x191.png", 1128, 191, cover(1128, 191, 470, 22));

// ── 8. Contact sheet for review ─────────────────────────────────────────
const checker = "background:repeating-conic-gradient(#e9e9ee 0% 25%, #fff 0% 50%) 0 0/16px 16px";
const dark = `background:${NAVY_DEEP}`;
const cell = (rel, bg, maxW = 340, maxH = 200) =>
  `<figure style="display:flex;flex-direction:column;gap:6px;width:${maxW + 24}px">
     <div style="${bg};border:1px solid #ddd;border-radius:8px;padding:12px;height:${maxH + 24}px;display:flex;align-items:center;justify-content:center">
       <img src="${url(rel)}" style="max-width:${maxW}px;max-height:${maxH}px;width:auto;height:auto;object-fit:contain"></div>
     <figcaption style="font:12px/1.4 system-ui;color:#444;word-break:break-all">${rel.replace(/^public\//, "")}</figcaption></figure>`;
const darkKinds = (rel) => /reverse|mono-white|monochrome|avatar-800-navy/.test(rel);
const items = [...files.keys()].filter((r) => r.endsWith(".png") && !/favicon-\d+|-\d+w\.png/.test(r));
await render(
  "docs/brand/preview.png",
  1600,
  1000,
  `<div style="padding:32px;background:#fafafa;font-family:system-ui">
     <h1 style="font:700 28px system-ui;color:${NAVY};margin-bottom:20px">Daydreams News — brand assets</h1>
     <div style="display:flex;flex-wrap:wrap;gap:20px">${items.map((r) => cell(r, darkKinds(r) ? dark : checker)).join("")}
       ${icoSizes.map((s) => cell(`public/brand/icons/favicon-${s}.png`, checker, 120, 120)).join("")}</div></div>`,
  { fullPage: true },
);

await browser.close();
console.log(`wrote ${files.size} files`);
for (const [rel, buf] of files) console.log(`${(buf.length / 1024).toFixed(1).padStart(8)} KB  ${rel}`);

/** ICO container with PNG-compressed entries (supported by every current browser). */
function buildIco(sizes, pngs) {
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((s, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(s >= 256 ? 0 : s, e);
    header.writeUInt8(s >= 256 ? 0 : s, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(pngs[i].length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += pngs[i].length;
  });
  return Buffer.concat([header, ...pngs]);
}
