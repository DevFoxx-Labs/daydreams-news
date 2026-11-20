import { t } from "@/lib/i18n";
import { flags } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * AdSlot — DESIGN.md §3, PRD §8.
 *
 * The box always reserves its exact height before anything loads, which is
 * what keeps CLS under 0.1 (AD-2). While no ad network is wired up
 * (`flags.adNetwork` off) it renders a labelled house placeholder.
 *
 * Personalised ads must not load before consent (AD-6); the network script is
 * injected by `ConsentScripts`, never by this component.
 */

const SIZES = {
  "728x90": { w: 728, h: 90, label: "728 × 90" },
  "970x250": { w: 970, h: 250, label: "970 × 250" },
  "300x250": { w: 300, h: 250, label: "300 × 250" },
  "300x600": { w: 300, h: 600, label: "300 × 600" },
  "320x50": { w: 320, h: 50, label: "320 × 50" },
  "320x100": { w: 320, h: 100, label: "320 × 100" },
  "in-article": { w: 0, h: 120, label: "इन-आर्टिकल" },
} as const;

export type AdSize = keyof typeof SIZES;

export function AdSlot({
  size,
  className,
  /** Placement name — maps to the ad-unit id in CMS settings (AD-3). */
  placement,
  sticky = false,
}: {
  size: AdSize;
  className?: string;
  placement: string;
  sticky?: boolean;
}) {
  const { w, h, label } = SIZES[size];

  return (
    <div
      className={cn("mx-auto w-full", sticky && "sticky top-16", className)}
      style={{ maxWidth: w > 0 ? w : undefined }}
      data-ad-placement={placement}
    >
      <div
        className={cn(
          "ad-stripes flex w-full flex-col items-center justify-center gap-1 text-[#9a9a9a]",
        )}
        style={{ height: h }}
        role="complementary"
        aria-label={t.common.advertisement}
      >
        {flags.adNetwork ? null : (
          <>
            <span className="font-ui text-[12px] font-medium uppercase tracking-[1px]">
              {t.common.advertisementLatin}
            </span>
            <b className="text-[13px] font-semibold text-[#8a8a8a]">
              {t.common.advertisement} · {label}
            </b>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Mobile/desktop pair: one reserved box per breakpoint so neither size is
 * loaded on the wrong device (AD-1).
 */
export function ResponsiveAdSlot({
  mobile,
  desktop,
  placement,
  className,
}: {
  mobile: AdSize;
  desktop: AdSize;
  placement: string;
  className?: string;
}) {
  return (
    <>
      <AdSlot
        size={mobile}
        placement={`${placement}-mobile`}
        className={cn("lg:hidden", className)}
      />
      <AdSlot
        size={desktop}
        placement={`${placement}-desktop`}
        className={cn("hidden lg:block", className)}
      />
    </>
  );
}
