import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export function FormsPageHeader() {
  return (
    <div className="rounded-2xl bg-linear-to-l from-white via-indigo-50/30 to-white px-5 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            النماذج
          </h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            إدارة النماذج ومتابعة حالة النشر والاستجابات.
          </p>
        </div>

        <PermissionGate permission={PERMISSIONS.MANAGE_FORMS}>
          <Button
            asChild
            className="w-full bg-[#5338D5] hover:bg-[#462EA8] sm:w-auto"
          >
            <Link href="/company/forms/create" className="inline-flex items-center gap-2">
              <Plus size={18} />
              إضافة نموذج
            </Link>
          </Button>
        </PermissionGate>
      </div>
    </div>
  );
}
