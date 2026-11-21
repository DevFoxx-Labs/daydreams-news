import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  Analytics01Icon,
  CheckmarkCircle02Icon,
  InboxIcon,
  Wallet01Icon,
} from "@/components/admin/icons";
import { DataTable, type Column } from "@/components/admin/ui/data-table";
import { KpiCard, PageHeader, Panel } from "@/components/admin/ui/page-parts";
import { StatusBadge } from "@/components/admin/ui/primitives";
import { requireUser, shellChrome } from "@/lib/admin/guard";
import { earningsFor, filings, type Filing } from "@/lib/admin/newsroom";
import { can } from "@/lib/admin/rbac";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { hindiTimeAgo } from "@/lib/format/hindiDate";
import { rupees } from "@/lib/format/number";

/**
 * Earnings — `docs/ROLES_AND_DASHBOARDS.md` §7.6 / §7.14.
 *
 * A stringer sees their own filings and money; a bureau chief or finance user
 * sees the payout recommendation for everyone in scope. Same screen, scoped
 * server-side.
 */

export const metadata: Metadata = { title: "कमाई और भुगतान" };

const STATUS: Record<Filing["status"], { label: string; tone: "success" | "active" | "warning" | "danger" | "pending" }> =
  {
    filed: { label: "भेजी गई", tone: "pending" },
    accepted: { label: "स्वीकृत", tone: "active" },
    published: { label: "प्रकाशित", tone: "success" },
    returned: { label: "लौटाई गई", tone: "warning" },
    rejected: { label: "रद्द", tone: "danger" },
  };

const PAYOUT: Record<Filing["payoutStatus"], { label: string; tone: "pending" | "active" | "success" }> =
  {
    pending: { label: "लंबित", tone: "pending" },
    approved: { label: "अनुमोदित", tone: "active" },
    paid: { label: "भुगतान हुआ", tone: "success" },
  };

function columns(showStringer: boolean): Column<Filing>[] {
  const base: Column<Filing>[] = [
    {
      id: "title",
      header: "ख़बर",
      cell: (row) => (
        <span className="block max-w-[360px]">
          <span className="line-clamp-2 font-medium text-foreground">{row.title}</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {row.districtName} · {hindiTimeAgo(row.filedAt, MOCK_NOW_ISO)}
          </span>
        </span>
      ),
    },
    {
      id: "status",
      header: "स्थिति",
      cell: (row) => (
        <StatusBadge tone={STATUS[row.status].tone}>{STATUS[row.status].label}</StatusBadge>
      ),
    },
    {
      id: "rate",
      header: "दर",
      cell: (row) => <span className="font-ui text-muted-foreground">{rupees(row.rate)}</span>,
    },
    {
      id: "payout",
      header: "भुगतान",
      align: "end",
      cell: (row) => (
        <StatusBadge tone={PAYOUT[row.payoutStatus].tone}>
          {PAYOUT[row.payoutStatus].label}
        </StatusBadge>
      ),
    },
  ];

  if (!showStringer) return base;

  return [
    {
      id: "stringer",
      header: "संवाददाता",
      cell: (row) => (
        <span className="font-medium text-foreground">{row.stringerName}</span>
      ),
    },
    ...base,
  ];
}

export default async function EarningsPage() {
  const user = await requireUser();
  const chrome = shellChrome(user);

  const isStringer = user.role === "stringer";
  const canSeeAll = can(user, "finance.view") || can(user, "stringer.manage");

  // Scope decides the rows, not the UI.
  const rows = isStringer
    ? earningsFor("u-stringer-0").rows
    : canSeeAll
      ? filings
      : [];

  const summary = earningsFor("u-stringer-0");
  const pending = filings.filter((filing) => filing.payoutStatus === "pending");

  return (
    <AdminShell user={user} title="कमाई और भुगतान" {...chrome}>
      <div className="space-y-5">
        <PageHeader
          title={isStringer ? "इस महीने की कमाई" : "स्ट्रिंगर पेआउट"}
          description={
            isStringer
              ? "स्वीकृत ख़बरें × दर. भुगतान की तारीख़ और स्थिति यहीं दिखती है।"
              : "स्वीकृत फ़ाइलिंग के आधार पर महीने की पेआउट सिफ़ारिश।"
          }
          backHref="/admin"
        />

        {isStringer ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="भेजीं" value={summary.filed} icon={InboxIcon} tone="blue" />
            <KpiCard
              label="स्वीकृत"
              value={summary.accepted}
              icon={CheckmarkCircle02Icon}
              tone="emerald"
            />
            <KpiCard
              label="स्वीकृति दर"
              value={`${summary.acceptanceRate}%`}
              icon={Analytics01Icon}
              tone={summary.acceptanceRate < 40 ? "red" : "amber"}
            />
            <KpiCard
              label="कमाई"
              value={rupees(summary.earned)}
              icon={Wallet01Icon}
              tone="purple"
              hint={`भुगतान हो चुका: ${rupees(summary.paid)}`}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              label="लंबित पेआउट"
              value={pending.length}
              icon={Wallet01Icon}
              tone="amber"
              hint={rupees(pending.reduce((sum, filing) => sum + filing.rate, 0))}
            />
            <KpiCard
              label="कुल फ़ाइलिंग"
              value={filings.length}
              icon={InboxIcon}
              tone="blue"
            />
            <KpiCard
              label="सक्रिय संवाददाता"
              value={new Set(filings.map((filing) => filing.stringerId)).size}
              icon={CheckmarkCircle02Icon}
              tone="emerald"
            />
          </div>
        )}

        <DataTable
          columns={columns(!isStringer)}
          rows={rows}
          empty={{
            icon: Wallet01Icon,
            title: canSeeAll || isStringer ? "कोई फ़ाइलिंग नहीं" : "आपके पास पहुंच नहीं",
            description:
              canSeeAll || isStringer
                ? "नई ख़बर भेजते ही यहां दिखेगी।"
                : "पेआउट सिर्फ़ ब्यूरो चीफ़, लेखा और संपादक देख सकते हैं।",
          }}
        />

        {isStringer ? (
          <Panel title="भुगतान कैसे होता है">
            <ul className="list-disc space-y-1.5 ps-5 text-sm leading-relaxed text-muted-foreground">
              <li>डेस्क की स्वीकृति के बाद ही ख़बर भुगतान योग्य होती है।</li>
              <li>महीने की फ़ाइलिंग अगले महीने की तय तारीख़ को एक साथ भेजी जाती है।</li>
              <li>बैंक विवरण बदलने पर भुगतान 24–72 घंटे रोका जाता है (सुरक्षा नियम)।</li>
            </ul>
          </Panel>
        ) : null}
      </div>
    </AdminShell>
  );
}
