import {
  getLocalizedRoleName,
  PERMISSION_METADATA,
} from "@/shared/lib/permissions";

const STATUS_LABELS_AR = {
  new: "جديد",
  screening: "فرز أولي",
  interview: "مقابلة",
  offered: "عرض",
  hired: "تم التوظيف",
  rejected: "مرفوض",
  draft: "مسودة",
  open: "مفتوح",
  "on-hold": "معلّق",
  closed: "مغلق",
  published: "منشور",
};

const SYSTEM_ROLE_NAME_TO_KEY = {
  admin: "admin",
  recruiter: "recruiter",
  "hiring manager": "hiring_manager",
  viewer: "viewer",
};

function extractQuotedValue(text) {
  const match = text?.match(/"([^"]+)"/);
  return match?.[1] || "";
}

function localizeStatus(status) {
  return STATUS_LABELS_AR[status] || status;
}

function localizeRoleFromName(nameOrKey) {
  if (!nameOrKey) return nameOrKey;
  const normalized = String(nameOrKey).trim().toLowerCase();
  const roleKey = SYSTEM_ROLE_NAME_TO_KEY[normalized] || normalized;
  return getLocalizedRoleName(roleKey, nameOrKey);
}

function tryParseJSON(value) {
  if (!value || typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getBeforeMetadata(log) {
  return tryParseJSON(log?.metadata?.before);
}

function localizePermissionList(rawPermissions) {
  const tokens = String(rawPermissions)
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) return rawPermissions;

  return tokens
    .map(
      (permissionKey) =>
        PERMISSION_METADATA[permissionKey]?.label || permissionKey,
    )
    .join("، ");
}

export function localizeAuditDescription(log) {
  const description = log?.description?.trim();
  if (!description) return "—";

  const action = log?.action || "";

  if (action === "settings.updated") {
    return "تم تحديث إعدادات المنظمة";
  }

  if (action === "company_profile.updated") {
    return "تم تحديث الملف التعريفي للشركة";
  }

  if (action === "application.scorecard_submitted") {
    const id = extractQuotedValue(description) || log?.targetId || "";
    return `تم إرسال بطاقة تقييم للتقديم "${id}"`;
  }

  if (action === "api_key.created") {
    const match = description.match(
      /^Created API key "([^"]+)" with permissions: (.+)$/,
    );
    if (match) {
      const [, keyName, rawPermissions] = match;
      return `تم إنشاء مفتاح API "${keyName}" بالصلاحيات: ${localizePermissionList(rawPermissions)}`;
    }
  }

  if (action === "form.deleted") {
    const before = getBeforeMetadata(log);
    const fallbackName = extractQuotedValue(description) || log?.targetId || "";
    const titleFromMetadata = String(before?.title || "").trim();
    if (titleFromMetadata) {
      return `تم حذف النموذج "${titleFromMetadata}"`;
    }

    // For legacy logs that only stored the form ID, avoid showing raw IDs in the UI.
    if (fallbackName && fallbackName !== log?.targetId) {
      return `تم حذف النموذج "${fallbackName}"`;
    }

    return "تم حذف النموذج";
  }

  if (action === "position.deleted") {
    const before = getBeforeMetadata(log);
    const fallbackName = extractQuotedValue(description) || log?.targetId || "";
    const titleFromMetadata = String(before?.title || "").trim();
    if (titleFromMetadata) {
      return `تم حذف الوظيفة "${titleFromMetadata}"`;
    }

    // For legacy logs that only stored the position ID, avoid showing raw IDs in the UI.
    if (fallbackName && fallbackName !== log?.targetId) {
      return `تم حذف الوظيفة "${fallbackName}"`;
    }

    return "تم حذف الوظيفة";
  }

  if (action === "position.created") {
    const title = extractQuotedValue(description) || log?.targetId || "";
    return title ? `تم إنشاء الوظيفة "${title}"` : "تم إنشاء الوظيفة";
  }

  if (action === "position.updated") {
    const title = extractQuotedValue(description) || log?.targetId || "";
    return title ? `تم تحديث الوظيفة "${title}"` : "تم تحديث الوظيفة";
  }

  if (action === "application.status_changed") {
    const match = description.match(
      /Changed application "([^"]+)" status to "([^"]+)"/,
    );
    if (match) {
      const [, id, status] = match;
      return `تم تغيير حالة التقديم "${id}" إلى "${localizeStatus(status)}"`;
    }
  }

  if (action === "position.status_changed") {
    const match = description.match(
      /Changed position "([^"]+)" status to "([^"]+)"/,
    );
    if (match) {
      const [, title, status] = match;
      return `تم تغيير حالة الوظيفة "${title}" إلى "${localizeStatus(status)}"`;
    }
  }

  if (action === "member.invited") {
    const match = description.match(/^Invited\s+(.+?)\s+as\s+"([^"]+)"$/);
    if (match) {
      const [, email, roleName] = match;
      return `تمت دعوة ${email} بدور "${localizeRoleFromName(roleName)}"`;
    }
  }

  if (action === "member.role_changed") {
    const match = description.match(
      /Changed role of team member "([^"]+)" from "([^"]+)" to "([^"]+)"/,
    );
    if (match) {
      const [, memberId, fromRole, toRole] = match;
      return `تم تغيير دور عضو الفريق "${memberId}" من "${localizeRoleFromName(fromRole)}" إلى "${localizeRoleFromName(toRole)}"`;
    }
  }

  if (action === "member.temporary_grant_created") {
    const match = description.match(
      /Granted temporary permissions \[([^\]]+)\] to user "([^"]+)" until (.+)$/,
    );
    if (match) {
      const [, permissions, userId, untilRaw] = match;
      return `تم منح صلاحيات مؤقتة [${permissions}] للمستخدم "${userId}" حتى ${untilRaw}`;
    }
  }

  if (action === "member.temporary_grant_revoked") {
    const match = description.match(
      /Revoked temporary grant "([^"]+)" for user "([^"]+)"/,
    );
    if (match) {
      const [, grantKey, userId] = match;
      return `تم سحب الصلاحية المؤقتة "${grantKey}" للمستخدم "${userId}"`;
    }
  }

  const genericPatterns = [
    [
      /^Created API key "([^"]+)" with permissions: (.+)$/,
      'تم إنشاء مفتاح API "$1" بالصلاحيات: $2',
    ],
    [/^Revoked API key "([^"]+)" \(([^)]+)\)$/, 'تم إلغاء مفتاح API "$1" ($2)'],
    [/^Created form "([^"]+)"$/, 'تم إنشاء النموذج "$1"'],
    [/^Updated form "([^"]+)"$/, 'تم تحديث النموذج "$1"'],
    [/^Published form "([^"]+)"$/, 'تم نشر النموذج "$1"'],
    [/^Closed form "([^"]+)"$/, 'تم إغلاق النموذج "$1"'],
    [/^Created role "([^"]+)"$/, 'تم إنشاء الدور "$1"'],
    [/^Updated role "([^"]+)"$/, 'تم تحديث الدور "$1"'],
    [/^Deleted role "([^"]+)"$/, 'تم حذف الدور "$1"'],
    [/^Created position "([^"]+)"$/, 'تم إنشاء الوظيفة "$1"'],
    [/^Updated position "([^"]+)"$/, 'تم تحديث الوظيفة "$1"'],
    [/^Revoked invite "([^"]+)"$/, 'تم إلغاء الدعوة "$1"'],
    [/^Removed team member "([^"]+)"$/, 'تمت إزالة عضو الفريق "$1"'],
  ];

  for (const [pattern, replacement] of genericPatterns) {
    if (pattern.test(description)) {
      return description.replace(pattern, replacement);
    }
  }

  return description;
}

export function formatAuditDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("ar-SA-u-nu-latn", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
