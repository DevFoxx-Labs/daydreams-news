"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";

/**
 * Route error boundary. The reader sees a generic message — never a stack
 * trace or an internal detail (security rule: generic errors in production).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is enough to find the server-side log entry.
    console.error("page error", error.digest);
  }, [error]);

  return (
    <main className="flex min-h-[60dvh] items-center justify-center px-4">
      <div className="max-w-[480px] text-center">
        <h1 className="mb-2 text-[24px] font-extrabold">{t.pages.errorTitle}</h1>
        <p className="mb-5 text-[16px] leading-[1.7] text-ink-2">
          {t.pages.errorBody}
        </p>
        <Button variant="brand" size="lg" onClick={reset}>
          {t.pages.retry}
        </Button>
      </div>
    </main>
  );
}
