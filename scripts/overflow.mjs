/**
 * Finds elements that stick out past the viewport, so horizontal scroll can be
 * traced to the exact node.
 *
 *   ROUTE=/ node scripts/overflow.mjs 1024
 */
import { chromium } from "@playwright/test";

const width = Number(process.argv[2] ?? 360);
const routePath = process.env.ROUTE ?? "/";
const base = process.env.BASE_URL ?? "http://localhost:3200";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height: 900 },
  locale: "hi-IN",
});
await page.goto(`${base}${routePath}`, { waitUntil: "load" });
await page.waitForTimeout(400);

const offenders = await page.evaluate((viewportWidth) => {
  const out = [];
  for (const element of document.querySelectorAll("*")) {
    const rect = element.getBoundingClientRect();
    if (rect.width === 0) continue;
    if (rect.right > viewportWidth + 1 || rect.left < -1) {
      out.push({
        tag: element.tagName.toLowerCase(),
        cls: (element.getAttribute("class") ?? "").slice(0, 90),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
      });
    }
  }
  return out.slice(0, 20);
}, width);

console.log(`${routePath} @${width}px`);
console.table(offenders);
await browser.close();
