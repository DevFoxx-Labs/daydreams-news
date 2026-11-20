"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft01Icon, HugeiconsIcon } from "@/components/icons";
import { t } from "@/lib/i18n";

/**
 * "←" in the mobile reading header (DESIGN.md §6). Falls back to the homepage
 * when the article was opened directly from search or a shared link.
 */
export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label={t.common.back}
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push("/");
      }}
      className="grid size-11 place-items-center text-ink"
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} size={22} strokeWidth={2} />
    </button>
  );
}
