/**
 * Form actions dropdown menu
 */

"use client";

import Link from "next/link";
import { MoreVertical, Eye, Edit, Link2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/features/org-members-management/model/usePermissions";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { toast } from "sonner";

export function FormActionsMenu({ form, onAction, isMock = false }) {
  const { hasPermission } = usePermissions();
  const canManageForms = hasPermission(PERMISSIONS.MANAGE_FORMS);

  const handleAction = (action) => {
    onAction(action, form._id);
  };

  const copyToClipboard = async (value) => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch {
        // Fall back to execCommand when Clipboard API is blocked.
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);

    return copied;
  };

  const handleCopyLink = async () => {
    if (!form?._id) {
      toast.error("فشل في نسخ الرابط");
      return;
    }

    const url = `${window.location.origin}/company/forms/${form._id}`;
    const copied = await copyToClipboard(url);

    if (copied) {
      toast.success("تم نسخ الرابط بنجاح");
      return;
    }

    toast.error("فشل في نسخ الرابط");
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
        {canManageForms && !isMock && (
          <DropdownMenuItem onSelect={handleCopyLink}>
            <Link2 className="h-4 w-4" />
            نسخ الرابط
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
