/**
 * Form actions dropdown menu
 */

"use client";

import Link from "next/link";
import {
  MoreVertical,
  Eye,
  Edit,
  Share2,
  Trash2,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/features/team-member-management/model/usePermissions";
import { PERMISSIONS } from "@/shared/lib/permissions";

export function FormActionsMenu({ form, onAction, isMock = false }) {
  const { hasPermission } = usePermissions();
  const canManageForms = hasPermission(PERMISSIONS.MANAGE_FORMS);

  const handleAction = (action) => {
    onAction(action, form._id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">فتح القائمة</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48" dir="rtl">
        <DropdownMenuItem asChild>
          <Link
            href={`/company/forms/${form._id}`}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            عرض التفاصيل
          </Link>
        </DropdownMenuItem>
        {canManageForms && !isMock && (
          <DropdownMenuItem asChild>
            <Link
              href={`/company/forms/${form._id}/edit`}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              تعديل
            </Link>
          </DropdownMenuItem>
        )}
        {!isMock && (
          <DropdownMenuItem asChild>
            <Link
              href={`/company/forms/${form._id}/analytics`}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              التحليلات
            </Link>
          </DropdownMenuItem>
        )}
        {canManageForms && !isMock && (
          <DropdownMenuItem asChild>
            <Link
              href={`/company/forms/${form._id}/share`}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              مشاركة
            </Link>
          </DropdownMenuItem>
        )}

        {isMock && (
          <DropdownMenuItem disabled className="opacity-80">
            <TrendingUp className="h-4 w-4" />
            التحليلات غير متاحة في النموذج التجريبي
          </DropdownMenuItem>
        )}

        {canManageForms && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleAction("delete")}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
