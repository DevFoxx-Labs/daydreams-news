import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui button, restyled to the Daydreams News tokens (DESIGN.md §2):
 * 4px radius, brand fill, Mukta 600/700. Tap target ≥ 44px on `lg`.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[4px] font-hindi transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        brand: "bg-brand text-white font-bold hover:bg-brand-dark",
        ink: "bg-ink text-white font-bold hover:bg-ink-2",
        outline:
          "border border-line bg-white text-ink-2 font-semibold hover:border-brand hover:text-brand",
        ghost: "text-ink-2 font-semibold hover:bg-soft",
        link: "text-brand font-semibold underline-offset-4 hover:underline",
        white: "bg-white text-navy font-bold hover:bg-soft",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        md: "h-10 px-4 text-[15px]",
        lg: "h-11 px-[18px] text-[15px]",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "brand", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
