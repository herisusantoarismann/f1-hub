import { Skeleton } from "@/components/atoms/Skeleton";

export default function ScheduleLoading() {
    return (
        <div
            data-testid="schedule-loading-skeleton"
            className="container mx-auto px-4 py-8 max-w-7xl animate-pulse space-y-8"
        >
            {/* Title skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-28 bg-f1-charcoal" />
                <Skeleton className="h-10 w-80 bg-f1-charcoal" />
                <Skeleton className="h-4 w-96 max-w-full bg-f1-charcoal" />
            </div>

            {/* Control bar skeleton */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-f1-charcoal pb-6">
                <div className="flex gap-4">
                    <Skeleton className="h-6 w-32 bg-f1-charcoal" />
                    <Skeleton className="h-6 w-24 bg-f1-charcoal" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-9 w-60 bg-f1-charcoal" />
                    <Skeleton className="h-9 w-40 bg-f1-charcoal" />
                </div>
            </div>

            {/* Grid of Skeleton Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 12 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex flex-col justify-between rounded-xl border border-f1-charcoal/60 bg-f1-carbon/60 p-5 h-56 space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-5 w-20 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>

                        <div className="space-y-2 pt-2 border-t border-f1-charcoal/40">
                            <Skeleton className="h-3 w-4/5" />
                            <Skeleton className="h-3 w-3/5" />
                        </div>

                        <div className="flex justify-between pt-2 border-t border-f1-charcoal/40">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
