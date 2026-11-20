"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import type * as React from "react";

import { Cancel01Icon, HugeiconsIcon } from "@/components/icons";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui dialog restyled to the tokens. Only the dialog body scrolls
 * (project rule), so a long consent panel keeps its header and footer fixed.
 */

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 flex max-h-[85dvh] w-[calc(100%-2rem)] max-w-[560px]",
          "-translate-x-1/2 -translate-y-1/2 flex-col rounded-[8px] bg-white shadow-xl focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label={t.common.close}
          className="absolute end-2 top-2 grid size-11 place-items-center text-ink"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("shrink-0 border-b border-line px-5 py-4 pe-14", className)}
      {...props}
    />
  );
}

export function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-4", className)} {...props} />
  );
}

export function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "shrink-0 border-t border-line px-5 py-4",
        "flex flex-col gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-[19px] font-extrabold text-ink", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("mt-1 text-[14.5px] leading-[1.6] text-ink-2", className)}
      {...props}
    />
  );
}
