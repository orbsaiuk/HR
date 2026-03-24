import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  if (diffMs < 0) return null;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24)
    return `منذ ${hours === 1 ? "ساعة" : hours === 2 ? "ساعتين" : `${hours} ساعات`}`;
  if (days === 1) return "منذ يوم";
  if (days === 2) return "منذ يومين";
  if (days < 7) return `منذ ${days} أيام`;
  if (days < 30) return `منذ ${Math.floor(days / 7)} أسبوع`;
  return `منذ ${Math.floor(days / 30)} شهر`;
}

export function ProjectDetailHeader({ project }) {
  const relativeTime = timeAgo(project.publishedAt || project.createdAt);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowRight size={16} className="rtl:rotate-0 ltr:rotate-180" />
          العودة إلى المشاريع
        </Link>

        <h1 className="text-2xl md:text-3xl text-[#5286A5] mb-2">
          {project.title}
        </h1>

        {relativeTime && (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock size={14} />
            {relativeTime}
          </span>
        )}
      </div>
    </div>
  );
}
