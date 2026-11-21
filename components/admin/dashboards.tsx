import Link from "next/link";

import {
  AlertCircleIcon,
  Analytics01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  CookieIcon,
  FlashIcon,
  HugeiconsIcon,
  InboxIcon,
  Legal01Icon,
  LiveStreaming01Icon,
  MapsLocation01Icon,
  NewsIcon,
  Shield01Icon,
  Task01Icon,
  TaskDone01Icon,
  UserMultipleIcon,
  Wallet01Icon,
} from "@/components/admin/icons";
import { PublishTrendChart } from "@/components/admin/publish-trend-chart";
import {
  AdminButton,
  Card,
  StatusBadge,
  type StatusTone,
} from "@/components/admin/ui/primitives";
import {
  EmptyState,
  KpiCard,
  Panel,
} from "@/components/admin/ui/page-parts";
import {
  assignments,
  coverageGaps,
  earningsFor,
  filings,
  grievances,
  medianFileToPublish,
  postReviewPending,
  publishTrend,
  publishedToday,
  queryStories,
  reviewQueueCount,
  STATUS_LABEL,
  topStoriesNow,
  auditLog,
  type StoryRow,
  type WorkflowStatus,
} from "@/lib/admin/newsroom";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { states } from "@/lib/data/states";
import { hindiTimeAgo, istClock24 } from "@/lib/format/hindiDate";
import { indianNumber, rupees } from "@/lib/format/number";
import type { AdminUser } from "@/lib/admin/rbac";
import { cn } from "@/lib/utils";

/**
 * Role dashboards — `docs/ROLES_AND_DASHBOARDS.md` §7.
 *
 * Each one answers "what do I do next" first: one work queue, at most five
 * KPI tiles, one primary action. Everything else is a panel below.
 */

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

function ago(iso: string) {
  return hindiTimeAgo(iso, MOCK_NOW_ISO);
}

/** SLA colour for a queue item: amber past 20 min, red past 45 (report §8.5). */
function waitTone(minutes?: number): StatusTone {
  if (minutes == null) return "neutral";
  if (minutes > 45) return "danger";
  if (minutes > 20) return "warning";
  return "neutral";
}

function QueueRow({ row, href }: { row: StoryRow; href: string }) {
  return (
    <li className="flex items-start justify-between gap-3 border-b border-border py-2.5 last:border-0">
      <div className="min-w-0">
        <Link
          href={href}
          className="line-clamp-2 text-sm font-medium text-foreground hover:text-brand"
        >
          {row.title}
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {row.category} · {row.authorName} · {ago(row.updatedAt)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <StatusBadge tone={STATUS_TONE[row.status]}>
          {STATUS_LABEL[row.status]}
        </StatusBadge>
        {row.waitingMinutes != null ? (
          <StatusBadge tone={waitTone(row.waitingMinutes)}>
            {row.waitingMinutes} मिनट
          </StatusBadge>
        ) : null}
      </div>
    </li>
  );
}

function StoryQueue({
  title,
  rows,
  emptyTitle,
  action,
}: {
  title: string;
  rows: StoryRow[];
  emptyTitle: string;
  action?: React.ReactNode;
}) {
  return (
    <Panel title={title} action={action}>
      {rows.length === 0 ? (
        <EmptyState
          icon={TaskDone01Icon}
          title={emptyTitle}
          description="कतार साफ़ है — अगली ख़बर आते ही यहीं दिखेगी।"
        />
      ) : (
        <ul>
          {rows.map((row) => (
            <QueueRow key={row.id} row={row} href={`/admin/stories?q=${row.id}`} />
          ))}
        </ul>
      )}
    </Panel>
  );
}

// ── Desk editor ────────────────────────────────────────────────────

export function DeskDashboard() {
  const queue = queryStories({ status: "queue", perPage: 8 });
  const scheduled = queryStories({ status: "scheduled", perPage: 5 });
  const pendingReview = postReviewPending();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="समीक्षा के इंतज़ार में"
          value={reviewQueueCount()}
          icon={TaskDone01Icon}
          tone="amber"
          hint={queue.rows[0] ? `सबसे पुरानी: ${queue.rows[0].waitingMinutes ?? 0} मिनट` : undefined}
        />
        <KpiCard
          label="आज प्रकाशित"
          value={publishedToday()}
          icon={CheckmarkCircle02Icon}
          tone="emerald"
        />
        <KpiCard
          label="फ़ाइल से प्रकाशन (मीडियन)"
          value={`${medianFileToPublish()} मिनट`}
          icon={Clock01Icon}
          tone="blue"
        />
        <KpiCard
          label="समीक्षा बाक़ी ब्रेकिंग"
          value={pendingReview.length}
          icon={FlashIcon}
          tone={pendingReview.length > 0 ? "red" : "slate"}
          hint="15 मिनट में समीक्षा ज़रूरी"
        />
      </div>

      {pendingReview.length > 0 ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
          <div className="flex items-start gap-3">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              size={20}
              className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
              aria-hidden
            />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                ब्रेकिंग ख़बरें समीक्षा के बिना लाइव हैं
              </p>
              <ul className="mt-1 space-y-0.5">
                {pendingReview.slice(0, 3).map((row) => (
                  <li key={row.id} className="text-xs text-red-700/90 dark:text-red-400/90">
                    {row.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <StoryQueue
          title="समीक्षा कतार (सबसे पुरानी पहले)"
          rows={queue.rows}
          emptyTitle="कोई ख़बर समीक्षा में नहीं"
          action={
            <AdminButton asChild variant="ghost" size="sm">
              <Link href="/admin/stories">सभी देखें</Link>
            </AdminButton>
          }
        />

        <div className="space-y-4">
          <Panel title="शेड्यूल">
            {scheduled.rows.length === 0 ? (
              <EmptyState icon={Clock01Icon} title="कुछ शेड्यूल नहीं है" />
            ) : (
              <ul>
                {scheduled.rows.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between gap-3 border-b border-border py-2 last:border-0"
                  >
                    <span className="line-clamp-1 text-sm text-foreground">{row.title}</span>
                    <span className="shrink-0 font-ui text-xs text-muted-foreground">
                      {istClock24(row.updatedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="अभी सबसे ज़्यादा पढ़ी जा रहीं">
            <ol className="space-y-2">
              {topStoriesNow(5).map((row, index) => (
                <li key={row.id} className="flex items-start gap-2.5">
                  <span className="font-ui text-lg font-bold leading-none text-muted-foreground/40">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-1 block text-sm text-foreground">
                      {row.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {indianNumber(row.views ?? 0)} व्यू
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>

      <Panel title="पिछले 14 दिन — रोज़ाना प्रकाशन">
        <PublishTrendChart data={publishTrend()} />
      </Panel>
    </div>
  );
}

// ── Editor-in-Chief ────────────────────────────────────────────────

export function EditorDashboard() {
  const decisions = postReviewPending();
  const queue = queryStories({ status: "queue", perPage: 5 });
  const openGrievances = grievances.filter((entry) => entry.status !== "resolved");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="मेरे फ़ैसले का इंतज़ार"
          value={decisions.length + openGrievances.length}
          icon={AlertCircleIcon}
          tone="red"
        />
        <KpiCard label="आज प्रकाशित" value={publishedToday()} icon={NewsIcon} tone="emerald" />
        <KpiCard
          label="समीक्षा कतार"
          value={reviewQueueCount()}
          icon={TaskDone01Icon}
          tone="amber"
        />
        <KpiCard
          label="खुली शिकायतें"
          value={openGrievances.length}
          icon={Legal01Icon}
          tone={openGrievances.length > 0 ? "red" : "slate"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="मेरे फ़ैसले का इंतज़ार"
          action={
            <AdminButton asChild variant="ghost" size="sm">
              <Link href="/admin/stories">कतार</Link>
            </AdminButton>
          }
        >
          {decisions.length === 0 && openGrievances.length === 0 ? (
            <EmptyState
              icon={CheckmarkCircle02Icon}
              title="कुछ भी लंबित नहीं"
              description="समीक्षा बाक़ी ब्रेकिंग और शिकायतें यहीं दिखेंगी।"
            />
          ) : (
            <ul className="space-y-2.5">
              {decisions.map((row) => (
                <li key={row.id} className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="line-clamp-1 block text-sm font-medium">{row.title}</span>
                    <span className="text-xs text-muted-foreground">
                      ब्रेकिंग · समीक्षा बाक़ी · {ago(row.updatedAt)}
                    </span>
                  </span>
                  <StatusBadge tone="danger">समीक्षा करें</StatusBadge>
                </li>
              ))}
              {openGrievances.map((entry) => (
                <li key={entry.id} className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="line-clamp-1 block text-sm font-medium">
                      {entry.subject}
                    </span>
                    <span className="font-ui text-xs text-muted-foreground">
                      {entry.ticket} · {ago(entry.receivedAt)}
                    </span>
                  </span>
                  <StatusBadge tone={entry.ackDueInHours < 6 ? "danger" : "pending"}>
                    {entry.ackDueInHours}घं बाक़ी
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="न्यूज़रूम बोर्ड">
          <dl className="grid grid-cols-2 gap-3">
            {[
              { label: "समीक्षा में", value: reviewQueueCount(), icon: TaskDone01Icon },
              { label: "शेड्यूल", value: queryStories({ status: "scheduled" }).total, icon: Clock01Icon },
              { label: "लाइव ब्लॉग", value: 2, icon: LiveStreaming01Icon },
              { label: "खुले असाइनमेंट", value: assignments.filter((a) => a.status === "open").length, icon: Task01Icon },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-border p-3">
                <HugeiconsIcon
                  icon={item.icon}
                  size={16}
                  className="text-muted-foreground"
                  aria-hidden
                />
                <p className="mt-1.5 text-lg font-semibold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <Panel title="पिछले 14 दिन — रोज़ाना प्रकाशन">
        <PublishTrendChart data={publishTrend()} />
      </Panel>

      <StoryQueue
        title="समीक्षा कतार"
        rows={queue.rows}
        emptyTitle="कतार खाली है"
      />
    </div>
  );
}

// ── Reporter ───────────────────────────────────────────────────────

export function ReporterDashboard({ user }: { user: AdminUser }) {
  const mine = queryStories({ authorSlug: "reporter-ek", perPage: 6 });
  const myAssignments = assignments.filter((item) => item.status === "open").slice(0, 5);
  const published = mine.rows.filter((row) =>
    ["published", "updated"].includes(row.status),
  );
  const totalViews = published.reduce((sum, row) => sum + (row.views ?? 0), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="खुले असाइनमेंट" value={myAssignments.length} icon={Task01Icon} tone="amber" />
        <KpiCard
          label="ड्राफ़्ट"
          value={mine.rows.filter((row) => row.status === "draft").length}
          icon={InboxIcon}
          tone="slate"
        />
        <KpiCard
          label="लौटाई गईं"
          value={mine.rows.filter((row) => row.status === "needs_rewrite").length}
          icon={AlertCircleIcon}
          tone="red"
        />
        <KpiCard
          label="इस महीने के व्यू"
          value={indianNumber(totalViews)}
          icon={Analytics01Icon}
          tone="emerald"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="मेरे असाइनमेंट">
          {myAssignments.length === 0 ? (
            <EmptyState icon={Task01Icon} title="कोई असाइनमेंट नहीं" />
          ) : (
            <ul>
              {myAssignments.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 border-b border-border py-2.5 last:border-0"
                >
                  <span className="min-w-0">
                    <span className="line-clamp-2 block text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.desk} डेस्क</span>
                  </span>
                  <StatusBadge tone="pending">डेडलाइन {ago(item.dueAt)}</StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="मेरी ख़बरें">
          {mine.rows.length === 0 ? (
            <EmptyState icon={NewsIcon} title="अभी कोई ख़बर नहीं" />
          ) : (
            <ul>
              {mine.rows.map((row) => (
                <QueueRow key={row.id} row={row} href={`/admin/stories?q=${row.id}`} />
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="मेरा स्कोरकार्ड">
        <p className="text-sm text-muted-foreground">
          {user.name} · इस महीने {published.length} ख़बरें प्रकाशित ·{" "}
          {indianNumber(totalViews)} कुल व्यू. तुलनात्मक लीडरबोर्ड जानबूझकर नहीं दिखाया
          जाता — वह संख्या बढ़ाने को इनाम देता है, सटीकता को नहीं।
        </p>
      </Panel>
    </div>
  );
}

// ── Stringer ───────────────────────────────────────────────────────

export function StringerDashboard() {
  const summary = earningsFor("u-stringer-0");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="इस महीने भेजीं" value={summary.filed} icon={InboxIcon} tone="blue" />
        <KpiCard label="स्वीकृत" value={summary.accepted} icon={CheckmarkCircle02Icon} tone="emerald" />
        <KpiCard
          label="स्वीकृति दर"
          value={`${summary.acceptanceRate}%`}
          icon={Analytics01Icon}
          tone={summary.acceptanceRate < 40 ? "red" : "amber"}
        />
        <KpiCard
          label="इस महीने की कमाई"
          value={rupees(summary.earned)}
          icon={Wallet01Icon}
          tone="purple"
          hint={`भुगतान हो चुका: ${rupees(summary.paid)}`}
        />
      </div>

      <Panel
        title="मेरी भेजी ख़बरें"
        action={
          <AdminButton asChild variant="ghost" size="sm">
            <Link href="/admin/earnings">कमाई देखें</Link>
          </AdminButton>
        }
      >
        {summary.rows.length === 0 ? (
          <EmptyState
            icon={InboxIcon}
            title="अभी कोई ख़बर नहीं भेजी"
            description="ऊपर “ख़बर भेजें” से पहली ख़बर भेजें।"
          />
        ) : (
          <ul>
            {summary.rows.map((filing) => (
              <li
                key={filing.id}
                className="flex items-start justify-between gap-3 border-b border-border py-2.5 last:border-0"
              >
                <span className="min-w-0">
                  <span className="line-clamp-2 block text-sm font-medium">{filing.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {filing.districtName} · {ago(filing.filedAt)}
                  </span>
                  {filing.returnNote ? (
                    <span className="mt-1 block text-xs text-orange-600 dark:text-orange-400">
                      {filing.returnNote}
                    </span>
                  ) : null}
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge
                    tone={
                      filing.status === "published"
                        ? "success"
                        : filing.status === "accepted"
                          ? "active"
                          : filing.status === "returned"
                            ? "warning"
                            : filing.status === "rejected"
                              ? "danger"
                              : "pending"
                    }
                  >
                    {
                      {
                        filed: "भेजी गई",
                        accepted: "स्वीकृत",
                        published: "प्रकाशित",
                        returned: "लौटाई गई",
                        rejected: "रद्द",
                      }[filing.status]
                    }
                  </StatusBadge>
                  <span className="font-ui text-xs text-muted-foreground">
                    {rupees(filing.rate)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

// ── Bureau chief ───────────────────────────────────────────────────

export function BureauDashboard({ user }: { user: AdminUser }) {
  const stateSlug = user.scope.values?.[0] ?? "bihar";
  const stateName =
    states.find((entry) => entry.slug === stateSlug)?.name ?? stateSlug;
  const districts = coverageGaps(stateSlug);
  const silent = districts.filter((district) => district.filedToday === 0);
  const queue = queryStories({ status: "queue", state: stateSlug, perPage: 6 });
  const pendingPayout = filings.filter((f) => f.payoutStatus === "pending");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="आज ख़ामोश ज़िले"
          value={silent.length}
          icon={MapsLocation01Icon}
          tone={silent.length > 0 ? "red" : "emerald"}
          hint={`कुल ${districts.length} ज़िले`}
        />
        <KpiCard label="समीक्षा कतार" value={queue.total} icon={TaskDone01Icon} tone="amber" />
        <KpiCard
          label="सक्रिय स्ट्रिंगर"
          value={new Set(filings.map((f) => f.stringerId)).size}
          icon={UserMultipleIcon}
          tone="blue"
        />
        <KpiCard
          label="पेआउट सिफ़ारिश बाक़ी"
          value={pendingPayout.length}
          icon={Wallet01Icon}
          tone="purple"
          hint={rupees(pendingPayout.reduce((sum, f) => sum + f.rate, 0))}
        />
      </div>

      <Panel
        title="कवरेज — ज़िलेवार"
        action={
          <AdminButton asChild variant="ghost" size="sm">
            <Link href="/admin/coverage">पूरा मैप</Link>
          </AdminButton>
        }
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {districts
            .slice()
            .sort((a, b) => a.filedToday - b.filedToday)
            .map((district) => (
              <li
                key={district.slug}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2",
                  district.filedToday === 0
                    ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30"
                    : "border-border",
                )}
              >
                <span className="text-sm font-medium">{district.name}</span>
                <span className="text-xs text-muted-foreground">
                  {district.filedToday === 0
                    ? `${district.silentHours} घंटे से कुछ नहीं`
                    : `${district.filedToday} ख़बरें`}
                </span>
              </li>
            ))}
        </ul>
      </Panel>

      <StoryQueue
        title={`${stateName} — समीक्षा कतार`}
        rows={queue.rows}
        emptyTitle="इस राज्य की कतार खाली है"
      />
    </div>
  );
}

// ── Grievance / DPO ────────────────────────────────────────────────

export function GrievanceDashboard() {
  const open = grievances.filter((entry) => entry.status !== "resolved");
  const breaching = open.filter((entry) => entry.ackDueInHours < 6);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="खुले अनुरोध" value={open.length} icon={Legal01Icon} tone="amber" />
        <KpiCard
          label="SLA के क़रीब"
          value={breaching.length}
          icon={AlertCircleIcon}
          tone={breaching.length > 0 ? "red" : "slate"}
          hint="48 घंटे में पुष्टि ज़रूरी"
        />
        <KpiCard
          label="इस महीने निपटाए"
          value={grievances.filter((entry) => entry.status === "resolved").length}
          icon={CheckmarkCircle02Icon}
          tone="emerald"
        />
        <KpiCard label="सहमति रिकॉर्ड" value="लाइव" icon={CookieIcon} tone="purple" />
      </div>

      <Panel
        title="शिकायत और अधिकार अनुरोध"
        action={
          <AdminButton asChild variant="ghost" size="sm">
            <Link href="/admin/grievances">सभी देखें</Link>
          </AdminButton>
        }
      >
        <ul>
          {open.map((entry) => (
            <li
              key={entry.id}
              className="flex items-start justify-between gap-3 border-b border-border py-2.5 last:border-0"
            >
              <span className="min-w-0">
                <span className="line-clamp-2 block text-sm font-medium">{entry.subject}</span>
                <span className="font-ui text-xs text-muted-foreground">
                  {entry.ticket} · {ago(entry.receivedAt)}
                </span>
              </span>
              <StatusBadge tone={entry.ackDueInHours < 6 ? "danger" : "pending"}>
                पुष्टि: {entry.ackDueInHours}घं
              </StatusBadge>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="अनुपालन स्थिति">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between gap-3">
            <span>नोटिस संस्करण</span>
            <span className="font-ui text-xs text-muted-foreground">
              privacy@2026-11-20 · terms@2026-11-20 · cookies@2026-11-20
            </span>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span>सहमति लेजर</span>
            <StatusBadge tone="warning">फ़ाइल आधारित — DB बाक़ी</StatusBadge>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span>कानूनी समीक्षा</span>
            <StatusBadge tone="danger">वकील की समीक्षा बाक़ी</StatusBadge>
          </li>
        </ul>
      </Panel>
    </div>
  );
}

// ── System admin ───────────────────────────────────────────────────

export function SystemDashboard() {
  const sensitive = auditLog.filter((entry) => entry.sensitive);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="सक्रिय यूज़र" value={7} icon={UserMultipleIcon} tone="blue" />
        <KpiCard
          label="MFA के बिना"
          value={7}
          icon={Shield01Icon}
          tone="red"
          hint="MFA अभी लागू नहीं — known-gaps देखें"
        />
        <KpiCard label="संवेदनशील कार्रवाइयां (24घं)" value={sensitive.length} icon={AlertCircleIcon} tone="amber" />
        <KpiCard label="इंटीग्रेशन" value="डेमो" icon={Analytics01Icon} tone="slate" />
      </div>

      <Panel
        title="ऑडिट लॉग"
        action={
          <AdminButton asChild variant="ghost" size="sm">
            <Link href="/admin/audit">सभी देखें</Link>
          </AdminButton>
        }
      >
        <ul>
          {auditLog.slice(0, 6).map((entry) => (
            <li
              key={entry.id}
              className="flex items-start justify-between gap-3 border-b border-border py-2.5 last:border-0"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium">{entry.action}</span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {entry.actor} · {entry.target}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {entry.sensitive ? <StatusBadge tone="danger">संवेदनशील</StatusBadge> : null}
                <span className="font-ui text-xs text-muted-foreground">
                  {istClock24(entry.at)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

// ── Roles whose dashboard is a later phase ─────────────────────────

export function PlannedDashboard({ user }: { user: AdminUser }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <h2 className="text-sm font-semibold text-foreground">
          इस रोल का डैशबोर्ड अभी नहीं बना है
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          <code className="font-ui">{user.role}</code> का पूरा डैशबोर्ड{" "}
          <code className="font-ui">docs/ROLES_AND_DASHBOARDS.md</code> §7 में तय है और
          फेज़ 2/3 में बनेगा। तब तक मेन्यू में वही आइटम दिख रहे हैं जो उस रोल को मिलेंगे —
          जो स्क्रीन अभी नहीं बनी, उस पर लिंक नहीं है।
        </p>
      </Card>

      <Panel title="जो अभी उपलब्ध है">
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/admin/stories" className="text-brand hover:underline">
              ख़बरों की सूची और समीक्षा कतार
            </Link>
          </li>
          <li>
            <Link href="/admin/profile" className="text-brand hover:underline">
              मेरा प्रोफ़ाइल और अनुमतियां
            </Link>
          </li>
        </ul>
      </Panel>
    </div>
  );
}
