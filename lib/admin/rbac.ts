/**
 * Roles, permissions and scopes — `docs/ROLES_AND_DASHBOARDS.md` §3.
 *
 * A check is always **permission + scope + ownership**, evaluated on the server.
 * The sidebar hiding a link is never the authorization (admin-panel global rule).
 */

export const ROLES = [
  "editor_in_chief",
  "desk_editor",
  "sub_editor",
  "reporter",
  "stringer",
  "bureau_chief",
  "photo_video",
  "social",
  "seo",
  "ad_sales",
  "ad_ops",
  "finance",
  "admin",
  "grievance",
] as const;

export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "story.create",
  "story.edit.own",
  "story.edit.any",
  "story.publish",
  "story.breaking",
  "story.spike",
  "story.delete",
  "correction.add",
  "home.curate",
  "ticker.manage",
  "live.manage",
  "assignment.manage",
  "media.upload",
  "media.moderate",
  "seo.meta.edit",
  "redirect.manage",
  "push.send",
  "newsletter.send",
  "social.post",
  "analytics.view.own",
  "analytics.view.all",
  "ads.campaign.manage",
  "ads.creative.approve",
  "finance.view",
  "payout.approve",
  "stringer.manage",
  "user.manage",
  "settings.manage",
  "grievance.handle",
  "consent.ledger.view",
  "reader.pii.view",
  "audit.view",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/** How far a permission reaches. `own` = only records the user created. */
export type ScopeKind = "global" | "desk" | "state" | "district" | "own";

export type Scope = {
  kind: ScopeKind;
  /** Category slugs for `desk`, state slugs for `state`, city slugs for `district`. */
  values?: string[];
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  scope: Scope;
  avatarUrl?: string;
  /** Mandatory above reporter — see docs/known-gaps.md. */
  mfaEnabled: boolean;
};

export const ROLE_META: Record<
  Role,
  { label: string; hindi: string; color: string; subtitle: string; home: string }
> = {
  editor_in_chief: {
    label: "Editor-in-Chief",
    hindi: "प्रधान संपादक",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
    subtitle: "अभी क्या हो रहा है और आपके फ़ैसले का क्या इंतज़ार कर रहा है।",
    home: "/admin",
  },
  desk_editor: {
    label: "Desk Editor",
    hindi: "डेस्क एडिटर",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    subtitle: "समीक्षा कतार, होम पेज और ब्रेकिंग — आपकी शिफ़्ट का कंट्रोल रूम।",
    home: "/admin",
  },
  sub_editor: {
    label: "Sub-editor",
    hindi: "सब-एडिटर",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    subtitle: "कॉपी, हेडलाइन और SEO टाइटल।",
    home: "/admin",
  },
  reporter: {
    label: "Reporter",
    hindi: "रिपोर्टर",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    subtitle: "आपके असाइनमेंट, ड्राफ़्ट और ख़बरों का प्रदर्शन।",
    home: "/admin",
  },
  stringer: {
    label: "Stringer",
    hindi: "स्ट्रिंगर",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    subtitle: "ख़बर भेजें, स्थिति देखें और इस महीने की कमाई जानें।",
    home: "/admin",
  },
  bureau_chief: {
    label: "Bureau Chief",
    hindi: "ब्यूरो चीफ",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    subtitle: "आपके राज्य की कवरेज, स्ट्रिंगर और बजट।",
    home: "/admin",
  },
  photo_video: {
    label: "Photo & Video",
    hindi: "फ़ोटो-वीडियो डेस्क",
    color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    subtitle: "मीडिया क्यूसी, क्रेडिट और लाइसेंस।",
    home: "/admin",
  },
  social: {
    label: "Social Media",
    hindi: "सोशल मीडिया",
    color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    subtitle: "शेड्यूल, पुश और चैनल।",
    home: "/admin",
  },
  seo: {
    label: "SEO Analyst",
    hindi: "SEO एनालिस्ट",
    color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    subtitle: "सर्च, डिस्कवर और रिफ़्रेश कतार।",
    home: "/admin",
  },
  ad_sales: {
    label: "Ad Sales",
    hindi: "विज्ञापन बिक्री",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    subtitle: "पाइपलाइन, इन्वेंटरी और इनवॉइस।",
    home: "/admin",
  },
  ad_ops: {
    label: "Ad Ops",
    hindi: "ऐड ऑप्स",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    subtitle: "क्रिएटिव क्यूसी, डिलीवरी और स्लॉट।",
    home: "/admin",
  },
  finance: {
    label: "Finance",
    hindi: "लेखा",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    subtitle: "भुगतान, वसूली और स्ट्रिंगर पेआउट।",
    home: "/admin",
  },
  admin: {
    label: "System Admin",
    hindi: "सिस्टम एडमिन",
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    subtitle: "यूज़र, इंटीग्रेशन, फ़्लैग और ऑडिट।",
    home: "/admin",
  },
  grievance: {
    label: "Grievance / DPO",
    hindi: "शिकायत निवारण अधिकारी",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
    subtitle: "शिकायतें, अधिकार अनुरोध और सहमति रिकॉर्ड।",
    home: "/admin",
  },
};

/**
 * Permission bundles. Deliberately explicit rather than inherited: a reader of
 * this file can see exactly what a role can do without walking a hierarchy.
 */
const GRANTS: Record<Role, Permission[]> = {
  reporter: [
    "story.create",
    "story.edit.own",
    "media.upload",
    "analytics.view.own",
  ],
  stringer: [
    "story.create",
    "story.edit.own",
    "media.upload",
    "analytics.view.own",
  ],
  sub_editor: [
    "story.create",
    "story.edit.own",
    "story.edit.any",
    "story.publish",
    "media.upload",
    "seo.meta.edit",
    "analytics.view.own",
  ],
  desk_editor: [
    "story.create",
    "story.edit.own",
    "story.edit.any",
    "story.publish",
    "story.breaking",
    "story.spike",
    "correction.add",
    "home.curate",
    "ticker.manage",
    "live.manage",
    "assignment.manage",
    "media.upload",
    "media.moderate",
    "seo.meta.edit",
    "push.send",
    "newsletter.send",
    "social.post",
    "analytics.view.own",
    "analytics.view.all",
    "audit.view",
  ],
  bureau_chief: [
    "story.create",
    "story.edit.own",
    "story.edit.any",
    "story.publish",
    "story.breaking",
    "story.spike",
    "correction.add",
    "assignment.manage",
    "media.upload",
    "stringer.manage",
    "finance.view",
    "analytics.view.own",
    "analytics.view.all",
    "audit.view",
  ],
  editor_in_chief: [
    "story.create",
    "story.edit.own",
    "story.edit.any",
    "story.publish",
    "story.breaking",
    "story.spike",
    "story.delete",
    "correction.add",
    "home.curate",
    "ticker.manage",
    "live.manage",
    "assignment.manage",
    "media.upload",
    "media.moderate",
    "seo.meta.edit",
    "redirect.manage",
    "push.send",
    "newsletter.send",
    "social.post",
    "analytics.view.own",
    "analytics.view.all",
    "finance.view",
    "payout.approve",
    "stringer.manage",
    "user.manage",
    "audit.view",
  ],
  photo_video: [
    "media.upload",
    "media.moderate",
    "analytics.view.own",
  ],
  social: [
    "social.post",
    "push.send",
    "newsletter.send",
    "media.upload",
    "analytics.view.own",
    "analytics.view.all",
  ],
  seo: [
    "seo.meta.edit",
    "redirect.manage",
    "analytics.view.own",
    "analytics.view.all",
  ],
  ad_sales: ["ads.campaign.manage", "finance.view", "analytics.view.own"],
  ad_ops: [
    "ads.campaign.manage",
    "ads.creative.approve",
    "media.upload",
    "analytics.view.all",
  ],
  finance: ["finance.view", "payout.approve"],
  admin: [
    "user.manage",
    "settings.manage",
    "audit.view",
    "analytics.view.all",
    "reader.pii.view",
  ],
  grievance: [
    "grievance.handle",
    "consent.ledger.view",
    "reader.pii.view",
    "correction.add",
    "story.spike",
    "audit.view",
  ],
};

/** Permissions that must be audited and alerted when used (report §3.2 ⚠). */
export const SENSITIVE_PERMISSIONS: Permission[] = [
  "story.breaking",
  "story.delete",
  "push.send",
  "payout.approve",
  "user.manage",
  "settings.manage",
  "reader.pii.view",
];

export function can(user: AdminUser | null, permission: Permission): boolean {
  if (!user) return false;
  return GRANTS[user.role]?.includes(permission) ?? false;
}

export function permissionsOf(role: Role): Permission[] {
  return GRANTS[role] ?? [];
}

/**
 * Scope check. A `global` scope passes everything; otherwise the record's
 * state/category/owner must be inside the user's scope values.
 */
export function inScope(
  user: AdminUser | null,
  record: { state?: string; category?: string; city?: string; ownerId?: string },
): boolean {
  if (!user) return false;
  const { kind, values = [] } = user.scope;

  switch (kind) {
    case "global":
      return true;
    case "desk":
      return Boolean(record.category && values.includes(record.category));
    case "state":
      return Boolean(record.state && values.includes(record.state));
    case "district":
      return Boolean(record.city && values.includes(record.city));
    case "own":
      return record.ownerId === user.id;
    default:
      return false;
  }
}

/** The full gate: permission **and** scope. Use this, not `can()` alone. */
export function allow(
  user: AdminUser | null,
  permission: Permission,
  record?: { state?: string; category?: string; city?: string; ownerId?: string },
): boolean {
  if (!can(user, permission)) return false;
  if (!record) return true;
  return inScope(user, record);
}

export function scopeLabel(scope: Scope): string {
  if (scope.kind === "global") return "पूरा संस्थान";
  if (scope.kind === "own") return "सिर्फ़ अपनी ख़बरें";
  return `${scope.values?.join(", ") ?? ""}`;
}
