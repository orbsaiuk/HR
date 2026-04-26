import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { exportAuditLogs } from "@/features/company/audit/services/auditService";
import { CATEGORY_LABELS } from "@/features/company/audit/ui/auditLogCategories";
import {
  formatAuditDate,
  localizeAuditDescription,
} from "@/features/company/audit/ui/auditLogLocalization";

export async function GET(request) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_SETTINGS);

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";
    const category = searchParams.get("category") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const logs = await exportAuditLogs(context.orgId, {
      category,
      startDate,
      endDate,
    });

    if (format === "csv") {
      const csv = convertToCSV(logs);
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="audit-logs-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }
  } catch (error) {
    console.error("Error exporting audit logs:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to export audit logs" },
      { status },
    );
  }
}

/**
 * Convert audit log array to CSV format.
 */
function convertToCSV(logs) {
  const headers = [
    "التاريخ",
    "المنفذ",
    "بريد المنفذ",
    "الإجراء",
    "التصنيف",
    "الوصف",
  ];

  const csvLogs = (logs || []).filter(
    (log) => !String(log?.action || "").startsWith("api_key."),
  );

  if (csvLogs.length === 0) {
    return `\uFEFF${headers.join(",")}\n`;
  }

  const rows = csvLogs.map((log) => {
    const effectiveCategory =
      log?.action === "company_profile.updated" ? "profile" : log?.category;

    return [
      formatAuditDate(log.createdAt),
      log.actor?.name || "غير معروف",
      log.actor?.email || "",
      localizeAction(log.action),
      CATEGORY_LABELS[effectiveCategory] || effectiveCategory || "",
      localizeAuditDescription(log),
    ].map(csvEscape);
  });

  const csvLines = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.join(",")),
  ];

  // UTF-8 BOM improves Arabic text rendering in spreadsheet apps like Excel.
  return `\uFEFF${csvLines.join("\n")}`;
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function localizeAction(action) {
  const ACTION_LABELS = {
    "form.created": "إنشاء نموذج",
    "form.updated": "تحديث نموذج",
    "form.deleted": "حذف نموذج",
    "form.published": "نشر نموذج",
    "form.closed": "إغلاق نموذج",
    "role.created": "إنشاء دور",
    "role.updated": "تحديث دور",
    "role.deleted": "حذف دور",
    "application.status_changed": "تغيير حالة التقديم",
    "application.scorecard_submitted": "إرسال بطاقة تقييم",
    "settings.updated": "تحديث الإعدادات",
    "company_profile.updated": "تحديث الملف التعريفي للشركة",
    "position.created": "إنشاء وظيفة",
    "position.updated": "تحديث وظيفة",
    "position.deleted": "حذف وظيفة",
    "position.status_changed": "تغيير حالة الوظيفة",
    "member.invited": "دعوة عضو",
    "invite.revoked": "إلغاء دعوة",
    "member.role_changed": "تغيير دور عضو",
    "member.removed": "إزالة عضو",
    "member.temporary_grant_created": "منح صلاحية مؤقتة",
    "member.temporary_grant_revoked": "سحب صلاحية مؤقتة",
  };

  return ACTION_LABELS[action] || action || "";
}
