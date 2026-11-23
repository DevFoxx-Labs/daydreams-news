import type { Metadata } from "next";

import { site } from "@/lib/site";

/**
 * Admin route group.
 *
 * Only the document-level concerns live here: the panel is `noindex` (global
 * admin rule) and the theme class is applied before paint so switching to dark
 * never flashes. The visible chrome is `<AdminShell>`, composed per page so
 * each page can pass its own title and badge counts.
 */

export const metadata: Metadata = {
  title: {
    default: "न्यूज़रूम पैनल",
    template: `%s · ${site.name} न्यूज़रूम`,
  },
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Every screen here is personal: it reads the session cookie and renders what
 * *this* user may see. There is no static shell worth prerendering, and a
 * panel that streamed a generic frame first would be misleading. So the
 * segment is allowed to block — the documented escape hatch for authenticated
 * routes under Cache Components.
 */
export const instant = false;

const THEME_SCRIPT = `
try {
  var t = localStorage.getItem('ks-admin-theme');
  if (t === 'dark') document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      {children}
    </>
  );
}
