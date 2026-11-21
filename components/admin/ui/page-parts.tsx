import Link from "next/link";
import type * as React from "react";

import {
  AnalyticsDownIcon,
  AnalyticsUpIcon,
  ArrowLeft01Icon,
  HugeiconsIcon,
} from "@/components/admin/icons";
import { cn } from "@/lib/utils";

/**
 * Page furniture — `admin-panel-design` skill §5.
 * Every admin page is: PageHeader → filters → content card.
 */

export function PageHeader({
  title,
  description,
  backHref,
  action,
}: {
  title: string;
  description?: string;
  backHref?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {backHref ? (
            <Link
              href={backHref}
              aria-label="वापस जाएं"
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-accent/80 active:scale-95"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} aria-hidden />
            </Link>
          ) : null}
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        </div>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/** KPI tile. Five per dashboard at most (skill §5.3). */
export function KpiCard({
  label,
  value,
  changePct,
  icon,
  tone = "slate",
  hint,
}: {
  label: string;
  value: string | number;
  changePct?: number | null;
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"];
  tone?: "purple" | "emerald" | "blue" | "amber" | "red" | "slate";
  hint?: string;
}) {
  const tones = {
    purple: "bg-purple-50 text-purple-500 dark:bg-purple-900/20",
    emerald: "bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20",
    blue: "bg-blue-50 text-blue-500 dark:bg-blue-900/20",
    amber: "bg-amber-50 text-amber-500 dark:bg-amber-900/20",
    red: "bg-red-50 text-red-500 dark:bg-red-900/20",
    slate: "bg-slate-100 text-slate-500 dark:bg-slate-800",
  } as const;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-full",
            tones[tone],
          )}
        >
          <HugeiconsIcon icon={icon} size={20} aria-hidden />
        </span>
        <ChangeBadge pct={changePct} />
      </div>
      <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      {hint ? <p className="mt-1 text-[11px] text-muted-foreground/80">{hint}</p> : null}
    </div>
  );
}

export function ChangeBadge({ pct }: { pct?: number | null }) {
  if (pct == null || Number.isNaN(pct)) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const up = pct >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        up ? "text-emerald-600" : "text-red-600",
      )}
    >
      <HugeiconsIcon
        icon={up ? AnalyticsUpIcon : AnalyticsDownIcon}
        size={12}
        aria-hidden
      />
      {Math.abs(pct)}%
    </span>
  );
}

/** Empty state inside a card (skill §5.6). Always says what to do next. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: Parameters<typeof HugeiconsIcon>[0]["icon"];
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-8 text-center sm:py-16">
      {icon ? (
        <HugeiconsIcon
          icon={icon}
          size={40}
          className="mb-3 text-muted-foreground/40"
          aria-hidden
        />
      ) : null}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/** Section wrapper used inside dashboards. */
export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card", className)}>
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {action}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
