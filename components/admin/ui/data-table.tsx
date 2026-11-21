import Link from "next/link";
import type * as React from "react";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  HugeiconsIcon,
} from "@/components/admin/icons";
import { EmptyState } from "@/components/admin/ui/page-parts";
import { cn } from "@/lib/utils";

/**
 * Data table — `admin-panel-design` skill §5.5.
 *
 * A typed, dependency-free table with the reference's exact classes. Rows are
 * keyed by the record id, never by index, so a filter change can never reuse
 * one record's row for another.
 */

export type Column<T> = {
  /** Stable key, also used for the React key. */
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
  /** Right-align the last (actions) column. */
  align?: "start" | "end";
};

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  empty,
  footer,
}: {
  columns: Column<T>[];
  rows: T[];
  empty: { icon?: Parameters<typeof HugeiconsIcon>[0]["icon"]; title: string; description?: string };
  footer?: React.ReactNode;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={empty.icon}
        title={empty.title}
        description={empty.description}
      />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    column.align === "end" ? "text-right" : "text-left",
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      "px-4 py-3",
                      column.align === "end" && "text-right",
                      column.className,
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  );
}

/** Pagination strip that lives inside the table card. */
export function TablePagination({
  page,
  totalPages,
  total,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  total: number;
  hrefFor: (page: number) => string;
}) {
  const buttonCls =
    "inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-sm text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const disabledCls = "cursor-not-allowed opacity-40 hover:bg-background";

  return (
    <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-3">
      <p className="text-xs text-muted-foreground">
        {total > 0 ? `कुल ${total} रिकॉर्ड · पेज ${page}/${totalPages}` : "कोई रिकॉर्ड नहीं"}
      </p>
      <div className="flex items-center gap-1">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} aria-label="पिछला पेज" className={buttonCls}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} aria-hidden />
          </Link>
        ) : (
          <span aria-disabled className={cn(buttonCls, disabledCls)}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} aria-hidden />
          </span>
        )}
        {page < totalPages ? (
          <Link href={hrefFor(page + 1)} aria-label="अगला पेज" className={buttonCls}>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} aria-hidden />
          </Link>
        ) : (
          <span aria-disabled className={cn(buttonCls, disabledCls)}>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} aria-hidden />
          </span>
        )}
      </div>
    </div>
  );
}
