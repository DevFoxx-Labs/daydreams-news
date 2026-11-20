"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type * as React from "react";

import { ArrowDown01Icon, HugeiconsIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/** shadcn/ui accordion — used for the mobile footer link columns (§4.7). */

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-[#2c2c2c]", className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex min-h-11 flex-1 items-center justify-between py-3 text-left text-[16px] font-bold text-white",
          "[&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={20}
          strokeWidth={2}
          className="shrink-0 transition-transform duration-200"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn("overflow-hidden pb-3", className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Content>
  );
}
