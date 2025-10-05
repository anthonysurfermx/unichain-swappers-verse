import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-uniswap-pink text-white hover:bg-uniswap-accessible-pink",
        secondary: "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200",
        destructive: "border-transparent bg-destructive text-white hover:bg-destructive/80",
        outline: "text-foreground border-gray-300",
        success: "border-transparent bg-success/10 text-success hover:bg-success/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
