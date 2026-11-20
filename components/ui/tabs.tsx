"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui tabs (Radix) restyled as the sub-category links next to a red
 * section tab (DESIGN.md §3 SectionHeader): active item in brand, no pills.
 */

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "no-scrollbar flex items-center gap-[18px] overflow-x-auto",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "shrink-0 whitespace-nowrap py-1 text-[15px] font-medium text-ink-2 transition-colors",
        "data-[state=active]:font-bold data-[state=active]:text-brand",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("focus-visible:outline-none", className)}
      {...props}
    />
  );
}

/** Dark-section variant (video band) — DESIGN.md §5.6. */
export function TabsTriggerOnDark({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "shrink-0 whitespace-nowrap py-1 text-[15px] font-medium text-[#b9c6e4] transition-colors",
        "data-[state=active]:font-bold data-[state=active]:text-white",
        className,
      )}
      {...props}
    />
  );
}
