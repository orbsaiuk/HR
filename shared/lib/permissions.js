// Permission keys
export const PERMISSIONS = {
  MANAGE_TEAM: "manage_team",
  MANAGE_ROLES: "manage_roles",
  MANAGE_FORMS: "manage_forms",
  VIEW_FORMS: "view_forms",
  MANAGE_POSITIONS: "manage_positions",
  VIEW_POSITIONS: "view_positions",
  MANAGE_APPLICATIONS: "manage_applications",
  VIEW_APPLICATIONS: "view_applications",
  MANAGE_MESSAGES: "manage_messages",
  VIEW_MESSAGES: "view_messages",
  MANAGE_SETTINGS: "manage_settings",
};

// Human-readable metadata for each permission (for the UI)
export const PERMISSION_METADATA = {
  [PERMISSIONS.MANAGE_TEAM]: {
    label: "إدارة الفريق",
    description: "دعوة أعضاء الفريق وإزالتهم وتغيير أدوارهم",
    group: "الفريق",
  },
  [PERMISSIONS.MANAGE_ROLES]: {
    label: "إدارة الأدوار",
    description: "إنشاء الأدوار المخصصة وتعديلها وحذفها",
    group: "الفريق",
  },
  [PERMISSIONS.MANAGE_FORMS]: {
    label: "إدارة النماذج",
    description: "إنشاء النماذج وتعديلها ونشرها وإغلاقها",
    group: "النماذج",
  },
  [PERMISSIONS.VIEW_FORMS]: {
    label: "عرض النماذج",
    description: "عرض النماذج وردود النماذج",
    group: "النماذج",
  },
  [PERMISSIONS.MANAGE_POSITIONS]: {
    label: "إدارة الوظائف",
    description: "إنشاء الوظائف الشاغرة وتعديلها ونشرها",
    group: "التوظيف",
  },
  [PERMISSIONS.VIEW_POSITIONS]: {
    label: "عرض الوظائف",
    description: "عرض الوظائف الشاغرة",
    group: "التوظيف",
  },
  [PERMISSIONS.MANAGE_APPLICATIONS]: {
    label: "إدارة التقديمات",
    description: "مراجعة التقديمات علي الوظائف وتقييمها وتغيير حالتها",
    group: "التوظيف",
  },
  [PERMISSIONS.VIEW_APPLICATIONS]: {
    label: "عرض التقديمات",
    description: "عرض التقديمات علي الوظائف",
    group: "التوظيف",
  },
  [PERMISSIONS.MANAGE_MESSAGES]: {
    label: "إدارة الرسائل",
    description: "إرسال الرسائل والمحادثات وإدارتها",
    group: "التواصل",
  },
  [PERMISSIONS.VIEW_MESSAGES]: {
    label: "عرض الرسائل",
    description: "عرض الرسائل",
    group: "التواصل",
  },
  [PERMISSIONS.MANAGE_SETTINGS]: {
    label: "إدارة الإعدادات",
    description: "تعديل إعدادات الشركة",
    group: "الشركة",
  },
};

// All permission keys as an array
export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const PERMISSION_IMPLICATIONS = {
  [PERMISSIONS.MANAGE_FORMS]: [PERMISSIONS.VIEW_FORMS],
  [PERMISSIONS.MANAGE_POSITIONS]: [PERMISSIONS.VIEW_POSITIONS],
  [PERMISSIONS.MANAGE_APPLICATIONS]: [PERMISSIONS.VIEW_APPLICATIONS],
  [PERMISSIONS.MANAGE_MESSAGES]: [PERMISSIONS.VIEW_MESSAGES],
  [PERMISSIONS.MANAGE_TEAM]: [PERMISSIONS.MANAGE_ROLES],
};

export function expandPermissions(permissions) {
  const expanded = new Set(permissions);

  for (const perm of permissions) {
    const implied = PERMISSION_IMPLICATIONS[perm];
    if (implied) {
      for (const impliedPerm of implied) {
        expanded.add(impliedPerm);
      }
    }
  }

  return [...expanded];
}

// Default roles to seed when an organization is created
export const DEFAULT_ROLES = [
  {
    _key: "admin",
    name: "مدير الشركة",
    description: "وصول كامل إلى جميع ميزات المنظمة",
    permissions: ALL_PERMISSIONS, // Admin gets everything
    isSystem: true,
  },
  {
    _key: "recruiter",
    name: "مسؤول التوظيف",
    description: "يمكنه إدارة النماذج والوظائف التقديمات والرسائل",
    permissions: [
      PERMISSIONS.MANAGE_FORMS,
      PERMISSIONS.VIEW_FORMS,
      PERMISSIONS.MANAGE_POSITIONS,
      PERMISSIONS.VIEW_POSITIONS,
      PERMISSIONS.MANAGE_APPLICATIONS,
      PERMISSIONS.VIEW_APPLICATIONS,
      PERMISSIONS.MANAGE_MESSAGES,
      PERMISSIONS.VIEW_MESSAGES,
    ],
    isSystem: true,
  },
  {
    _key: "hiring_manager",
    name: "مدير التوظيف",
    description: "يمكنه مراجعة التقديمات وعرض الوظائف",
    permissions: [
      PERMISSIONS.VIEW_FORMS,
      PERMISSIONS.VIEW_POSITIONS,
      PERMISSIONS.MANAGE_APPLICATIONS,
      PERMISSIONS.VIEW_APPLICATIONS,
      PERMISSIONS.VIEW_MESSAGES,
    ],
    isSystem: true,
  },
  {
    _key: "viewer",
    name: "مشاهد",
    description: "وصول للعرض فقط إلى النماذج والوظائف التقديمات والرسائل",
    permissions: [
      PERMISSIONS.VIEW_FORMS,
      PERMISSIONS.VIEW_POSITIONS,
      PERMISSIONS.VIEW_APPLICATIONS,
      PERMISSIONS.VIEW_MESSAGES,
    ],
    isSystem: true,
  },
];

// The admin role key - the first member of an org always gets this
export const ADMIN_ROLE_KEY = "admin";

// Arabic labels for built-in system role keys.
export const SYSTEM_ROLE_LABELS_AR = {
  admin: "مدير الشركة",
  recruiter: "مسؤول التوظيف",
  hiring_manager: "مدير التوظيف",
  viewer: "مشاهد",
};

// Arabic descriptions for built-in system role keys.
export const SYSTEM_ROLE_DESCRIPTIONS_AR = {
  admin: "وصول كامل إلى جميع ميزات المنظمة",
  recruiter: "يمكنه إدارة النماذج والوظائف والتقديمات علي الوظائف والرسائل",
  hiring_manager: "يمكنه مراجعة التقديمات علي الوظائف وعرض الوظائف",
  viewer: "وصول للعرض فقط إلى النماذج والوظائف والتقديمات علي الوظائف والرسائل",
};

export function getLocalizedRoleName(roleKey, fallbackName = "") {
  if (!roleKey) return fallbackName || "—";
  return SYSTEM_ROLE_LABELS_AR[roleKey] || fallbackName || roleKey;
}

export function getLocalizedRoleDescription(roleKey, fallbackDescription = "") {
  if (!roleKey) return fallbackDescription || "";
  return SYSTEM_ROLE_DESCRIPTIONS_AR[roleKey] || fallbackDescription || "";
}

/**
 * Permission group presets — predefined permission bundles for quick role creation.
 * Each preset includes a name, description, icon hint, and the permissions it grants.
 */
export const PERMISSION_PRESETS = [
  {
    key: "full_recruiter",
    name: "مسؤول توظيف كامل",
    description: "وصول كامل لإدارة النماذج والوظائف والتقديمات والرسائل",
    permissions: [
      PERMISSIONS.MANAGE_FORMS,
      PERMISSIONS.VIEW_FORMS,
      PERMISSIONS.MANAGE_POSITIONS,
      PERMISSIONS.VIEW_POSITIONS,
      PERMISSIONS.MANAGE_APPLICATIONS,
      PERMISSIONS.VIEW_APPLICATIONS,
      PERMISSIONS.MANAGE_MESSAGES,
      PERMISSIONS.VIEW_MESSAGES,
    ],
  },
  {
    key: "application_reviewer",
    name: "مراجع طلبات",
    description: "يمكنه مراجعة وتقييم التقديمات مع عرض الوظائف والرسائل",
    permissions: [
      PERMISSIONS.VIEW_POSITIONS,
      PERMISSIONS.MANAGE_APPLICATIONS,
      PERMISSIONS.VIEW_APPLICATIONS,
      PERMISSIONS.VIEW_MESSAGES,
    ],
  },
  {
    key: "content_editor",
    name: "محرر محتوى",
    description: "يمكنه إنشاء وإدارة النماذج والوظائف",
    permissions: [
      PERMISSIONS.MANAGE_FORMS,
      PERMISSIONS.VIEW_FORMS,
      PERMISSIONS.MANAGE_POSITIONS,
      PERMISSIONS.VIEW_POSITIONS,
    ],
  },
  {
    key: "read_only",
    name: "عرض فقط",
    description: "وصول للعرض فقط على جميع الموارد",
    permissions: [
      PERMISSIONS.VIEW_FORMS,
      PERMISSIONS.VIEW_POSITIONS,
      PERMISSIONS.VIEW_APPLICATIONS,
      PERMISSIONS.VIEW_MESSAGES,
    ],
  },
  {
    key: "team_admin",
    name: "مدير الفريق",
    description: "يمكنه إدارة أعضاء الفريق والأدوار وإعدادات المنظمة",
    permissions: [
      PERMISSIONS.MANAGE_TEAM,
      PERMISSIONS.MANAGE_ROLES,
      PERMISSIONS.MANAGE_SETTINGS,
    ],
  },
];

/**
 * Get all unique permission groups in display order.
 * @returns {string[]} Ordered array of group names
 */
export function getPermissionGroups() {
  const seen = new Set();
  const groups = [];
  for (const meta of Object.values(PERMISSION_METADATA)) {
    const group = meta.group || "أخرى";
    if (!seen.has(group)) {
      seen.add(group);
      groups.push(group);
    }
  }
  return groups;
}

/**
 * Get all permissions belonging to a specific group.
 * @param {string} group - The group name
 * @returns {{ key: string, label: string, description: string, group: string }[]}
 */
export function getPermissionsByGroup(group) {
  const entries = Object.entries(PERMISSION_METADATA);
  return entries
    .filter(([, meta]) => (meta.group || "أخرى") === group)
    .map(([key, meta]) => ({ key, ...meta }));
}

/**
 * Check which permissions from PERMISSION_IMPLICATIONS are missing
 * given a selected set. Returns an array of dependency warning objects.
 *
 * @param {string[]} selected - Currently selected permissions
 * @returns {{ permission: string, label: string, requiredBy: string, requiredByLabel: string }[]}
 */
export function getDependencyWarnings(selected) {
  const warnings = [];
  for (const perm of selected) {
    const implied = PERMISSION_IMPLICATIONS[perm];
    if (implied) {
      for (const dep of implied) {
        if (!selected.includes(dep)) {
          const permMeta = PERMISSION_METADATA[perm] || {};
          const depMeta = PERMISSION_METADATA[dep] || {};
          warnings.push({
            permission: dep,
            label: depMeta.label || dep,
            requiredBy: perm,
            requiredByLabel: permMeta.label || perm,
          });
        }
      }
    }
  }
  return warnings;
}
