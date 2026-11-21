import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { Shield01Icon } from "@/components/admin/icons";
import { DataTable, type Column } from "@/components/admin/ui/data-table";
import { PageHeader, Panel } from "@/components/admin/ui/page-parts";
import { StatusBadge } from "@/components/admin/ui/primitives";
import { requirePermission, shellChrome } from "@/lib/admin/guard";
import { auditLog, type AuditEntry } from "@/lib/admin/newsroom";
import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { hindiDateTime, hindiTimeAgo } from "@/lib/format/hindiDate";
import { SENSITIVE_PERMISSIONS } from "@/lib/admin/rbac";

/** Audit log — PRD §7.1: who, what, when, before/after. Append-only. */

export const metadata: Metadata = { title: "ऑडिट लॉग" };

const columns: Column<AuditEntry>[] = [
  {
    id: "action",
    header: "कार्रवाई",
    cell: (row) => (
      <span className="block">
        <span className="font-medium text-foreground">{row.action}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{row.target}</span>
      </span>
    ),
  },
  {
    id: "actor",
    header: "किसने",
    cell: (row) => <span className="text-muted-foreground">{row.actor}</span>,
  },
  {
    id: "when",
    header: "कब",
    cell: (row) => (
      <span className="block">
        <span className="text-muted-foreground">
          {hindiTimeAgo(row.at, MOCK_NOW_ISO)}
        </span>
        <span className="mt-0.5 block font-ui text-[11px] text-muted-foreground/80">
          {hindiDateTime(row.at)}
        </span>
      </span>
    ),
  },
  {
    id: "flag",
    header: "",
    align: "end",
    cell: (row) =>
      row.sensitive ? <StatusBadge tone="danger">संवेदनशील</StatusBadge> : null,
  },
];

export default async function AuditPage() {
  const user = await requirePermission("audit.view");
  const chrome = shellChrome(user);

  return (
    <AdminShell user={user} title="ऑडिट लॉग" {...chrome}>
      <div className="space-y-5">
        <PageHeader
          title="ऑडिट लॉग"
          description="हर प्रकाशन, भूमिका बदलाव और संवेदनशील कार्रवाई — किसने, क्या, कब।"
          backHref="/admin"
        />

        <DataTable
          columns={columns}
          rows={auditLog}
          empty={{
            icon: Shield01Icon,
            title: "कोई कार्रवाई दर्ज नहीं",
            description: "पैनल की हर कार्रवाई यहां अपने आप आती है।",
          }}
        />

        <Panel title="कौन-सी कार्रवाइयां संवेदनशील मानी जाती हैं">
          <ul className="flex flex-wrap gap-2">
            {SENSITIVE_PERMISSIONS.map((permission) => (
              <li key={permission}>
                <StatusBadge tone="neutral">
                  <code className="font-ui">{permission}</code>
                </StatusBadge>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            ये कार्रवाइयां ऑडिट के साथ अलर्ट भी भेजती हैं। लॉग सिर्फ़ जोड़ा जाता है —
            कोई भी, एडमिन भी, पुरानी पंक्ति बदल या मिटा नहीं सकता।
          </p>
        </Panel>
      </div>
    </AdminShell>
  );
}
