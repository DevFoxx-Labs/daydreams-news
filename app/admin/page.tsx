import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  BureauDashboard,
  DeskDashboard,
  EditorDashboard,
  GrievanceDashboard,
  PlannedDashboard,
  ReporterDashboard,
  StringerDashboard,
  SystemDashboard,
} from "@/components/admin/dashboards";
import { PageHeader } from "@/components/admin/ui/page-parts";
import { AdminButton } from "@/components/admin/ui/primitives";
import { requireUser, shellChrome } from "@/lib/admin/guard";
import { can, ROLE_META, type AdminUser } from "@/lib/admin/rbac";
import Link from "next/link";

/** The role's home screen — `docs/ROLES_AND_DASHBOARDS.md` §7. */

export const metadata: Metadata = {
  title: "डैशबोर्ड",
};

/**
 * Every panel screen is personal: the role decides the whole page, so there is
 * no useful static shell to prerender and the route is allowed to block while
 * the session is verified. The admin layout declares this too, but Cache
 * Components validates each page segment on its own.
 */
export const instant = false;

function dashboardFor(user: AdminUser) {
  switch (user.role) {
    case "desk_editor":
    case "sub_editor":
      return <DeskDashboard />;
    case "editor_in_chief":
      return <EditorDashboard />;
    case "reporter":
      return <ReporterDashboard user={user} />;
    case "stringer":
      return <StringerDashboard />;
    case "bureau_chief":
      return <BureauDashboard user={user} />;
    case "grievance":
      return <GrievanceDashboard />;
    case "admin":
      return <SystemDashboard />;
    default:
      return <PlannedDashboard user={user} />;
  }
}

/** The one primary action each role gets (skill §5: one primary button). */
function primaryAction(user: AdminUser) {
  if (can(user, "story.breaking")) {
    return (
      <AdminButton asChild variant="brand">
        <Link href="/admin/stories?status=queue">समीक्षा कतार खोलें</Link>
      </AdminButton>
    );
  }
  if (user.role === "stringer") {
    return (
      <AdminButton asChild variant="brand">
        <Link href="/admin/earnings">कमाई देखें</Link>
      </AdminButton>
    );
  }
  if (user.role === "grievance") {
    return (
      <AdminButton asChild variant="brand">
        <Link href="/admin/grievances">शिकायत कतार</Link>
      </AdminButton>
    );
  }
  if (can(user, "story.create")) {
    return (
      <AdminButton asChild variant="brand">
        <Link href="/admin/stories">मेरी ख़बरें</Link>
      </AdminButton>
    );
  }
  return null;
}

export default async function AdminHomePage() {
  const user = await requireUser();
  const chrome = shellChrome(user);
  const meta = ROLE_META[user.role];

  return (
    <AdminShell user={user} title="डैशबोर्ड" {...chrome}>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title={`नमस्ते, ${user.name.split(" ")[0]}`}
          description={meta.subtitle}
          action={primaryAction(user)}
        />
        {dashboardFor(user)}
      </div>
    </AdminShell>
  );
}
