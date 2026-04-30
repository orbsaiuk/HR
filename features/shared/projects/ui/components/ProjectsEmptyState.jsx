import { Plus, BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectsEmptyState({ onCreateClick, userType = "company" }) {
  if (userType === "freelancer") {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <BriefcaseBusiness className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد مشاريع</h3>
        <p className="mt-2 text-sm text-gray-500">
          لم تقدم أي مقترحات لمشاريع بعد. تصفح المشاريع المتاحة للبدء.
        </p>
        <div className="mt-6">
          <Button
            type="button"
            className="bg-[#5338D5] hover:bg-[#462EA8]"
            onClick={() => window.location.href = "/projects"}
          >
            تصفح المشاريع
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
        <BriefcaseBusiness className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد مشاريع</h3>
      <p className="mt-2 text-sm text-gray-500">
        ابدأ بإنشاء أول مشروع لشركتك للبحث عن مستقلين.
      </p>
      <div className="mt-6">
        <Button
          type="button"
          className="bg-[#5338D5] hover:bg-[#462EA8]"
          onClick={onCreateClick}
        >
          <Plus className="mr-2 h-4 w-4" />
          إضافة مشروع جديد
        </Button>
      </div>
    </div>
  );
}
