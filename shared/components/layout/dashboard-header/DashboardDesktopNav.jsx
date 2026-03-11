import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { NAV_ITEMS, isNavActive } from "./navConfig";

export function DashboardDesktopNav({
    navItems,
    pathname,
    unreadCount,
    permissionsLoading,
}) {
    return (
        <nav className="hidden lg:flex items-center gap-1">
            {permissionsLoading ? (
                <NavSkeleton count={NAV_ITEMS.length} />
            ) : (
                navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isNavActive(item.href, pathname);
                    const showBadge = item.name === "الرسائل" && unreadCount > 0;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${active
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }
              `}
                        >
                            <Icon size={16} />
                            <span>{item.name}</span>
                            {showBadge && (
                                <span className="ms-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
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

function NavSkeleton({ count }) {
    return Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-8 w-20" />
    ));
}
