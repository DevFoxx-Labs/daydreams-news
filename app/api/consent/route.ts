import {
  appendConsentRecords,
  validateConsentInput,
} from "@/lib/consent/ledger.server";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/consent — writes one append-only ledger row per purpose.
 *
 * Threat model: a public, unauthenticated write. Abuse cases and defences —
 * · flooding the ledger → 20 writes / 10 min per IP (429)
 * · oversized or junk payload → 4 KB cap + allow-list validation (400)
 * · forged purposes/statuses → only known enum values are accepted
 * · PII leakage → only the anonymous visitor id, IP and user-agent are kept,
 *   which the DPDP Rules require for proof of consent; nothing is logged to
 *   stdout.
 */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`consent:${ip}`, 20, 600);
  if (!limit.ok) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const raw = await request.text();
  if (raw.length > 4096) {
    return Response.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const input = validateConsentInput(parsed);
  if (!input) {
    return Response.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  const rows = await appendConsentRecords({
    ...input,
    ipAddress: ip,
    userAgent: request.headers.get("user-agent"),
  });

  return Response.json({ ok: true, recorded: rows.length }, { status: 201 });
}
