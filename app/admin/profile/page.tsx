import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { HugeiconsIcon, Shield01Icon } from "@/components/admin/icons";
import { PageHeader, Panel } from "@/components/admin/ui/page-parts";
import { AdminButton, StatusBadge } from "@/components/admin/ui/primitives";
import { requireUser, shellChrome } from "@/lib/admin/guard";
import { permissionsOf, ROLE_META, scopeLabel } from "@/lib/admin/rbac";

/** My account — role, scope, the exact permissions it grants, and MFA status. */

export const metadata: Metadata = { title: "मेरा प्रोफ़ाइल" };

export default async function AdminProfilePage() {
  const user = await requireUser();
  const chrome = shellChrome(user);
  const meta = ROLE_META[user.role];
  const permissions = permissionsOf(user.role);

  return (
    <AdminShell user={user} title="मेरा प्रोफ़ाइल" {...chrome}>
      <div className="space-y-5">
        <PageHeader
          title={user.name}
          description={`${meta.hindi} · ${meta.label}`}
          backHref="/admin"
          action={
            <form action="/api/admin/logout" method="post">
              <AdminButton type="submit" variant="outline">
                लॉग आउट
              </AdminButton>
            </form>
          }
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title="खाता" className="lg:col-span-2">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">ईमेल</dt>
                <dd className="font-ui text-sm">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">रोल</dt>
                <dd className="text-sm">{meta.hindi}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">स्कोप</dt>
                <dd className="text-sm">{scopeLabel(user.scope)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">सत्र</dt>
                <dd className="text-sm">12 घंटे</dd>
              </div>
            </dl>
          </Panel>

          <Panel title="सुरक्षा">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-red-600 dark:text-red-400">
                <HugeiconsIcon icon={Shield01Icon} size={18} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-medium">दो-स्तरीय सत्यापन (MFA)</p>
                <StatusBadge tone="danger" className="mt-1">
                  अभी लागू नहीं
                </StatusBadge>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  संपादक और एडमिन रोल के लिए MFA अनिवार्य है। यह CMS माइलस्टोन में जुड़ेगा
                  और तब तक <code className="font-ui">docs/known-gaps.md</code> में 🔴 के
                  रूप में दर्ज है।
                </p>
              </div>
            </div>
          </Panel>
        </div>

        <Panel title={`इस रोल की अनुमतियां (${permissions.length})`}>
          <ul className="flex flex-wrap gap-2">
            {permissions.map((permission) => (
              <li key={permission}>
                <StatusBadge tone="neutral">
                  <code className="font-ui">{permission}</code>
                </StatusBadge>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            हर अनुरोध पर अनुमति और स्कोप दोनों सर्वर पर जांचे जाते हैं। मेन्यू में लिंक
            छिपाना कभी भी सुरक्षा नहीं है।
          </p>
        </Panel>
      </div>
    </AdminShell>
  );
}
