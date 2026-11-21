import { redirect } from "next/navigation";

import { MOCK_NOW_ISO } from "@/lib/data/clock";
import { hindiLongDate } from "@/lib/format/hindiDate";
import {
  grievanceQueueCount,
  reviewQueueCount,
} from "@/lib/admin/newsroom";
import { currentUser } from "@/lib/admin/session";
import { allow, type AdminUser, type Permission } from "@/lib/admin/rbac";

/**
 * Server-side gate for every admin page.
 *
 * Calling `requireUser()` is what authorises a screen — the sidebar hiding a
 * link never is (global admin rule). `requirePermission()` adds the permission
 * check; record-level scope is checked at the query, with `allow()`.
 */

export async function requireUser(): Promise<AdminUser> {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requirePermission(
  permission: Permission,
): Promise<AdminUser> {
  const user = await requireUser();
  if (!allow(user, permission)) redirect("/admin?denied=1");
  return user;
}

/** Shell props every admin page passes down. */
export function shellChrome(user: AdminUser) {
  return {
    today: hindiLongDate(MOCK_NOW_ISO),
    year: new Date(MOCK_NOW_ISO).getUTCFullYear(),
    badges: {
      review: ["desk_editor", "sub_editor", "editor_in_chief", "bureau_chief"].includes(
        user.role,
      )
        ? reviewQueueCount()
        : 0,
      grievance: ["grievance", "editor_in_chief"].includes(user.role)
        ? grievanceQueueCount()
        : 0,
      notifications: 0,
    },
  };
}
