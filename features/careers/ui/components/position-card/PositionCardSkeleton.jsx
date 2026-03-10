import { Skeleton } from "@/components/ui/skeleton";

function ListCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
            {/* Top section: Info + Bookmark */}
            <div className="flex items-start gap-4">
                {/* Job Info */}
                <div className="flex-1 min-w-0">
                    {/* Title + Company */}
                    <div className="mb-1">
                        <Skeleton className="h-5 w-3/5 mb-1.5" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>

                    {/* Description */}
                    <Skeleton className="h-4 w-4/5 mb-3" />

                    {/* Tags row */}
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-14 rounded-full" />
                    </div>
                </div>

                {/* Bookmark placeholder */}
                <Skeleton className="shrink-0 h-6 w-6 rounded mt-1" />
            </div>

            {/* Footer: Time + Apply button */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-24 rounded-md" />
            </div>
        </div>
    );
}

function GridCardSkeleton() {
    return (
        <div className="block h-full">
            <div className="bg-white border border-gray-200 rounded-lg p-5 h-full">
                {/* Title + Company + Bookmark */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <Skeleton className="h-5 w-3/4 mb-1.5" />
                        <Skeleton className="h-4 w-1/3 mb-2" />
                    </div>
                    <Skeleton className="shrink-0 h-5 w-5 rounded" />
                </div>

                {/* Description */}
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-18 rounded-full" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                </div>
            </div>
        </div>
    );
}

export function PositionCardSkeletonList({ viewMode = "list", count = 6 }) {
    const CardSkeleton = viewMode === "grid" ? GridCardSkeleton : ListCardSkeleton;

    return (
        <div
            className={
                viewMode === "grid"
                    ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col gap-4"
            }
        >
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}
