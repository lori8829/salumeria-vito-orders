import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-neural hover:shadow-plasma hover:scale-105",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground hover:shadow-neural",
        secondary: "bg-secondary text-secondary-foreground shadow-neural hover:shadow-plasma hover:scale-105",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // 2025 Visionary Variants
        neural: "glass-surface text-foreground hover-lift neural-glow border border-primary/20 hover:border-primary/50",
        plasma: "bg-gradient-plasma text-white shadow-plasma hover:shadow-void hover:scale-105",
        quantum: "bg-quantum-emerald/10 text-quantum-emerald border border-quantum-emerald/30 hover:bg-quantum-emerald/20 hover:shadow-glow",
        aurora: "bg-gradient-aurora text-white hover:scale-105 hover:shadow-plasma",
        void: "bg-void-depth/80 text-foreground border border-primary/20 hover:bg-void-depth hover:shadow-neural backdrop-blur-sm",
        glow: "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 hover:shadow-glow pulse-neural",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base font-semibold",
        xl: "h-14 rounded-2xl px-10 text-lg font-semibold",
        icon: "h-10 w-10",
        "icon-lg": "h-12 w-12",
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
