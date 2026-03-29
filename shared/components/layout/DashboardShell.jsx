"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      <div className="flex min-h-screen">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="fixed start-4 top-4 z-40 rounded-lg border border-slate-200 bg-white lg:hidden print:hidden"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label="فتح القائمة"
        >
          <Menu size={20} />
        </Button>

        <DashboardSidebar
          isMobileOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 p-4 pb-1 lg:p-6 print:p-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
