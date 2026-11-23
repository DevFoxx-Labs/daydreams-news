/**
 * Screenshot helper for comparing the built pages with `docs/reference/*.png`.
 *
 *   node scripts/screenshot.mjs <path> <name> [widths]
 *
 * Writes to `.screens/<name>-<width>.png`. Dev-only tooling; not shipped.
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

// Route comes from ROUTE= so Git Bash on Windows can't mangle a leading "/".
const [, , name = "home", widthsArg = "390,768,1024,1440"] = process.argv;
const routePath = process.env.ROUTE ?? "/";
const widths = widthsArg.split(",").map(Number);
const base = process.env.BASE_URL ?? "http://localhost:3100";

await mkdir(".screens", { recursive: true });
const browser = await chromium.launch();

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 768 ? 844 : 1000 },
    deviceScaleFactor: 1,
    locale: "hi-IN",
    timezoneId: "Asia/Kolkata",
  });
  // CONSENT=1 pre-sets a "rejected everything" choice so the banner doesn't
  // cover the page being compared with the reference.
  if (process.env.CONSENT === "1") {
    await context.addCookies([
      {
        name: "dn_consent",
        value: encodeURIComponent(
          JSON.stringify({
            necessary: true,
            analytics: false,
            ads: false,
            personalisation: false,
          }),
        ),
        url: base,
      },
    ]);
  }

  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto(`${base}${routePath}`, { waitUntil: "load" });
  await page.waitForTimeout(600);

  // Horizontal-scroll check (acceptance: none at 360px).
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );

  await page.screenshot({
    path: `.screens/${name}-${width}.png`,
    fullPage: process.env.FOLD !== "1",
  });
  console.log(
    `${name} @${width}px → overflow ${overflow}px` +
      (errors.length ? `\n  console errors: ${errors.slice(0, 5).join(" | ")}` : ""),
  );
  await context.close();
}

await browser.close();
