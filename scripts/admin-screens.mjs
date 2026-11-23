/**
 * Signs into the newsroom panel and screenshots each role's dashboard.
 *
 *   BASE_URL=http://localhost:3200 node scripts/admin-screens.mjs [widths]
 *
 * Dev tooling. Credentials come from the environment, never hard-coded.
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3200";
const password = process.env.ADMIN_DEV_PASSWORD;
const widths = (process.argv[2] ?? "1440").split(",").map(Number);

if (!password) {
  console.error("ADMIN_DEV_PASSWORD is not set — nothing to sign in with.");
  process.exit(1);
}

const ACCOUNTS = [
  { email: "desk@daydreamsnews.test", name: "desk" },
  { email: "stringer@daydreamsnews.test", name: "stringer" },
  { email: "bureau@daydreamsnews.test", name: "bureau" },
  { email: "grievance@daydreamsnews.test", name: "grievance" },
  { email: "editor@daydreamsnews.test", name: "editor" },
];

const EXTRA_ROUTES = [
  { path: "/admin/stories", name: "stories", account: "desk@daydreamsnews.test" },
  { path: "/admin/coverage", name: "coverage", account: "bureau@daydreamsnews.test" },
  { path: "/admin/earnings", name: "earnings", account: "stringer@daydreamsnews.test" },
];

await mkdir(".screens", { recursive: true });
const browser = await chromium.launch();

async function signIn(context, email) {
  const page = await context.newPage();
  await page.goto(`${base}/admin/login`, { waitUntil: "load" });
  await page.fill("#email", email);
  await page.fill("#password", password);
  await Promise.all([
    page.waitForURL(`${base}/admin`, { timeout: 20_000 }),
    page.click('button[type="submit"]'),
  ]);
  return page;
}

for (const width of widths) {
  for (const account of ACCOUNTS) {
    const context = await browser.newContext({
      viewport: { width, height: width < 768 ? 844 : 1000 },
      locale: "hi-IN",
      timezoneId: "Asia/Kolkata",
    });
    const errors = [];
    context.on("weberror", (error) => errors.push(String(error.error())));

    const page = await signIn(context, account.email);
    await page.waitForTimeout(700);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    await page.screenshot({
      path: `.screens/admin-${account.name}-${width}.png`,
      fullPage: true,
    });
    console.log(
      `admin/${account.name} @${width}px → overflow ${overflow}px` +
        (errors.length ? ` | errors: ${errors.slice(0, 3).join(" · ")}` : ""),
    );

    for (const route of EXTRA_ROUTES.filter((r) => r.account === account.email)) {
      await page.goto(`${base}${route.path}`, { waitUntil: "load" });
      await page.waitForTimeout(500);
      const routeOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      await page.screenshot({
        path: `.screens/admin-${route.name}-${width}.png`,
        fullPage: true,
      });
      console.log(`admin${route.path} @${width}px → overflow ${routeOverflow}px`);
    }

    await context.close();
  }
}

await browser.close();
