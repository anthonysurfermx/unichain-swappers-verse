import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-uniswap-pink text-white hover:bg-uniswap-accessible-pink rounded-xl shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl",
        outline: "border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 rounded-xl",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-xl",
        ghost: "hover:bg-gray-100 hover:text-gray-900 rounded-md",
        link: "text-uniswap-accessible-pink underline-offset-4 hover:underline",
        pill: "bg-uniswap-pink text-white hover:bg-uniswap-accessible-pink rounded-full shadow-md",
        success: "bg-success text-white hover:bg-success/90 rounded-xl",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
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
