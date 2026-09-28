import React from "react";
import { cn } from "@/lib/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    shimmer?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className,
    shimmer = true,
    ...props
}) => {
    return (
        <div
            className={cn(
                "rounded-md bg-f1-carbon/80 border border-f1-charcoal/50",
                shimmer &&
                    "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
                className,
            )}
            {...props}
        />
    );
};
