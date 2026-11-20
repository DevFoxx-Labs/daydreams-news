"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import type * as React from "react";

import { HugeiconsIcon, Cancel01Icon } from "@/components/icons";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui sheet (Radix Dialog) restyled to the tokens. Used for the
 * full-screen mobile menu (DESIGN.md §4.6) and the city picker.
 */

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetTitle = SheetPrimitive.Title;
export const SheetDescription = SheetPrimitive.Description;

export function SheetContent({
  className,
  children,
  side = "right",
  showClose = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "right" | "left" | "bottom";
  showClose?: boolean;
}) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:[animation:ks-fade-in_150ms_ease-out]" />
      <SheetPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col bg-white shadow-xl focus:outline-none",
          side === "right" && "inset-y-0 right-0 w-full max-w-[420px]",
          side === "left" && "inset-y-0 left-0 w-full max-w-[420px]",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-[12px] data-[state=open]:[animation:ks-slide-up_200ms_ease-out]",
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? (
          <SheetPrimitive.Close
            aria-label={t.common.close}
            className="absolute end-3 top-3 grid size-11 place-items-center text-ink"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} strokeWidth={2} />
          </SheetPrimitive.Close>
        ) : null}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}
