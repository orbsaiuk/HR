import { FreelancerMessagesSidebar } from "@/features/freelancer/messages";

export const metadata = {
  title: "المراسلات | لوحة تحكم المستقل",
};

export default function FreelancerMessagesLayout({ children }) {
  return (
    <div dir="rtl" className="-m-4 flex h-screen flex-col bg-slate-50 lg:-m-6">
      {/* Page Title */}
      <div className="px-6 pb-3 pt-5">
        <h1 className="text-2xl font-bold text-slate-900">الرسائل</h1>
      </div>

      {/* Split View */}
      <div className="flex flex-1 overflow-hidden rounded-t-xl border-t border-slate-200 bg-white shadow-sm">
        {/* Sidebar */}
        <FreelancerMessagesSidebar />
        
        {/* Chat Area */}
        <div className="flex min-w-0 flex-1 flex-col border-l border-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}
