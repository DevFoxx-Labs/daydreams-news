import type { Metadata } from "next";
import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { AlertCircleIcon, Legal01Icon } from "@/components/admin/icons";
import { DataTable, type Column } from "@/components/admin/ui/data-table";
import { KpiCard, PageHeader, Panel } from "@/components/admin/ui/page-parts";
import { StatusBadge } from "@/components/admin/ui/primitives";
import { requirePermission, shellChrome } from "@/lib/admin/guard";
import { grievances, type Grievance } from "@/lib/admin/newsroom";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { hindiTimeAgo } from "@/lib/format/hindiDate";
import { NOTICE_VERSION_STRING } from "@/lib/legal/notices";
import { site } from "@/lib/site";

/**
 * Grievance & rights queue — `docs/ROLES_AND_DASHBOARDS.md` §7.18.
 * DPDP ss.11–14 + IT Rules 2021: 48h acknowledgement, 30-day resolution.
 */

export const metadata: Metadata = { title: "शिकायत निवारण" };

/** Personal to the signed-in user — no static shell, blocking is correct. */
export const instant = false;

const TYPE_LABEL: Record<Grievance["type"], string> = {
  access: "जानकारी देखें",
  correction: "सुधार",
  erasure: "मिटाएं",
  nomination: "नामांकन",
  withdraw: "सहमति वापस",
  content: "सामग्री पर आपत्ति",
};

const columns: Column<Grievance>[] = [
  {
    id: "subject",
    header: "अनुरोध",
    cell: (row) => (
      <span className="block max-w-[380px]">
        <span className="line-clamp-2 font-medium text-foreground">{row.subject}</span>
        <span className="mt-0.5 block font-ui text-xs text-muted-foreground">
          {row.ticket} · {hindiTimeAgo(row.receivedAt, MOCK_NOW_ISO)}
        </span>
      </span>
    ),
  },
  {
    id: "type",
    header: "प्रकार",
    cell: (row) => <StatusBadge tone="neutral">{TYPE_LABEL[row.type]}</StatusBadge>,
  },
  {
    id: "ack",
    header: "पुष्टि SLA (48घं)",
    cell: (row) =>
      row.status === "resolved" ? (
        <span className="text-muted-foreground">—</span>
      ) : (
        <StatusBadge tone={row.ackDueInHours < 6 ? "danger" : row.ackDueInHours < 24 ? "warning" : "pending"}>
          {row.ackDueInHours} घंटे बाक़ी
        </StatusBadge>
      ),
  },
  {
    id: "resolve",
    header: "निपटारा (30 दिन)",
    cell: (row) => (
      <span className="text-muted-foreground">{row.resolveDueInDays} दिन</span>
    ),
  },
  {
    id: "status",
    header: "स्थिति",
    align: "end",
    cell: (row) => (
      <StatusBadge
        tone={
          row.status === "resolved" ? "success" : row.status === "acknowledged" ? "active" : "pending"
        }
      >
        {{ open: "नया", acknowledged: "पुष्टि हुई", resolved: "निपटाया" }[row.status]}
      </StatusBadge>
    ),
  },
];

export default async function GrievancesPage() {
  const user = await requirePermission("grievance.handle");
  const chrome = shellChrome(user);

  const open = grievances.filter((entry) => entry.status !== "resolved");
  const breaching = open.filter((entry) => entry.ackDueInHours < 6);
  const officer = site.legal.grievanceOfficer;

  return (
    <AdminShell user={user} title="शिकायत निवारण" {...chrome}>
      <div className="space-y-5">
        <PageHeader
          title="शिकायत और अधिकार अनुरोध"
          description="DPDP अधिनियम की समय-सीमा के साथ — 48 घंटे में पुष्टि, 30 दिन में निपटारा।"
          backHref="/admin"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <KpiCard label="खुले अनुरोध" value={open.length} icon={Legal01Icon} tone="amber" />
          <KpiCard
            label="SLA के क़रीब"
            value={breaching.length}
            icon={AlertCircleIcon}
            tone={breaching.length > 0 ? "red" : "slate"}
          />
          <KpiCard
            label="निपटाए गए"
            value={grievances.length - open.length}
            icon={Legal01Icon}
            tone="emerald"
          />
        </div>

        <DataTable
          columns={columns}
          rows={grievances}
          empty={{
            icon: Legal01Icon,
            title: "कोई अनुरोध नहीं",
            description: "नए अनुरोध /grievance फ़ॉर्म से यहां आते हैं।",
          }}
        />

        <Panel title="अधिकारी और प्रक्रिया">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">अधिकारी</dt>
              <dd className="font-medium">{officer.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">ईमेल</dt>
              <dd className="font-ui">{officer.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">नोटिस संस्करण</dt>
              <dd className="font-ui text-xs">{NOTICE_VERSION_STRING}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">सार्वजनिक पेज</dt>
              <dd>
                <Link href="/grievance" className="text-brand hover:underline">
                  /grievance
                </Link>
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            अनुरोध स्वीकार करने से पहले पहचान की पुष्टि ज़रूरी है। मिटाने के अनुरोध में
            सहमति रिकॉर्ड नहीं हटाए जाते — वे कानूनी प्रमाण हैं और प्राइवेसी नोटिस में
            इसका ज़िक्र है।
          </p>
        </Panel>
      </div>
    </AdminShell>
  );
}
