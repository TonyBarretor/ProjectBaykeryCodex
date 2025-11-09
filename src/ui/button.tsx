"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  asChild?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref as any}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none",
          variant === "primary" && "bg-burgundy-500 text-white hover:bg-burgundy-600",
          variant === "secondary" && "bg-white text-cacao-600 hover:bg-ivory-100",
          variant === "ghost" && "bg-transparent text-burgundy-500 hover:bg-burgundy-50",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
