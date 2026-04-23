import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function FreelancerReminderCard({
  title,
  time,
  type,
  onDelete,
  className,
}) {
  return (
    <article
      className={cn(
        "flex items-center justify-between rounded-xl mb-4 border border-[#E6E8F0] bg-white p-4 shadow-sm",
        className,
      )}
    >
      {/* Right Content */}
      <div className="flex flex-col items-start gap-2 text-right">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-[#5B4AE4]">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h3 className="text-[17px] font-medium text-[#2F3646]">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-3 mr-[34px]">
          <span className="rounded-full bg-[#EAE8FA] px-3 py-1 text-[11.5px] font-medium text-[#469B79]">
            تسليم مشروع
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#8A90A2]">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8A90A2]">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {time}
          </span>
        </div>
      </div>

      {/* Left Content */}
      <button
        type="button"
        onClick={onDelete}
        className="text-[#EF4444] transition-colors hover:text-[#DC2626]"
        aria-label="حذف التذكير"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
    </article>
  );
}
