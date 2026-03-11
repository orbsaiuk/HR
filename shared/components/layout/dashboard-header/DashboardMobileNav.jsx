import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { NAV_ITEMS, isNavActive } from "./navConfig";

export function DashboardMobileNav({
    isOpen,
    onClose,
    navItems,
    pathname,
    unreadCount,
    permissionsLoading,
}) {
    if (!isOpen) return null;

    return (
        <nav className="lg:hidden border-t border-gray-100 bg-white px-4 pb-3 pt-2 space-y-1">
            {permissionsLoading ? (
                <MobileNavSkeleton count={NAV_ITEMS.length} />
            ) : (
                navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isNavActive(item.href, pathname);
                    const showBadge = item.name === "الرسائل" && unreadCount > 0;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100"
                                }
              `}
                        >
                            <Icon size={18} />
                            <span>{item.name}</span>
                            {showBadge && (
                                <span className="me-auto bg-blue-600 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                        </Link>
                    );
                })
            )}
        </nav>
    );
}

function MobileNavSkeleton({ count }) {
    return Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
    ));
}
