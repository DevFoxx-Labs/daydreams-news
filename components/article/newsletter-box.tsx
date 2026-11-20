"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getVisitorId } from "@/lib/consent/client";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Newsletter signup — FR-E1, DESIGN.md §6 rail.
 *
 * Double opt-in. The consent checkbox is **unticked by default** and is
 * validated again on the server (`/api/newsletter`), so the HTML alone can
 * never be the gate (global rule §2).
 */
export function NewsletterBox({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!consent) {
      setError(t.newsletter.consentRequired);
      return;
    }

    setState("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, visitorId: getVisitorId() }),
      });
      if (response.status === 429) {
        setError(t.newsletter.rateLimited);
        setState("idle");
        return;
      }
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(
          payload?.error === "invalid_email"
            ? t.newsletter.invalidEmail
            : payload?.error === "consent_required"
              ? t.newsletter.consentRequired
              : t.newsletter.error,
        );
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError(t.newsletter.error);
      setState("idle");
    }
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className={cn(
        "rounded-[6px] border border-brand-line bg-brand-tint p-4",
        className,
      )}
    >
      <h2 id="newsletter-heading" className="text-[18px] font-extrabold lg:text-[19px]">
        {t.newsletter.title}
      </h2>
      <p className="my-1.5 text-[14.5px] leading-[1.5] text-ink-2">
        {t.newsletter.subtitle}
      </p>

      {state === "done" ? (
        <p role="status" className="text-[14.5px] font-semibold text-up">
          {t.newsletter.success}
        </p>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="flex">
            <label htmlFor="newsletter-email" className="sr-only">
              {t.newsletter.emailLabel}
            </label>
            <Input
              id="newsletter-email"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder={t.newsletter.emailPlaceholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-e-none border-e-0"
            />
            <Button
              type="submit"
              variant="brand"
              size="lg"
              disabled={state === "sending"}
              className="rounded-s-none"
            >
              {t.newsletter.submit}
            </Button>
          </div>

          <label className="mt-2.5 flex cursor-pointer items-start gap-2 text-[13px] leading-[1.5] text-ink-2">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[#C8102E]"
            />
            {t.newsletter.consent}
          </label>

          {error ? (
            <p role="alert" className="mt-2 text-[13.5px] font-semibold text-down">
              {error}
            </p>
          ) : null}
        </form>
      )}
    </section>
  );
}
