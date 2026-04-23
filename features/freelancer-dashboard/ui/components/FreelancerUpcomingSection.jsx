import Link from "next/link";

import { FreelancerReminderCard } from "./FreelancerReminderCard";

export function FreelancerUpcomingSection({
  groups,
  onDelete,
  onEdit,
  viewAllHref = "/freelancer/calendar#upcoming",
}) {
  return (
    <section id="upcoming" className="w-full rounded-xl border border-[#E6E8F0] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-[#E6E8F0] pb-4">
        <h2 className="text-xl font-medium text-[#2F3646]">
          المواعيد القادمة
        </h2>
        <Link
          href={viewAllHref}
          className="text-sm font-semibold text-[#5B4AE4] hover:underline"
        >
          عرض الكل
        </Link>
      </div>

      <div className="flex flex-col space-y-4">
        {groups.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#D7DBE6] bg-[#FAFBFD] px-4 py-6 text-center text-sm text-[#8A90A2]">
            لا توجد مواعيد قادمة ضمن التصنيفات المحددة.
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.dateKey} className="flex flex-col space-y-4">
              {group.items.map((item) => (
                <FreelancerReminderCard
                  key={item.id}
                  title={item.title}
                  time={item.displayTime}
                  date={item.date}
                  type={item.type}
                  projectName={item.projectName}
                  projectHref={item.projectHref}
                  priority={item.priority}
                  onEdit={() => onEdit(item.id)}
                  onDelete={() => onDelete(item.id)}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
