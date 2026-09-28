import React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?:
        | "default"
        | "primary"
        | "secondary"
        | "success"
        | "warning"
        | "danger"
        | "sprint"
        | "outline";
    size?: "sm" | "md" | "lg";
    rounded?: "default" | "full";
    teamColor?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = "default",
    size = "md",
    rounded = "full",
    teamColor,
    className,
    style,
    ...props
}) => {
    const baseStyles =
        "inline-flex items-center justify-center font-semibold tracking-wider uppercase transition-colors";

    const sizeStyles = {
        sm: "text-[10px] px-2 py-0.5 gap-1",
        md: "text-xs px-2.5 py-1 gap-1.5",
        lg: "text-sm px-3.5 py-1.5 gap-2",
    };

    const roundedStyles = {
        default: "rounded-md",
        full: "rounded-full",
    };

    const variantStyles = {
        default: "bg-f1-carbon text-f1-lightgray border border-f1-charcoal",
        primary:
            "bg-f1-red text-white shadow-[0_0_10px_rgba(225,6,0,0.5)] border border-f1-darkred",
        secondary: "bg-f1-charcoal text-white border border-gray-700",
        success:
            "bg-emerald-950/80 text-emerald-400 border border-emerald-600/40",
        warning: "bg-amber-950/80 text-amber-300 border border-amber-600/40",
        danger: "bg-rose-950/80 text-rose-300 border border-rose-600/40 animate-pulse",
        sprint: "bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-200 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]",
        outline: "bg-transparent text-gray-300 border border-gray-600",
    };

    const customStyle = teamColor
        ? {
              backgroundColor: `${teamColor}22`,
              color: teamColor,
              borderColor: `${teamColor}66`,
              ...style,
          }
        : style;

    return (
        <span
            className={cn(
                baseStyles,
                sizeStyles[size],
                roundedStyles[rounded],
                !teamColor && variantStyles[variant],
                className,
            )}
            style={customStyle}
            {...props}
        >
            {children}
        </span>
    );
};
