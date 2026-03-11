import Link from "next/link";
import { Home, Plus, Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardHeaderActions({
    canCreatePosition,
    permissionsLoading,
    isMobileOpen,
    onToggleMobile,
}) {
    return (
        <div className="flex items-center gap-3">
            <Link
                href="/"
                className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-md hover:bg-gray-100"
                title="الرئيسية"
            >
                <Home size={18} />
            </Link>

            {permissionsLoading ? (
                <Skeleton className="h-8 w-28 hidden sm:block" />
            ) : canCreatePosition ? (
                <>
                    <Button size="sm" asChild className="hidden sm:inline-flex">
                        <Link href="/dashboard/positions/create">
                            <Plus size={16} className="me-1.5" />
                            وظيفة جديدة
                        </Link>
                    </Button>
                    <Button size="icon" variant="ghost" asChild className="sm:hidden">
                        <Link href="/dashboard/positions/create">
                            <Plus size={18} />
                        </Link>
                    </Button>
                </>
            ) : null}

            <UserButton />

            {/* Mobile menu toggle */}
            <button
                onClick={onToggleMobile}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                aria-label="القائمة"
                aria-expanded={isMobileOpen}
            >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
        </div>
    );
}
