import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarContent } from "./SidebarContent";

export function SidebarMobileDrawer({
  isOpen,
  onClose,
  logoUrl,
  orgName,
  navItems,
  pathname,
  unreadCount,
  permissionsLoading,
  skeletonCount,
  homeHref,
  variant,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40"
        aria-label="إغلاق القائمة"
      />
      <aside className="relative ms-auto flex h-full w-72 flex-col border-s border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-800">القائمة</p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="إغلاق"
          >
            <X size={18} />
          </Button>
        </div>

        <SidebarContent
          logoUrl={logoUrl}
          orgName={orgName}
          navItems={navItems}
          pathname={pathname}
          unreadCount={unreadCount}
          permissionsLoading={permissionsLoading}
          skeletonCount={skeletonCount}
          homeHref={homeHref}
          variant={variant}
          isCollapsed={false}
          onNavigate={onClose}
        />
      </aside>
    </div>
  );
}
