"use client";

import { useEffect } from "react";

import { useClientStore } from "@/lib/client-store";
import { t } from "@/lib/i18n";
import { fontStepStore, setFontStep } from "@/lib/preference-stores";
import { cn } from "@/lib/utils";

/**
 * Font-size control — FR-A5. Three steps, saved in localStorage.
 * Sets `--article-scale` on <html>, which `t-body` multiplies into its size,
 * so only the article text changes — never the chrome.
 */

const SCALES = [1, 1.12, 1.26];

export function FontSizeControl({ className }: { className?: string }) {
  const step = useClientStore(fontStepStore);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--article-scale",
      String(SCALES[step]),
    );
    return () => {
      document.documentElement.style.removeProperty("--article-scale");
    };
  }, [step]);

  function change(next: number) {
    setFontStep(Math.min(SCALES.length - 1, Math.max(0, next)));
  }

  return (
    <div
      className={cn(
        "flex h-[38px] items-center gap-1 rounded-[20px] border border-line px-2",
        className,
      )}
      role="group"
      aria-label={t.article.fontSize}
    >
      <button
        type="button"
        onClick={() => change(step - 1)}
        disabled={step === 0}
        aria-label={t.article.fontSmaller}
        className="grid size-8 place-items-center text-[14px] font-semibold text-ink-2 disabled:opacity-40"
      >
        {t.article.fontSmaller}
      </button>
      <button
        type="button"
        onClick={() => change(step + 1)}
        disabled={step === SCALES.length - 1}
        aria-label={t.article.fontLarger}
        className="grid size-8 place-items-center text-[16px] font-semibold text-ink-2 disabled:opacity-40"
      >
        {t.article.fontLarger}
      </button>
    </div>
  );
}
