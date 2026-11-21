/**
 * Hydration / console-error check.
 *
 *   BASE_URL=http://localhost:3000 ROUTES=/,/search node scripts/hydration-check.mjs
 *
 * Loads each route twice (390 and 1440) with a fresh browser profile — no
 * stored consent, so the cookie banner is in its "must appear" state, which is
 * where server HTML and client render are most likely to disagree. Fails with
 * a non-zero exit code on any console error, page error or hydration warning.
 *
 * For panel routes, set `AS_USER` to a demo account id (`u-desk`, `u-editor`,
 * …). The session cookie is signed here with `ADMIN_SESSION_SECRET` instead of
 * posting the login form, so checking every screen does not eat into the
 * sign-in rate limit.
 *
 * Dev-only tooling; not shipped.
 */
import { createHmac } from "node:crypto";
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const routes = (process.env.ROUTES ?? "/").split(",");
const asUser = process.env.AS_USER;
const secret = process.env.ADMIN_SESSION_SECRET;

if (asUser && (!secret || secret.length < 32)) {
  console.error("AS_USER needs ADMIN_SESSION_SECRET (32+ chars) to sign with.");
  process.exit(1);
}

function sessionCookie(userId) {
  const payload = `${userId}.${Date.now() + 3_600_000}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return {
    name: "ks_admin_session",
    value: `${payload}.${signature}`,
    url: base,
    httpOnly: true,
    sameSite: "Lax",
  };
}

const browser = await chromium.launch();
let problemCount = 0;

for (const route of routes) {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: width < 768 ? 844 : 1000 },
      locale: "hi-IN",
      timezoneId: "Asia/Kolkata",
    });
    if (asUser) await context.addCookies([sessionCookie(asUser)]);

    const page = await context.newPage();
    const problems = [];
    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error" || /hydrat/i.test(text)) problems.push(text);
    });
    page.on("pageerror", (error) => problems.push(String(error)));

    // Generous timeout: in dev the first request to a route compiles it.
    await page.goto(`${base}${route}`, { waitUntil: "load", timeout: 120_000 });
    await page.waitForTimeout(2500);

    const banner = await page
      .locator('[role="dialog"][aria-modal="false"]')
      .count();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    problemCount += problems.length;

    console.log(
      `${route} @${width}px → banner ${banner} · overflow ${overflow}px` +
        (problems.length
          ? `\n   x ${problems.slice(0, 4).join("\n   x ")}`
          : " · clean"),
    );
    await context.close();
  }
}

await browser.close();
console.log(
  problemCount ? `\n${problemCount} problem(s)` : "\nno console/hydration problems",
);
process.exit(problemCount ? 1 : 0);
