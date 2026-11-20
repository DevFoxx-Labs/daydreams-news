import { appendConsentRecords } from "@/lib/consent/ledger.server";
import { NOTICE_VERSION_STRING } from "@/lib/legal/notices";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/newsletter — double opt-in signup (FR-E1).
 *
 * Threat model: public write, costs money (email) and touches personal data.
 * · spam / list bombing → 5 / hour per IP (429)
 * · signing up without consent → the consent checkbox is validated **here**,
 *   not only in HTML (global rule §2)
 * · address harvesting → the response never reveals whether an address is
 *   already subscribed
 * · proof of consent → one ledger row per signup, with the notice version
 *
 * The address itself is not stored yet: no database and no email provider are
 * wired up (see docs/known-gaps.md). The endpoint validates, records consent
 * and returns the double-opt-in message so the flow can be tested end to end.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`newsletter:${ip}`, 5, 3600);
  if (!limit.ok) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const raw = await request.text();
  if (raw.length > 2048) {
    return Response.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  // Consent is required and is checked on the server.
  if (body.consent !== true) {
    return Response.json({ ok: false, error: "consent_required" }, { status: 400 });
  }

  const visitorId =
    typeof body.visitorId === "string" && /^[\w-]{8,64}$/.test(body.visitorId)
      ? body.visitorId
      : `anon-${Math.random().toString(36).slice(2, 12)}`;

  await appendConsentRecords({
    visitorId,
    userId: null,
    method: "checkbox",
    noticeVersion: NOTICE_VERSION_STRING,
    purposes: [{ purpose: "newsletter", status: "granted" }],
    ipAddress: ip,
    userAgent: request.headers.get("user-agent"),
  });

  // Same response whether or not the address is already on the list.
  return Response.json({ ok: true, doubleOptIn: true }, { status: 202 });
}
