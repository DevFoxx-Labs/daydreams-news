"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fill, t } from "@/lib/i18n";

/**
 * Data Principal rights request form — DPDP ss.11–14, global rule §7.
 * Free of charge, available without an account, and acknowledged with a
 * ticket number. Identity is verified by the Grievance Officer before
 * anything is disclosed or erased.
 */

const TYPES = [
  { value: "access", label: t.rights.access },
  { value: "correction", label: t.rights.correction },
  { value: "erasure", label: t.rights.erasure },
  { value: "nomination", label: t.rights.nomination },
  { value: "withdraw", label: t.rights.withdraw },
  { value: "grievance", label: t.rights.grievance },
] as const;

export function PrivacyRequestForm() {
  const [type, setType] = useState<string>("access");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [ticket, setTicket] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setState("sending");

    try {
      const response = await fetch("/api/privacy-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, email, details }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; ticket?: string; error?: string }
        | null;

      if (response.status === 429) {
        setError(t.newsletter.rateLimited);
        setState("idle");
        return;
      }
      if (!response.ok || !payload?.ok) {
        setError(
          payload?.error === "invalid_email"
            ? t.newsletter.invalidEmail
            : t.newsletter.error,
        );
        setState("idle");
        return;
      }

      setTicket(payload.ticket ?? null);
      setState("done");
    } catch {
      setError(t.newsletter.error);
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div
        role="status"
        className="rounded-[6px] border border-line bg-soft p-4 text-[15px] leading-[1.6]"
      >
        <p className="font-semibold text-up">
          {fill(t.rights.submitted, { hours: 48 })}
        </p>
        {ticket ? (
          <p className="mt-1 font-ui text-[14px] text-ink-2">
            Ticket: <b>{ticket}</b>
          </p>
        ) : null}
        <p className="mt-2 text-[14px] text-muted">{t.rights.boardNote}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <div>
        <label htmlFor="pr-type" className="mb-1 block text-[14px] font-semibold">
          {t.rights.requestType}
        </label>
        <select
          id="pr-type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="h-11 w-full rounded-[4px] border border-line bg-white px-3 text-[15px]"
        >
          {TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="pr-email" className="mb-1 block text-[14px] font-semibold">
          {t.rights.yourEmail}
        </label>
        <Input
          id="pr-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="pr-details" className="mb-1 block text-[14px] font-semibold">
          {t.rights.details}
        </label>
        <textarea
          id="pr-details"
          rows={4}
          maxLength={4000}
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          className="w-full rounded-[4px] border border-line bg-white p-3 text-[15px] leading-[1.6]"
        />
      </div>

      {error ? (
        <p role="alert" className="text-[14px] font-semibold text-down">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="brand" size="lg" disabled={state === "sending"}>
        {t.rights.submit}
      </Button>
      <p className="text-[13px] text-muted">{t.rights.boardNote}</p>
    </form>
  );
}
