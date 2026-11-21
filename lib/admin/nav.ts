import {
  Album02Icon,
  Alert02Icon,
  Analytics01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  CookieIcon,
  Database01Icon,
  FlashIcon,
  Image01Icon,
  InboxIcon,
  Invoice01Icon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  Legal01Icon,
  LiveStreaming01Icon,
  Location01Icon,
  Mail01Icon,
  MapsLocation01Icon,
  Megaphone01Icon,
  Money01Icon,
  NewsIcon,
  NoteEditIcon,
  Notification03Icon,
  PencilEdit01Icon,
  Settings02Icon,
  Shield01Icon,
  Tag01Icon,
  Target01Icon,
  Task01Icon,
  TaskDone01Icon,
  UserMultipleIcon,
  UserShield01Icon,
  Video01Icon,
  Wallet01Icon,
} from "@/components/admin/icons";
import type { Role } from "@/lib/admin/rbac";

/**
 * Navigation is data — `admin-panel-design` skill §4.
 *
 * Item shapes: leaf (`label` + `href`), section divider (`type: "section"`),
 * or a collapsible group (`children`). Two levels maximum.
 * Order: dashboard first, then the role's day, then notifications/settings.
 *
 * A `href` that isn't in `IMPLEMENTED_ROUTES` renders as a non-linked button,
 * so the full menu can be reviewed while the screens land one by one.
 */

type IconType = typeof LayoutDashboardIcon;

export type NavLeafItem = {
  label: string;
  icon: IconType;
  href: string;
  badge?: "review" | "grievance" | "notifications";
};

export type NavSection = { type: "section"; label: string };

export type NavGroupItem = {
  label: string;
  icon: IconType;
  children: NavLeafItem[];
};

export type NavItem = NavLeafItem | NavSection | NavGroupItem;

export function isSection(item: NavItem): item is NavSection {
  return "type" in item && item.type === "section";
}

export function isGroup(item: NavItem): item is NavGroupItem {
  return "children" in item;
}

/** Screens that exist today. Everything else is shown but not linked. */
export const IMPLEMENTED_ROUTES = new Set<string>([
  "/admin",
  "/admin/stories",
  "/admin/coverage",
  "/admin/earnings",
  "/admin/grievances",
  "/admin/users",
  "/admin/audit",
  "/admin/profile",
]);

const DASHBOARD: NavLeafItem = {
  label: "डैशबोर्ड",
  icon: LayoutDashboardIcon,
  href: "/admin",
};

const ACCOUNT_TAIL: NavItem[] = [
  { type: "section", label: "खाता" },
  {
    label: "नोटिफ़िकेशन",
    icon: Notification03Icon,
    href: "/admin/notifications",
    badge: "notifications",
  },
  { label: "मेरा प्रोफ़ाइल", icon: Settings02Icon, href: "/admin/profile" },
];

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  editor_in_chief: [
    DASHBOARD,
    { type: "section", label: "न्यूज़रूम" },
    {
      label: "ख़बरें",
      icon: NewsIcon,
      children: [
        { label: "समीक्षा कतार", icon: TaskDone01Icon, href: "/admin/stories", badge: "review" },
        { label: "शेड्यूल", icon: Clock01Icon, href: "/admin/stories?status=scheduled" },
        { label: "प्रकाशित", icon: CheckmarkCircle02Icon, href: "/admin/stories?status=published" },
        { label: "स्पाइक्ड", icon: Alert02Icon, href: "/admin/stories?status=spiked" },
      ],
    },
    { label: "ब्रेकिंग", icon: FlashIcon, href: "/admin/breaking" },
    { label: "होम पेज क्यूरेशन", icon: LayoutTemplateIcon, href: "/admin/curation" },
    { label: "लाइव ब्लॉग", icon: LiveStreaming01Icon, href: "/admin/live" },
    { label: "असाइनमेंट", icon: Task01Icon, href: "/admin/assignments" },
    { label: "सुधार", icon: NoteEditIcon, href: "/admin/corrections" },
    { type: "section", label: "टीम और कवरेज" },
    { label: "कवरेज मैप", icon: MapsLocation01Icon, href: "/admin/coverage" },
    { label: "टीम", icon: UserMultipleIcon, href: "/admin/users" },
    { label: "एनालिटिक्स", icon: Analytics01Icon, href: "/admin/analytics" },
    { type: "section", label: "निगरानी" },
    { label: "शिकायतें", icon: Legal01Icon, href: "/admin/grievances", badge: "grievance" },
    { label: "ऑडिट लॉग", icon: Shield01Icon, href: "/admin/audit" },
    ...ACCOUNT_TAIL,
  ],

  desk_editor: [
    DASHBOARD,
    { type: "section", label: "मेरी शिफ़्ट" },
    { label: "समीक्षा कतार", icon: TaskDone01Icon, href: "/admin/stories", badge: "review" },
    { label: "ब्रेकिंग", icon: FlashIcon, href: "/admin/breaking" },
    { label: "होम पेज क्यूरेशन", icon: LayoutTemplateIcon, href: "/admin/curation" },
    { label: "ब्रेकिंग टिकर", icon: Megaphone01Icon, href: "/admin/ticker" },
    { label: "लाइव ब्लॉग", icon: LiveStreaming01Icon, href: "/admin/live" },
    { type: "section", label: "कंटेंट" },
    {
      label: "ख़बरें",
      icon: NewsIcon,
      children: [
        { label: "सभी ख़बरें", icon: NewsIcon, href: "/admin/stories?status=all" },
        { label: "शेड्यूल", icon: Clock01Icon, href: "/admin/stories?status=scheduled" },
        { label: "प्रकाशित", icon: CheckmarkCircle02Icon, href: "/admin/stories?status=published" },
      ],
    },
    { label: "असाइनमेंट", icon: Task01Icon, href: "/admin/assignments" },
    { label: "मीडिया", icon: Image01Icon, href: "/admin/media" },
    { label: "टैग", icon: Tag01Icon, href: "/admin/tags" },
    { type: "section", label: "वितरण" },
    { label: "पुश और सोशल", icon: Megaphone01Icon, href: "/admin/distribution" },
    { label: "न्यूज़लेटर", icon: Mail01Icon, href: "/admin/newsletter" },
    ...ACCOUNT_TAIL,
  ],

  sub_editor: [
    DASHBOARD,
    { type: "section", label: "कॉपी डेस्क" },
    { label: "समीक्षा कतार", icon: TaskDone01Icon, href: "/admin/stories", badge: "review" },
    { label: "मीडिया", icon: Image01Icon, href: "/admin/media" },
    { label: "टैग", icon: Tag01Icon, href: "/admin/tags" },
    ...ACCOUNT_TAIL,
  ],

  reporter: [
    DASHBOARD,
    { type: "section", label: "मेरा काम" },
    { label: "मेरे असाइनमेंट", icon: Task01Icon, href: "/admin/assignments" },
    { label: "मेरी ख़बरें", icon: NewsIcon, href: "/admin/stories" },
    { label: "नई ख़बर", icon: PencilEdit01Icon, href: "/admin/stories/new" },
    { type: "section", label: "प्रदर्शन" },
    { label: "मेरा स्कोरकार्ड", icon: Analytics01Icon, href: "/admin/analytics" },
    ...ACCOUNT_TAIL,
  ],

  stringer: [
    DASHBOARD,
    { type: "section", label: "मेरा काम" },
    { label: "ख़बर भेजें", icon: PencilEdit01Icon, href: "/admin/stories/new" },
    { label: "मेरी भेजी ख़बरें", icon: InboxIcon, href: "/admin/stories" },
    { type: "section", label: "भुगतान" },
    { label: "इस महीने की कमाई", icon: Wallet01Icon, href: "/admin/earnings" },
    { label: "दस्तावेज़", icon: Invoice01Icon, href: "/admin/documents" },
    ...ACCOUNT_TAIL,
  ],

  bureau_chief: [
    DASHBOARD,
    { type: "section", label: "मेरा राज्य" },
    { label: "कवरेज मैप", icon: MapsLocation01Icon, href: "/admin/coverage" },
    { label: "समीक्षा कतार", icon: TaskDone01Icon, href: "/admin/stories", badge: "review" },
    { label: "असाइनमेंट", icon: Task01Icon, href: "/admin/assignments" },
    { type: "section", label: "स्ट्रिंगर नेटवर्क" },
    { label: "स्ट्रिंगर", icon: UserMultipleIcon, href: "/admin/users" },
    { label: "पेआउट सिफ़ारिश", icon: Wallet01Icon, href: "/admin/earnings" },
    { label: "बजट", icon: Money01Icon, href: "/admin/budget" },
    ...ACCOUNT_TAIL,
  ],

  photo_video: [
    DASHBOARD,
    { type: "section", label: "मीडिया" },
    { label: "क्यूसी कतार", icon: Image01Icon, href: "/admin/media" },
    { label: "वीडियो पाइपलाइन", icon: Video01Icon, href: "/admin/video" },
    { label: "लाइसेंस", icon: Legal01Icon, href: "/admin/licences" },
    ...ACCOUNT_TAIL,
  ],

  social: [
    DASHBOARD,
    { type: "section", label: "वितरण" },
    { label: "शेड्यूल", icon: Clock01Icon, href: "/admin/distribution" },
    { label: "पुश नोटिफ़िकेशन", icon: Megaphone01Icon, href: "/admin/push" },
    { label: "वेब स्टोरीज़", icon: Album02Icon, href: "/admin/web-stories" },
    { label: "न्यूज़लेटर", icon: Mail01Icon, href: "/admin/newsletter" },
    ...ACCOUNT_TAIL,
  ],

  seo: [
    DASHBOARD,
    { type: "section", label: "सर्च" },
    { label: "परफ़ॉर्मेंस", icon: Analytics01Icon, href: "/admin/analytics" },
    { label: "रिफ़्रेश कतार", icon: Target01Icon, href: "/admin/refresh-queue" },
    { label: "रीडायरेक्ट", icon: Database01Icon, href: "/admin/redirects" },
    ...ACCOUNT_TAIL,
  ],

  ad_sales: [
    DASHBOARD,
    { type: "section", label: "बिक्री" },
    { label: "पाइपलाइन", icon: Target01Icon, href: "/admin/pipeline" },
    { label: "इन्वेंटरी", icon: LayoutTemplateIcon, href: "/admin/inventory" },
    { label: "इनवॉइस", icon: Invoice01Icon, href: "/admin/invoices" },
    ...ACCOUNT_TAIL,
  ],

  ad_ops: [
    DASHBOARD,
    { type: "section", label: "ऑपरेशन" },
    { label: "क्रिएटिव क्यूसी", icon: Image01Icon, href: "/admin/creatives" },
    { label: "कैंपेन", icon: Megaphone01Icon, href: "/admin/campaigns" },
    { label: "स्लॉट", icon: LayoutTemplateIcon, href: "/admin/inventory" },
    ...ACCOUNT_TAIL,
  ],

  finance: [
    DASHBOARD,
    { type: "section", label: "पैसा" },
    { label: "स्ट्रिंगर पेआउट", icon: Wallet01Icon, href: "/admin/earnings" },
    { label: "वसूली", icon: Money01Icon, href: "/admin/receivables" },
    { label: "इनवॉइस", icon: Invoice01Icon, href: "/admin/invoices" },
    ...ACCOUNT_TAIL,
  ],

  admin: [
    DASHBOARD,
    { type: "section", label: "सिस्टम" },
    { label: "यूज़र और रोल", icon: UserShield01Icon, href: "/admin/users" },
    { label: "ऑडिट लॉग", icon: Shield01Icon, href: "/admin/audit" },
    {
      label: "इंटीग्रेशन",
      icon: Database01Icon,
      children: [
        { label: "सेवाएं", icon: Database01Icon, href: "/admin/integrations" },
        { label: "फ़ीचर फ़्लैग", icon: Settings02Icon, href: "/admin/flags" },
        { label: "कैश और रीवैलिडेशन", icon: Clock01Icon, href: "/admin/cache" },
      ],
    },
    { label: "सेटिंग्स", icon: Settings02Icon, href: "/admin/settings" },
    ...ACCOUNT_TAIL,
  ],

  grievance: [
    DASHBOARD,
    { type: "section", label: "शिकायत निवारण" },
    { label: "शिकायत कतार", icon: Legal01Icon, href: "/admin/grievances", badge: "grievance" },
    { label: "अधिकार अनुरोध", icon: UserShield01Icon, href: "/admin/grievances?type=rights" },
    { label: "सुधार लॉग", icon: NoteEditIcon, href: "/admin/corrections" },
    { type: "section", label: "डेटा सुरक्षा" },
    { label: "सहमति रिकॉर्ड", icon: CookieIcon, href: "/admin/consent" },
    { label: "नोटिस संस्करण", icon: Legal01Icon, href: "/admin/notices" },
    { label: "ऑडिट लॉग", icon: Shield01Icon, href: "/admin/audit" },
    ...ACCOUNT_TAIL,
  ],
};

/** Icon used for a mobile tab, inferred from the section label. */
export function sectionIcon(label: string): IconType {
  const key = label.toLowerCase();
  if (key.includes("न्यूज़") || key.includes("कंटेंट")) return NewsIcon;
  if (key.includes("शिफ़्ट")) return FlashIcon;
  if (key.includes("काम")) return Task01Icon;
  if (key.includes("भुगतान") || key.includes("पैसा")) return Wallet01Icon;
  if (key.includes("राज्य") || key.includes("कवरेज")) return Location01Icon;
  if (key.includes("टीम")) return UserMultipleIcon;
  if (key.includes("निगरानी") || key.includes("सुरक्षा")) return Shield01Icon;
  if (key.includes("शिकायत")) return Legal01Icon;
  if (key.includes("सिस्टम")) return Database01Icon;
  if (key.includes("वितरण")) return Megaphone01Icon;
  if (key.includes("मीडिया")) return Image01Icon;
  if (key.includes("बिक्री") || key.includes("ऑपरेशन")) return Target01Icon;
  if (key.includes("खाता")) return Settings02Icon;
  return LayoutDashboardIcon;
}
