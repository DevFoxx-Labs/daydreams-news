"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";


import {
  ArrowDown01Icon,
  Calendar01Icon,
  HugeiconsIcon,
  LayoutDashboardIcon,
  Logout01Icon,
  Moon02Icon,
  Notification03Icon,
  PanelLeftIcon,
  Settings02Icon,
  Sun01Icon,
  UserIcon,
} from "@/components/admin/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/admin/ui/tooltip";
import {
  IMPLEMENTED_ROUTES,
  isGroup,
  isSection,
  NAV_CONFIG,
  sectionIcon,
  type NavGroupItem,
  type NavItem,
  type NavLeafItem,
} from "@/lib/admin/nav";
import { ROLE_META, type AdminUser } from "@/lib/admin/rbac";
import {
  adminSidebarStore,
  adminThemeStore,
  setAdminTheme,
  setSidebarCollapsed,
} from "@/lib/admin/ui-store";
import { useClientStore } from "@/lib/client-store";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Admin shell — `admin-panel-design` skill §3.
 *
 * Dark sidebar in both themes, collapsible to 56px with tooltips, sticky
 * topbar, and a mobile bottom tab bar built from the same nav config.
 * Client component: it needs the pathname, localStorage and collapse state.
 */

export type BadgeCounts = {
  review?: number;
  grievance?: number;
  notifications?: number;
};

type ShellProps = {
  user: AdminUser;
  title: string;
  badges?: BadgeCounts;
  /** Formatted on the server so the shell stays deterministic. */
  today: string;
  year: number;
  children: React.ReactNode;
};

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => {
    const path = href.split("?")[0];
    if (path === "/admin") return pathname === "/admin";
    return pathname === path || pathname.startsWith(`${path}/`);
  };
}

function countFor(item: NavLeafItem, badges: BadgeCounts): number {
  if (!item.badge) return 0;
  return badges[item.badge] ?? 0;
}

function ThemeToggle({
  isDark,
  onToggle,
}: {
  isDark: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <HugeiconsIcon
        icon={Sun01Icon}
        size={14}
        className="text-sidebar-foreground/70"
        aria-hidden
      />
      <button
        onClick={onToggle}
        role="switch"
        aria-checked={isDark}
        aria-label="डार्क मोड बदलें"
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isDark ? "bg-slate-500" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform",
            isDark ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </button>
      <HugeiconsIcon
        icon={Moon02Icon}
        size={14}
        className="text-sidebar-foreground/70"
        aria-hidden
      />
    </div>
  );
}

function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="my-2 border-t border-sidebar-border" />;
  return (
    <p className="mb-1 mt-3 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 first:mt-1">
      {label}
    </p>
  );
}

function NavBadge({ count, overlay = false }: { count: number; overlay?: boolean }) {
  if (count <= 0) return null;
  if (overlay) {
    return (
      <span className="absolute -right-1 -top-1 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold leading-none text-white">
        {count > 9 ? "9+" : count}
      </span>
    );
  }
  return (
    <span className="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function NavLeaf({
  item,
  collapsed = false,
  nested = false,
  badges,
}: {
  item: NavLeafItem;
  collapsed?: boolean;
  nested?: boolean;
  badges: BadgeCounts;
}) {
  const isActive = useIsActive()(item.href);
  const count = countFor(item, badges);
  const available = IMPLEMENTED_ROUTES.has(item.href.split("?")[0]);

  const cls = cn(
    "flex w-full items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    nested
      ? "gap-2 rounded-md px-2 py-[5px] text-[13px]"
      : collapsed
        ? "mb-0.5 justify-center rounded-md p-2 text-sm"
        : "mb-0.5 gap-2.5 rounded-md px-2.5 py-[7px] text-sm",
    isActive
      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    !available && "cursor-default opacity-55 hover:bg-transparent",
  );

  const iconSize = nested ? 14 : 16;

  const inner =
    collapsed && !nested ? (
      <span className="relative">
        <HugeiconsIcon icon={item.icon} size={iconSize} aria-hidden />
        <NavBadge count={count} overlay />
      </span>
    ) : (
      <>
        <HugeiconsIcon icon={item.icon} size={iconSize} className="shrink-0" aria-hidden />
        <span className="flex-1 truncate text-left">{item.label}</span>
        <NavBadge count={count} />
      </>
    );

  // A screen that doesn't exist yet is shown but not linked (skill §4).
  const element = available ? (
    <Link href={item.href} className={cls} aria-current={isActive ? "page" : undefined}>
      {inner}
    </Link>
  ) : (
    <button type="button" className={cls} aria-disabled="true" title="जल्द आ रहा है">
      {inner}
    </button>
  );

  if (!collapsed || nested) return element;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{element}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

function NavGroup({
  item,
  collapsed,
  badges,
  onExpandSidebar,
}: {
  item: NavGroupItem;
  collapsed: boolean;
  badges: BadgeCounts;
  onExpandSidebar: () => void;
}) {
  const isActive = useIsActive();
  const hasActiveChild = item.children.some((child) => isActive(child.href));
  const [open, setOpen] = useState(hasActiveChild);

  function toggle() {
    if (collapsed) {
      onExpandSidebar();
      setOpen(true);
    } else {
      setOpen((value) => !value);
    }
  }

  const btnCls = cn(
    "mb-0.5 flex w-full cursor-pointer items-center rounded-md text-sm transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    collapsed ? "justify-center p-2" : "gap-2.5 px-2.5 py-[7px]",
    hasActiveChild
      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  );

  const button = (
    <button
      type="button"
      className={btnCls}
      onClick={toggle}
      aria-expanded={collapsed ? undefined : open}
    >
      <HugeiconsIcon icon={item.icon} size={16} className="shrink-0" aria-hidden />
      {!collapsed ? (
        <>
          <span className="flex-1 truncate text-left">{item.label}</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={14}
            className={cn(
              "shrink-0 text-sidebar-foreground/40 transition-transform duration-150",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </>
      ) : null}
    </button>
  );

  return (
    <div>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {item.label}
          </TooltipContent>
        </Tooltip>
      ) : (
        button
      )}

      {!collapsed && open ? (
        <div className="mb-1 ml-3.5 space-y-0.5 border-l border-sidebar-border pl-2.5">
          {item.children.map((child) => (
            <NavLeaf key={child.href} item={child} badges={badges} nested />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function NavNode({
  item,
  collapsed,
  badges,
  onExpandSidebar,
}: {
  item: NavItem;
  collapsed: boolean;
  badges: BadgeCounts;
  onExpandSidebar: () => void;
}) {
  if (isSection(item)) return <SectionLabel label={item.label} collapsed={collapsed} />;
  if (isGroup(item)) {
    return (
      <NavGroup
        item={item}
        collapsed={collapsed}
        badges={badges}
        onExpandSidebar={onExpandSidebar}
      />
    );
  }
  return <NavLeaf item={item} collapsed={collapsed} badges={badges} />;
}

/** Mobile bottom tabs, derived from the section dividers (skill §6). */
function MobileNav({
  items,
  badges,
}: {
  items: NavItem[];
  badges: BadgeCounts;
}) {
  const isActive = useIsActive();
  const navRef = useRef<HTMLDivElement>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const groups: { id: string; label: string; icon: typeof LayoutDashboardIcon; items: NavLeafItem[] }[] =
    [];
  let current = {
    id: "dashboard",
    label: "डैशबोर्ड",
    icon: LayoutDashboardIcon,
    items: [] as NavLeafItem[],
  };

  for (const item of items) {
    if (isSection(item)) {
      if (current.items.length > 0) groups.push(current);
      current = {
        id: item.label,
        label: item.label,
        icon: sectionIcon(item.label),
        items: [],
      };
    } else if (isGroup(item)) {
      current.items.push(...item.children);
    } else {
      current.items.push(item);
    }
  }
  if (current.items.length > 0) groups.push(current);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveGroup(null);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const openGroup = groups.find((group) => group.id === activeGroup);

  return (
    <div
      ref={navRef}
      className="flex flex-col border-t border-border bg-card shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden"
    >
      {openGroup && openGroup.items.length > 0 ? (
        <div className="max-h-[50vh] overflow-y-auto border-b border-border bg-muted/20 px-4 py-3 shadow-inner">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {openGroup.label}
          </p>
          <div className="space-y-1">
            {openGroup.items.map((item) => {
              const available = IMPLEMENTED_ROUTES.has(item.href.split("?")[0]);
              const cls = cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive(item.href)
                  ? "bg-brand/10 font-medium text-brand"
                  : "text-foreground hover:bg-accent",
                !available && "opacity-55",
              );
              const content = (
                <>
                  <HugeiconsIcon icon={item.icon} size={16} className="shrink-0" aria-hidden />
                  <span className="flex-1 text-left">{item.label}</span>
                  <NavBadge count={countFor(item, badges)} />
                </>
              );
              return available ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cls}
                  onClick={() => setActiveGroup(null)}
                >
                  {content}
                </Link>
              ) : (
                <button key={item.href} type="button" className={cls} aria-disabled="true">
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between bg-card px-1">
        {groups.slice(0, 5).map((group) => {
          const childActive = group.items.some((item) => isActive(item.href));
          const open = activeGroup === group.id;
          const single = group.items.length === 1 && group.id === "dashboard";

          if (single) {
            return (
              <Link
                key={group.id}
                href={group.items[0].href}
                onClick={() => setActiveGroup(null)}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 py-2",
                  childActive ? "text-brand" : "text-muted-foreground",
                )}
              >
                <HugeiconsIcon icon={group.icon} size={20} aria-hidden />
                <span className="w-full truncate px-1 text-center text-[10px] font-medium">
                  {group.label}
                </span>
              </Link>
            );
          }

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveGroup(open ? null : group.id)}
              aria-expanded={open}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2",
                open || childActive ? "text-brand" : "text-muted-foreground",
              )}
            >
              <HugeiconsIcon icon={group.icon} size={20} aria-hidden />
              <span className="w-full truncate px-1 text-center text-[10px] font-medium">
                {group.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AdminShell({
  user,
  title,
  badges = {},
  today,
  year,
  children,
}: ShellProps) {
  const meta = ROLE_META[user.role];
  const items = NAV_CONFIG[user.role];
  const initials = user.name.slice(0, 2);

  // Persisted chrome preferences, read without an effect (see ui-store.ts).
  const isDark = useClientStore(adminThemeStore);
  const collapsed = useClientStore(adminSidebarStore);

  const toggleTheme = () => setAdminTheme(!isDark);
  const toggleSidebar = () => setSidebarCollapsed(!collapsed);
  const expandSidebar = () => setSidebarCollapsed(false);

  const notifications = badges.notifications ?? 0;

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex min-h-screen flex-col bg-background text-foreground md:flex-row">
        {/* ── Sidebar (desktop) ───────────────────────────────── */}
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex",
            "transition-[width] duration-200 ease-in-out",
            collapsed ? "w-14" : "w-56",
          )}
          aria-label="मुख्य नेविगेशन"
        >
          <div className={cn("flex items-center justify-center py-[13px]", collapsed ? "px-3" : "px-4")}>
            <Link href="/" className="flex shrink-0 items-center gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-[6px] bg-brand text-[20px] font-extrabold leading-none text-white">
                <span className="translate-y-[-1px]">{site.mark}</span>
              </span>
              {!collapsed ? (
                <span className="text-[17px] font-extrabold tracking-[-0.3px] text-white">
                  {site.name}
                </span>
              ) : null}
            </Link>
          </div>

          <nav
            className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2"
            aria-label="साइडबार नेविगेशन"
          >
            {items.map((item, index) => (
              <NavNode
                key={`${isSection(item) ? "section" : "item"}-${item.label}-${index}`}
                item={item}
                collapsed={collapsed}
                badges={badges}
                onExpandSidebar={expandSidebar}
              />
            ))}
          </nav>

          <div className="space-y-2.5 px-3 py-3">
            {!collapsed ? (
              <div className="rounded-lg border border-sidebar-border px-2.5 py-2">
                <p className="text-[11px] font-semibold text-sidebar-foreground/90">
                  {meta.hindi}
                </p>
                <p className="mt-0.5 text-[10px] text-sidebar-foreground/50">
                  {meta.label}
                </p>
              </div>
            ) : null}
            <div className="flex items-center justify-center">
              {!collapsed ? <ThemeToggle isDark={isDark} onToggle={toggleTheme} /> : null}
            </div>
          </div>
        </aside>

        {/* ── Main column ─────────────────────────────────────── */}
        <div className="flex w-full min-w-0 max-w-full flex-1 flex-col">
          {/* Topbar — desktop */}
          <header className="sticky top-0 z-30 hidden shrink-0 items-center justify-between border-b border-border bg-card px-4 py-3 md:flex">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label={collapsed ? "साइडबार खोलें" : "साइडबार बंद करें"}
                aria-expanded={!collapsed}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <HugeiconsIcon icon={PanelLeftIcon} size={16} aria-hidden />
              </button>
              <div>
                <div className="text-base font-semibold leading-tight text-foreground">
                  {title}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{meta.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <HugeiconsIcon icon={Calendar01Icon} size={14} aria-hidden />
                <span>{today}</span>
              </div>

              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

              <Link
                href="/admin/notifications"
                aria-label={`नोटिफ़िकेशन (${notifications})`}
                className="relative rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <HugeiconsIcon icon={Notification03Icon} size={18} aria-hidden />
                {notifications > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {notifications > 9 ? "9+" : notifications}
                  </span>
                ) : null}
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-2 border-l border-border pl-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="यूज़र मेन्यू"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-xs font-semibold text-white">
                    {initials}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-sm font-medium leading-tight text-foreground">
                      {user.name}
                    </span>
                    <span className="block max-w-[140px] truncate text-[11px] leading-tight text-muted-foreground">
                      {user.email}
                    </span>
                  </span>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    size={14}
                    className="hidden text-muted-foreground sm:block"
                    aria-hidden
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="mt-1 max-w-full truncate text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <span
                      className={cn(
                        "mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                        meta.color,
                      )}
                    >
                      {meta.hindi}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/profile" className="flex cursor-pointer items-center gap-2">
                      <HugeiconsIcon icon={UserIcon} size={16} aria-hidden />
                      मेरा प्रोफ़ाइल
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex cursor-pointer items-center gap-2">
                      <HugeiconsIcon icon={Settings02Icon} size={16} aria-hidden />
                      वेबसाइट देखें
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action="/api/admin/logout" method="post" className="w-full">
                      <button
                        type="submit"
                        className="flex w-full cursor-pointer items-center gap-2 text-red-600 dark:text-red-400"
                      >
                        <HugeiconsIcon icon={Logout01Icon} size={16} aria-hidden />
                        लॉग आउट
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Topbar — mobile */}
          <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-[5px] bg-brand text-[17px] font-extrabold leading-none text-white">
                <span className="translate-y-[-1px]">{site.mark}</span>
              </span>
              <span className="text-[15px] font-bold text-foreground">{title}</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
              <Link
                href="/admin/profile"
                aria-label="मेरा प्रोफ़ाइल"
                className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-[10px] font-semibold text-white"
              >
                {initials}
              </Link>
              <form action="/api/admin/logout" method="post">
                <button
                  type="submit"
                  aria-label="लॉग आउट"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-red-600"
                >
                  <HugeiconsIcon icon={Logout01Icon} size={16} aria-hidden />
                </button>
              </form>
            </div>
          </header>

          <main className="w-full max-w-full flex-1 overflow-x-clip bg-background px-3 py-3 pb-6 sm:p-6">
            {children}
          </main>

          <footer className="mb-14 flex shrink-0 items-center justify-between border-t border-border bg-card px-4 py-2 md:mb-0 md:px-6">
            <span className="text-[10px] text-muted-foreground md:text-xs">
              © {year} {site.name} — न्यूज़रूम पैनल
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
              <span className="text-[10px] text-muted-foreground md:text-xs">v0.1.0</span>
            </span>
          </footer>
        </div>

        {/* Mobile bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
          <MobileNav items={items} badges={badges} />
        </div>
      </div>
    </TooltipProvider>
  );
}
