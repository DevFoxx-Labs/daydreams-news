import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/lib/admin/session";
import { site } from "@/lib/site";

/**
 * POST /api/admin/logout — clears the session cookie.
 *
 * POST, not GET: a logout link that works as a GET can be triggered from an
 * <img> on another site. The cookie is httpOnly, so clearing it has to happen
 * here rather than in the browser.
 */
export async function POST(request: Request) {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  const target = new URL("/admin/login", request.url);
  // 303 so the browser follows with GET after the POST.
  return Response.redirect(target, 303);
}

export async function GET() {
  return Response.json(
    { ok: false, error: "method_not_allowed", site: site.nameLatin },
    { status: 405, headers: { Allow: "POST" } },
  );
}
