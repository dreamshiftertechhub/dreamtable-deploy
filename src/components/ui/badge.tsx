import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center tracking-label text-[10px] font-semibold px-2 py-1",
  {
    variants: {
      variant: {
        default: "bg-ink text-cream",
        brand: "bg-brand text-white",
        navy: "bg-navy text-white",
        outline: "border border-line text-muted",
        cream: "bg-surface text-ink",
        ok: "bg-ok/10 text-ok",
        warn: "bg-warn/10 text-warn",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
