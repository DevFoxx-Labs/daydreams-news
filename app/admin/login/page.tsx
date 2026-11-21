import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { Suspense } from "react";

import { AdminButton, AdminInput } from "@/components/admin/ui/primitives";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionValue,
  currentUser,
  sessionConfigured,
} from "@/lib/admin/session";
import { devUsersEnabled, listDemoAccounts, verifyCredentials } from "@/lib/admin/users";
import { site } from "@/lib/site";

/**
 * Newsroom sign-in.
 *
 * Threat model: a public, unauthenticated write.
 * · credential stuffing → 10 attempts / 10 min per IP (the form refuses, 429-equivalent)
 * · user enumeration → one generic message, and the password check takes the
 *   same time whether or not the account exists (`verifyCredentials`)
 * · session forgery → HMAC-signed, httpOnly, sameSite=lax, 12-hour cookie
 * · misconfiguration → without `ADMIN_SESSION_SECRET` sign-in is refused
 *   outright rather than left open (fail closed)
 *
 * MFA is **not** implemented yet and privileged roles require it — tracked as a
 * 🔴 gap in `docs/known-gaps.md`.
 */

export const metadata: Metadata = {
  title: "न्यूज़रूम लॉगिन",
  robots: { index: false, follow: false },
};

async function signIn(formData: FormData) {
  "use server";

  const ip = clientIp(await headers());
  const limit = rateLimit(`admin-login:${ip}`, 10, 600);
  if (!limit.ok) redirect("/admin/login?error=rate");

  const email = String(formData.get("email") ?? "").slice(0, 254);
  const password = String(formData.get("password") ?? "").slice(0, 200);

  const user = verifyCredentials(email, password);
  if (!user) redirect("/admin/login?error=1");

  const value = createSessionValue(user.id);
  if (!value) redirect("/admin/login?error=config");

  const store = await cookies();
  store.set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/admin");
}

function ErrorNote({ code }: { code?: string }) {
  if (!code) return null;
  const message =
    code === "rate"
      ? "बहुत ज़्यादा कोशिशें। कुछ देर बाद दोबारा कोशिश करें।"
      : code === "config"
        ? "सर्वर पर ADMIN_SESSION_SECRET सेट नहीं है, इसलिए लॉगिन बंद है।"
        : "ईमेल या पासवर्ड ग़लत है।";
  return (
    <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
      {message}
    </p>
  );
}

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Someone who already has a valid session has no business on this page.
  // The check lives here, inside the <Suspense> boundary, rather than in the
  // page body: reading the session is request-specific work, and keeping it
  // behind the boundary lets the card, logo and heading prerender.
  if (await currentUser()) redirect("/admin");

  const query = await searchParams;
  const error = typeof query.error === "string" ? query.error : undefined;
  const ready = sessionConfigured() && devUsersEnabled();

  return (
    <>
      <ErrorNote code={error} />

      {ready ? (
        <form action={signIn} className="mt-4 space-y-3">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              ईमेल
            </label>
            <AdminInput
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              पासवर्ड
            </label>
            <AdminInput
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={200}
            />
          </div>
          <AdminButton type="submit" variant="brand" size="lg" className="w-full">
            लॉग इन
          </AdminButton>
        </form>
      ) : (
        <div className="mt-4 rounded-md border border-border bg-muted/40 p-3 text-sm leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">पैनल अभी बंद है।</p>
          <p className="mt-1">
            चलाने के लिए <code className="font-ui">ADMIN_SESSION_SECRET</code> (32+ अक्षर) और{" "}
            <code className="font-ui">ADMIN_DEV_PASSWORD</code> (8+ अक्षर) सेट करें —{" "}
            <code className="font-ui">.env.example</code> देखें। कोई डिफ़ॉल्ट पासवर्ड
            नहीं रखा गया है।
          </p>
        </div>
      )}

      {ready ? (
        <details className="mt-5 rounded-md border border-border bg-muted/30 p-3">
          <summary className="cursor-pointer text-xs font-semibold text-muted-foreground">
            डेमो खाते (हर रोल का डैशबोर्ड देखने के लिए)
          </summary>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {listDemoAccounts().map((account) => (
              <li key={account.email} className="flex justify-between gap-3">
                <span className="font-ui">{account.email}</span>
                <span>{account.name}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-muted-foreground/80">
            पासवर्ड: <code className="font-ui">ADMIN_DEV_PASSWORD</code> की वैल्यू।
            CMS आने पर ये खाते हट जाएंगे।
          </p>
        </details>
      ) : null}
    </>
  );
}

export default function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[380px]">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-[8px] bg-brand text-[24px] font-extrabold leading-none text-white">
            <span className="translate-y-[-1px]">{site.mark}</span>
          </span>
          <div>
            <p className="text-lg font-extrabold leading-tight text-foreground">
              {site.name}
            </p>
            <p className="text-xs text-muted-foreground">न्यूज़रूम पैनल</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h1 className="text-xl font-semibold text-foreground">लॉग इन करें</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            सिर्फ़ न्यूज़रूम और प्रशासन टीम के लिए।
          </p>

          <Suspense
            fallback={<div className="mt-4 h-40 animate-pulse rounded-md bg-muted" />}
          >
            <LoginForm searchParams={searchParams} />
          </Suspense>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          इस पैनल की हर कार्रवाई ऑडिट लॉग में दर्ज होती है।
        </p>
      </div>
    </main>
  );
}
