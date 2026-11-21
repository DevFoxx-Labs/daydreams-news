import type * as React from "react";

import { cn } from "@/lib/utils";

/** shadcn/ui input, restyled: 1px line border, 4px radius, 15px Mukta. */
export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-11 w-full rounded-[4px] border border-line bg-white px-3 text-[15px] text-ink",
        "placeholder:text-meta focus-visible:border-brand focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
