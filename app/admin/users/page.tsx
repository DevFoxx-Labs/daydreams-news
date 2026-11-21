import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { Shield01Icon, UserMultipleIcon } from "@/components/admin/icons";
import { DataTable, type Column } from "@/components/admin/ui/data-table";
import { KpiCard, PageHeader, Panel } from "@/components/admin/ui/page-parts";
import { StatusBadge } from "@/components/admin/ui/primitives";
import { requirePermission, shellChrome } from "@/lib/admin/guard";
import { permissionsOf, ROLE_META, scopeLabel, type Role } from "@/lib/admin/rbac";
import { listDemoAccounts } from "@/lib/admin/users";

/** Users & roles — `docs/ROLES_AND_DASHBOARDS.md` §7.17. */

export const metadata: Metadata = { title: "यूज़र और रोल" };

type Row = {
  id: string;
  name: string;
  email: string;
  role: Role;
  scope: string;
  mfaEnabled: boolean;
  permissions: number;
};

const columns: Column<Row>[] = [
  {
    id: "name",
    header: "नाम",
    cell: (row) => (
      <span className="block">
        <span className="font-medium text-foreground">{row.name}</span>
        <span className="mt-0.5 block font-ui text-xs text-muted-foreground">
          {row.email}
        </span>
      </span>
    ),
  },
  {
    id: "role",
    header: "रोल",
    cell: (row) => (
      <span className="block">
        <StatusBadge tone="neutral">{ROLE_META[row.role].hindi}</StatusBadge>
        <span className="mt-1 block text-xs text-muted-foreground">
          {ROLE_META[row.role].label}
        </span>
      </span>
    ),
  },
  {
    id: "scope",
    header: "स्कोप",
    cell: (row) => <span className="text-muted-foreground">{row.scope}</span>,
  },
  {
    id: "permissions",
    header: "अनुमतियां",
    cell: (row) => <span className="text-muted-foreground">{row.permissions}</span>,
  },
  {
    id: "mfa",
    header: "MFA",
    align: "end",
    cell: (row) =>
      row.mfaEnabled ? (
        <StatusBadge tone="success">चालू</StatusBadge>
      ) : (
        <StatusBadge tone="danger">बंद</StatusBadge>
      ),
  },
];

export default async function AdminUsersPage() {
  const user = await requirePermission("user.manage");
  const chrome = shellChrome(user);

  const rows: Row[] = listDemoAccounts().map((account) => ({
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    scope: scopeLabel(account.scope),
    mfaEnabled: account.mfaEnabled,
    permissions: permissionsOf(account.role).length,
  }));

  const withoutMfa = rows.filter((row) => !row.mfaEnabled).length;

  return (
    <AdminShell user={user} title="यूज़र और रोल" {...chrome}>
      <div className="space-y-5">
        <PageHeader
          title="यूज़र और रोल"
          description="हर खाते का रोल, स्कोप और MFA स्थिति। रोल बदलना ऑडिट लॉग में दर्ज होता है।"
          backHref="/admin"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <KpiCard label="कुल खाते" value={rows.length} icon={UserMultipleIcon} tone="blue" />
          <KpiCard
            label="MFA के बिना"
            value={withoutMfa}
            icon={Shield01Icon}
            tone={withoutMfa > 0 ? "red" : "emerald"}
          />
          <KpiCard
            label="आपका स्कोप"
            value={scopeLabel(user.scope)}
            icon={Shield01Icon}
            tone="slate"
          />
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          empty={{
            icon: UserMultipleIcon,
            title: "कोई खाता नहीं",
            description: "ADMIN_DEV_PASSWORD सेट करने पर डेमो खाते दिखते हैं।",
          }}
        />

        <Panel title="ये खाते डेमो हैं">
          <p className="text-sm leading-relaxed text-muted-foreground">
            असली यूज़र CMS (PRD M7) के साथ आएंगे — तब यह सूची{" "}
            <code className="font-ui">users</code> टेबल से आएगी, पासवर्ड रीसेट, डिवाइस
            सूची और अनिवार्य MFA के साथ। अभी MFA लागू नहीं है; यह{" "}
            <code className="font-ui">docs/known-gaps.md</code> में 🔴 के रूप में दर्ज है।
          </p>
        </Panel>
      </div>
    </AdminShell>
  );
}
