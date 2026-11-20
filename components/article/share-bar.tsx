"use client";

import { useState } from "react";

import {
  Copy01Icon,
  Facebook02Icon,
  HugeiconsIcon,
  Linkedin02Icon,
  NewTwitterIcon,
  Share01Icon,
  WhatsappIcon,
} from "@/components/icons";
import { t } from "@/lib/i18n";
import { shareUrl } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * ShareBar — DESIGN.md §3, FR-A6.
 *
 * WhatsApp, Facebook, X, LinkedIn and copy-link, plus the native Web Share
 * sheet on mobile (falling back to WhatsApp when the browser has no
 * `navigator.share`). Every shared URL carries
 * `utm_source=<network>&utm_medium=social`.
 *
 * The absolute URL comes from the server, so nothing has to be computed in an
 * effect after mount.
 */

const NETWORKS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    color: "#25D366",
    icon: WhatsappIcon,
    url: (link: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${link}`)}`,
  },
  {
    key: "facebook",
    label: "Facebook",
    color: "#1877F2",
    icon: Facebook02Icon,
    url: (link: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
  },
  {
    key: "x",
    label: "X",
    color: "#111111",
    icon: NewTwitterIcon,
    url: (link: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(title)}`,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
    icon: Linkedin02Icon,
    url: (link: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
  },
] as const;

function useCopy(url: string) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl(url, "copy"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return { copied, copy };
}

function nativeShare(url: string, title: string) {
  if (typeof navigator !== "undefined" && "share" in navigator) {
    void navigator.share({ title, url: shareUrl(url, "native") }).catch(() => {
      // The reader dismissed the sheet — nothing to do.
    });
    return;
  }
  window.open(
    NETWORKS[0].url(shareUrl(url, "whatsapp"), title),
    "_blank",
    "noopener",
  );
}

export function ShareBar({
  url,
  title,
  className,
}: {
  /** Absolute URL of the story. */
  url: string;
  title: string;
  className?: string;
}) {
  const { copied, copy } = useCopy(url);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => nativeShare(url, title)}
        aria-label={t.article.share}
        className="grid size-[38px] place-items-center rounded-full bg-brand text-white md:hidden"
      >
        <HugeiconsIcon icon={Share01Icon} size={18} strokeWidth={2} />
      </button>

      {NETWORKS.map((network) => (
        <a
          key={network.key}
          href={network.url(shareUrl(url, network.key), title)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.article.share}: ${network.label}`}
          className="hidden size-[38px] place-items-center rounded-full text-white md:grid"
          style={{ backgroundColor: network.color }}
        >
          <HugeiconsIcon icon={network.icon} size={18} strokeWidth={2} />
        </a>
      ))}

      <button
        type="button"
        onClick={copy}
        aria-label={copied ? t.article.copied : t.article.copyLink}
        className="hidden size-[38px] place-items-center rounded-full bg-[#888] text-white md:grid"
      >
        <HugeiconsIcon icon={Copy01Icon} size={18} strokeWidth={2} />
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? t.article.copied : ""}
      </span>
    </div>
  );
}

/** Fixed bottom share bar on mobile article pages — DESIGN.md §6. */
export function MobileShareBar({ url, title }: { url: string; title: string }) {
  const { copied, copy } = useCopy(url);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[repeat(4,1fr)_1.4fr] gap-2 border-t border-line bg-white px-3.5 pb-[max(14px,env(safe-area-inset-bottom))] pt-2.5 lg:hidden">
      {NETWORKS.filter((network) => network.key !== "whatsapp").map((network) => (
        <a
          key={network.key}
          href={network.url(shareUrl(url, network.key), title)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.article.share}: ${network.label}`}
          className="grid h-10 place-items-center rounded-[20px] text-white"
          style={{ backgroundColor: network.color }}
        >
          <HugeiconsIcon icon={network.icon} size={18} strokeWidth={2} />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? t.article.copied : t.article.copyLink}
        className="grid h-10 place-items-center rounded-[20px] bg-[#888] text-white"
      >
        <HugeiconsIcon icon={Copy01Icon} size={18} strokeWidth={2} />
      </button>
      <a
        href={NETWORKS[0].url(shareUrl(url, "whatsapp"), title)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 items-center justify-center gap-1.5 rounded-[20px] bg-[#25D366] text-[14px] font-bold text-white"
      >
        <HugeiconsIcon icon={WhatsappIcon} size={18} strokeWidth={2} />
        WhatsApp
      </a>
    </div>
  );
}
