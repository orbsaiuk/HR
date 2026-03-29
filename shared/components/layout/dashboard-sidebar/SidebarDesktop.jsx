import { cn } from "@/lib/utils";
import { SidebarContent } from "./SidebarContent";

export function SidebarDesktop({
  isCollapsed,
  onToggleCollapse,
  logoUrl,
  orgName,
  navItems,
  pathname,
  unreadCount,
  permissionsLoading,
}) {
  return (
    <>
      <div
        className={cn(
          "hidden shrink-0 transition-[width] duration-300 lg:block",
          isCollapsed ? "w-20" : "w-72",
        )}
      />

      <aside
        className={cn(
          "hidden fixed inset-y-0 end-0 z-30 h-screen border-s border-slate-200 bg-white transition-[width] duration-300 lg:flex lg:flex-col print:hidden",
          isCollapsed ? "w-20" : "w-72",
        )}
      >
        <SidebarContent
          logoUrl={logoUrl}
          orgName={orgName}
          navItems={navItems}
          pathname={pathname}
          unreadCount={unreadCount}
          permissionsLoading={permissionsLoading}
          isCollapsed={isCollapsed}
          showCollapseToggle
          onToggleCollapse={onToggleCollapse}
        />
      </aside>
    </>
  );
}
