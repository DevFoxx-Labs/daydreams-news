import Link from "next/link";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Logo — DESIGN.md §3. Brand square with the Devanagari mark, wordmark and
 * tagline. The name and mark come from `lib/site.ts` only, so renaming the
 * brand is a one-file change.
 */
export function Logo({
  size = "desktop",
  variant = "brand",
  showTagline = true,
  asLink = true,
  className,
}: {
  size?: "desktop" | "mobile" | "compact";
  /** `white` is the footer / dark-band version. */
  variant?: "brand" | "white";
  showTagline?: boolean;
  asLink?: boolean;
  className?: string;
}) {
  const markSize =
    size === "desktop" ? "size-[54px] text-[40px]" : size === "mobile" ? "size-[34px] text-[24px]" : "size-[28px] text-[19px]";
  const wordSize =
    size === "desktop" ? "text-[40px]" : size === "mobile" ? "text-[24px]" : "text-[19px]";

  const content = (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-[6px] bg-brand font-extrabold leading-none text-white",
          markSize,
        )}
        aria-hidden="true"
      >
        <span className="translate-y-[-2px]">{site.mark}</span>
      </span>
      <span className="flex flex-col">
        <span
          className={cn(
            "font-extrabold leading-none tracking-[-0.5px]",
            wordSize,
            variant === "white" ? "text-white" : "text-brand",
          )}
        >
          {site.name}
        </span>
        {showTagline && size === "desktop" ? (
          <span className="mt-0.5 text-[13px] font-medium tracking-[0.2px] text-meta">
            {site.tagline}
          </span>
        ) : null}
      </span>
    </span>
  );

  if (!asLink) return content;
  return (
    <Link href="/" aria-label={`${site.name} — ${site.tagline}`}>
      {content}
    </Link>
  );
}

/** Square mark on its own — compact header, web-story chrome, favicon source. */
export function LogoMark({
  className,
  asLink = true,
}: {
  className?: string;
  asLink?: boolean;
}) {
  const mark = (
    <span
      className={cn(
        "grid size-[34px] shrink-0 place-items-center rounded-[5px] bg-brand text-[24px] font-extrabold leading-none text-white",
        className,
      )}
    >
      <span className="translate-y-[-2px]" aria-hidden="true">
        {site.mark}
      </span>
      <span className="sr-only">{site.name}</span>
    </span>
  );
  if (!asLink) return mark;
  return <Link href="/">{mark}</Link>;
}
