import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { HugeiconsIcon, NewsIcon, Search01Icon } from "@/components/admin/icons";
import { DataTable, TablePagination, type Column } from "@/components/admin/ui/data-table";
import { PageHeader } from "@/components/admin/ui/page-parts";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
  StatusBadge,
  type StatusTone,
} from "@/components/admin/ui/primitives";
import { requirePermission, shellChrome } from "@/lib/admin/guard";
import {
  queryStories,
  STATUS_LABEL,
  type StoryRow,
  type WorkflowStatus,
} from "@/lib/admin/newsroom";
import { allow, type AdminUser } from "@/lib/admin/rbac";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { hindiTimeAgo } from "@/lib/format/hindiDate";
import { storyHref } from "@/lib/routes";
import { stories as allStories } from "@/lib/data/stories";

/**
 * Story list — the desk's review queue and every other story view.
 * Filters live in the URL (skill §5.4), so a filtered queue is shareable.
 */

export const metadata: Metadata = {
  title: "ख़बरें",
};

const STATUS_TONE: Record<WorkflowStatus, StatusTone> = {
  assigned: "neutral",
  draft: "neutral",
  filed: "pending",
  in_review: "pending",
  needs_rewrite: "warning",
  scheduled: "active",
  published: "success",
  updated: "success",
  spiked: "danger",
  legal_hold: "danger",
};

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "queue", label: "समीक्षा कतार" },
  { value: "all", label: "सभी" },
  { value: "draft", label: "ड्राफ़्ट" },
  { value: "scheduled", label: "शेड्यूल" },
  { value: "published", label: "प्रकाशित" },
  { value: "spiked", label: "रद्द" },
];

type Query = Record<string, string | string[] | undefined>;

function readableHref(id: string): string | null {
  const story = allStories.find((entry) => entry.id === id);
  return story ? storyHref(story) : null;
}

function columns(user: AdminUser): Column<StoryRow>[] {
  return [
    {
      id: "title",
      header: "हेडलाइन",
      cell: (row) => (
        <span className="block max-w-[420px]">
          <span className="line-clamp-2 font-medium text-foreground">{row.title}</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {row.category}
            {row.state ? ` · ${row.state}` : ""}
          </span>
        </span>
      ),
    },
    {
      id: "status",
      header: "स्थिति",
      cell: (row) => (
        <StatusBadge tone={STATUS_TONE[row.status]}>{STATUS_LABEL[row.status]}</StatusBadge>
      ),
    },
    {
      id: "author",
      header: "किसने भेजी",
      cell: (row) => <span className="text-muted-foreground">{row.authorName}</span>,
    },
    {
      id: "waiting",
      header: "इंतज़ार",
      cell: (row) =>
        row.waitingMinutes != null ? (
          <span
            className={
              row.waitingMinutes > 45
                ? "font-medium text-red-600"
                : row.waitingMinutes > 20
                  ? "font-medium text-orange-600"
                  : "text-muted-foreground"
            }
          >
            {row.waitingMinutes} मिनट
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: "updated",
      header: "अपडेट",
      cell: (row) => (
        <span className="text-muted-foreground">
          {hindiTimeAgo(row.updatedAt, MOCK_NOW_ISO)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      align: "end",
      cell: (row) => {
        const href = readableHref(row.id);
        const editable = allow(user, "story.edit.any", {
          state: row.state,
          category: row.categorySlug,
          city: row.city,
          ownerId: row.authorSlug,
        });
        return (
          <span className="flex items-center justify-end gap-2">
            {href && ["published", "updated"].includes(row.status) ? (
              <AdminButton asChild variant="ghost" size="sm">
                <Link href={href} target="_blank" rel="noreferrer">
                  साइट पर
                </Link>
              </AdminButton>
            ) : null}
            <span
              className="text-xs text-muted-foreground"
              title={
                editable
                  ? "संपादन CMS आने पर चालू होगा"
                  : "आपके स्कोप से बाहर — संपादन नहीं"
              }
            >
              {editable ? "संपादन योग्य" : "सिर्फ़ देखें"}
            </span>
          </span>
        );
      },
    },
  ];
}

async function StoriesTable({
  user,
  searchParams,
}: {
  user: AdminUser;
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const statusParam = typeof query.status === "string" ? query.status : "queue";
  const status = STATUS_OPTIONS.some((option) => option.value === statusParam)
    ? (statusParam as WorkflowStatus | "all" | "queue")
    : "queue";
  const search = typeof query.q === "string" ? query.q.slice(0, 120) : "";
  const page = Number.parseInt(typeof query.page === "string" ? query.page : "1", 10);

  // Scope is enforced here, not in the UI: a bureau chief only ever receives
  // their own state's rows from the query.
  const scopedState =
    user.scope.kind === "state" ? user.scope.values?.[0] : undefined;
  const scopedAuthor = user.scope.kind === "own" ? user.id : undefined;

  const result = queryStories({
    status,
    search: search || undefined,
    state: scopedState,
    authorSlug: scopedAuthor ? "reporter-ek" : undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  });

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    if (status !== "queue") params.set("status", status);
    if (search) params.set("q", search);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/admin/stories?${qs}` : "/admin/stories";
  };

  return (
    <>
      <form method="get" action="/admin/stories" className="flex flex-wrap gap-3">
        <div className="relative min-w-52 flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <HugeiconsIcon icon={Search01Icon} size={16} aria-hidden />
          </span>
          <label htmlFor="story-q" className="sr-only">
            हेडलाइन खोजें
          </label>
          <AdminInput
            id="story-q"
            type="search"
            name="q"
            defaultValue={search}
            placeholder="हेडलाइन से खोजें…"
            className="pl-9"
            maxLength={120}
          />
        </div>
        <label htmlFor="story-status" className="sr-only">
          स्थिति
        </label>
        <AdminSelect id="story-status" name="status" defaultValue={status} className="w-44">
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </AdminSelect>
        <AdminButton type="submit" variant="outline">
          फ़िल्टर करें
        </AdminButton>
      </form>

      <DataTable
        columns={columns(user)}
        rows={result.rows}
        empty={{
          icon: NewsIcon,
          title: "कोई ख़बर नहीं मिली",
          description: "खोज या फ़िल्टर बदलकर देखें।",
        }}
        footer={
          <TablePagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            hrefFor={hrefFor}
          />
        }
      />
    </>
  );
}

export default async function AdminStoriesPage({ searchParams }: PageProps<"/admin/stories">) {
  const user = await requirePermission("story.create");
  const chrome = shellChrome(user);

  return (
    <AdminShell user={user} title="ख़बरें" {...chrome}>
      <div className="space-y-5">
        <PageHeader
          title="ख़बरें"
          description="समीक्षा कतार, शेड्यूल और प्रकाशित ख़बरें — सबसे पुरानी पहले।"
        />
        <Suspense
          fallback={<div className="h-72 animate-pulse rounded-xl border border-border bg-card" />}
        >
          <StoriesTable user={user} searchParams={searchParams} />
        </Suspense>
      </div>
    </AdminShell>
  );
}
