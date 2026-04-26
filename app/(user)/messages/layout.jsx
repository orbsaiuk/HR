"use client";

import { MessagesSidebar } from "@/features/user/messages/ui/MessagesSidebar";

export default function MessagesLayout({ children }) {
  return (
    <div dir="rtl" className="-mx-4 -my-8 flex h-screen flex-col bg-slate-50">
      {/* Page Title */}
      <div className="px-6 pb-3 pt-5">
        <h1 className="text-2xl font-bold text-slate-900">الرسائل</h1>
      </div>

      {/* Split View */}
      <div className="flex flex-1 overflow-hidden rounded-t-xl border-t border-slate-200 bg-white shadow-sm">
        {/* Sidebar */}
        <MessagesSidebar />
        {/* Chat Area */}
        <div className="flex min-w-0 flex-1 flex-col border-l border-slate-100">
          {children}
        </div>

      </div>
    </div>
  );
}
