import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-label text-[11px] transition-[transform,background-color,color,border-color,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
  {
    variants: {
      variant: {
        default: "bg-brand text-white hover:bg-brand-dark",
        navy: "bg-navy text-white hover:bg-navy-deep",
        outline:
          "border border-ink/80 bg-transparent text-ink hover:bg-ink hover:text-cream",
        cream:
          "bg-cream text-ink hover:bg-paper",
        ghost: "bg-transparent text-ink hover:bg-surface",
        inverse: "bg-white text-ink hover:bg-cream",
        link: "bg-transparent text-brand underline-offset-4 hover:underline tracking-normal normal-case font-medium text-sm",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3",
        lg: "h-12 px-7",
        xl: "h-14 px-8",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
