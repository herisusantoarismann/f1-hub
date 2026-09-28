import React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { className, variant = "primary", size = "md", children, ...props },
        ref,
    ) => {
        const base =
            "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-f1-red/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

        const variants = {
            primary:
                "bg-f1-red text-white hover:bg-f1-darkred shadow-md hover:shadow-f1-glow",
            secondary:
                "bg-f1-carbon text-white hover:bg-f1-charcoal border border-f1-charcoal",
            outline:
                "border border-f1-charcoal hover:border-f1-red/60 text-f1-lightgray hover:text-white bg-transparent",
            ghost: "hover:bg-f1-carbon text-f1-gray hover:text-white",
        };

        const sizes = {
            sm: "text-xs px-3 py-1.5 gap-1.5",
            md: "text-sm px-4 py-2 gap-2",
            lg: "text-base px-6 py-2.5 gap-2.5",
        };

        return (
            <button
                ref={ref}
                className={cn(base, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </button>
        );
    },
);

Button.displayName = "Button";
