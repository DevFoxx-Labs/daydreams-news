import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { MapsLocation01Icon } from "@/components/admin/icons";
import { DataTable, type Column } from "@/components/admin/ui/data-table";
import { KpiCard, PageHeader, Panel } from "@/components/admin/ui/page-parts";
import { StatusBadge } from "@/components/admin/ui/primitives";
import { requireUser, shellChrome } from "@/lib/admin/guard";
import { coverageGaps } from "@/lib/admin/newsroom";
import { states } from "@/lib/data/states";

/**
 * Coverage map — `docs/ROLES_AND_DASHBOARDS.md` §7.7.
 * The first question a bureau chief asks: which districts filed nothing today?
 */

export const metadata: Metadata = { title: "कवरेज" };

type Row = {
  id: string;
  name: string;
  filedToday: number;
  silentHours: number;
};

const columns: Column<Row>[] = [
  {
    id: "district",
    header: "ज़िला",
    cell: (row) => <span className="font-medium text-foreground">{row.name}</span>,
  },
  {
    id: "filed",
    header: "आज की ख़बरें",
    cell: (row) => <span className="text-muted-foreground">{row.filedToday}</span>,
  },
  {
    id: "silent",
    header: "आख़िरी ख़बर",
    cell: (row) => (
      <span className="text-muted-foreground">{row.silentHours} घंटे पहले</span>
    ),
  },
  {
    id: "status",
    header: "स्थिति",
    align: "end",
    cell: (row) =>
      row.filedToday === 0 ? (
        <StatusBadge tone="danger">ख़ामोश</StatusBadge>
      ) : row.filedToday < 2 ? (
        <StatusBadge tone="warning">कम कवरेज</StatusBadge>
      ) : (
        <StatusBadge tone="success">ठीक</StatusBadge>
      ),
  },
];

export default async function CoveragePage() {
  const user = await requireUser();
  const chrome = shellChrome(user);

  const stateSlug =
    user.scope.kind === "state" ? (user.scope.values?.[0] ?? "bihar") : "bihar";
  const state = states.find((entry) => entry.slug === stateSlug) ?? states[0];
  const districts = coverageGaps(state.slug);
  const rows: Row[] = districts.map((district) => ({
    id: district.slug,
    name: district.name,
    filedToday: district.filedToday,
    silentHours: district.silentHours,
  }));
  const silent = rows.filter((row) => row.filedToday === 0);

  return (
    <AdminShell user={user} title="कवरेज" {...chrome}>
      <div className="space-y-5">
        <PageHeader
          title={`${state.name} — कवरेज`}
          description="जिन ज़िलों से आज कोई ख़बर नहीं आई, वे सबसे ऊपर हैं।"
          backHref="/admin"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <KpiCard
            label="ख़ामोश ज़िले"
            value={silent.length}
            icon={MapsLocation01Icon}
            tone={silent.length > 0 ? "red" : "emerald"}
          />
          <KpiCard
            label="कुल ज़िले"
            value={rows.length}
            icon={MapsLocation01Icon}
            tone="slate"
          />
          <KpiCard
            label="आज की कुल ख़बरें"
            value={rows.reduce((sum, row) => sum + row.filedToday, 0)}
            icon={MapsLocation01Icon}
            tone="blue"
          />
        </div>

        <DataTable
          columns={columns}
          rows={[...rows].sort((a, b) => a.filedToday - b.filedToday)}
          empty={{
            icon: MapsLocation01Icon,
            title: "इस राज्य में कोई ज़िला दर्ज नहीं",
            description: "टैक्सोनॉमी में ज़िले जोड़ें।",
          }}
        />

        <Panel title="यह सूची क्यों">
          <p className="text-sm leading-relaxed text-muted-foreground">
            ज़िला स्तर की ख़बर ही हिंदी पोर्टल को स्थानीय बनाती है। जो ज़िला 48 घंटे
            ख़ामोश है, वहां या तो स्ट्रिंगर निष्क्रिय है या उसे भुगतान नहीं मिला —
            दोनों का हल इसी पैनल से होता है।
          </p>
        </Panel>
      </div>
    </AdminShell>
  );
}
