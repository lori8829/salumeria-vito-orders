import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "glass-card bg-[hsl(var(--primary-glass))] text-primary-foreground backdrop-blur-md hover:bg-[hsl(var(--primary)/0.3)] hover:scale-105 hover:shadow-lg border border-[hsl(var(--primary)/0.4)]",
        destructive: "glass-card bg-[hsl(var(--secondary-glass))] text-secondary-foreground backdrop-blur-md hover:bg-[hsl(var(--secondary)/0.3)] hover:scale-105 border border-[hsl(var(--secondary)/0.4)]",
        outline: "glass-card border border-[hsl(var(--border-hover))] bg-[hsl(var(--glass-neutral))] backdrop-blur-md hover:bg-[hsl(var(--card-hover))] hover:scale-105 morph-hover",
        secondary: "glass-card bg-[hsl(var(--secondary-glass))] text-secondary-foreground backdrop-blur-md hover:bg-[hsl(var(--secondary)/0.3)] hover:scale-105 border border-[hsl(var(--secondary)/0.4)]",
        ghost: "hover:bg-[hsl(var(--glass-neutral))] hover:backdrop-blur-md hover:scale-105 transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 transition-transform duration-200",
        glass: "glass-strong text-foreground hover:bg-[hsl(var(--glass-strong))] hover:scale-[1.02] morphing-border",
        floating: "glass-card bg-[hsl(var(--primary-glass))] text-primary-foreground backdrop-blur-md float-animation hover:scale-110 border border-[hsl(var(--primary)/0.4)] shadow-lg",
        ripple: "ripple-effect glass-card bg-[hsl(var(--primary-glass))] text-primary-foreground backdrop-blur-md hover:scale-105 border border-[hsl(var(--primary)/0.4)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
