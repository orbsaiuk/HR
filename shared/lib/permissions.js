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
    label: "إدارة الطلبات",
    description: "مراجعة الطلبات وتقييمها وتغيير حالتها",
    group: "التوظيف",
  },
  [PERMISSIONS.VIEW_APPLICATIONS]: {
    label: "عرض الطلبات",
    description: "عرض طلبات التوظيف",
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
    description: "تعديل إعدادات المنظمة",
    group: "المنظمة",
  },
};

// All permission keys as an array
export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

/**
 * Permission implication rules.
 * If a user has a "manage_*" permission, they automatically get the corresponding "view_*" permission.
 * This prevents misconfigured roles where a user can create/edit but can't see the list page.
 *
 * Example: A custom role with manage_forms but without view_forms would be broken —
 * the user could create forms but couldn't see the forms list page.
 * With implications, manage_forms automatically grants view_forms.
 */
export const PERMISSION_IMPLICATIONS = {
  [PERMISSIONS.MANAGE_FORMS]: [PERMISSIONS.VIEW_FORMS],
  [PERMISSIONS.MANAGE_POSITIONS]: [PERMISSIONS.VIEW_POSITIONS],
  [PERMISSIONS.MANAGE_APPLICATIONS]: [PERMISSIONS.VIEW_APPLICATIONS],
  [PERMISSIONS.MANAGE_MESSAGES]: [PERMISSIONS.VIEW_MESSAGES],
  [PERMISSIONS.MANAGE_TEAM]: [PERMISSIONS.MANAGE_ROLES],
};

/**
 * Expand a permissions array by resolving all implication rules.
 * Returns a new array with the original permissions plus any implied permissions.
 *
 * @param {string[]} permissions - The base permissions array
 * @returns {string[]} Expanded permissions array (deduplicated)
 */
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
    description: "يمكنه إدارة النماذج والوظائف والطلبات والرسائل",
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
    description: "يمكنه مراجعة الطلبات وعرض الوظائف",
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
    description: "وصول للعرض فقط إلى النماذج والوظائف والطلبات والرسائل",
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

/**
 * Get an Arabic display name for a role.
 * Falls back to the stored role name for custom roles.
 *
 * @param {string} roleKey
 * @param {string} fallbackName
 * @returns {string}
 */
export function getLocalizedRoleName(roleKey, fallbackName = "") {
  if (!roleKey) return fallbackName || "—";
  return SYSTEM_ROLE_LABELS_AR[roleKey] || fallbackName || roleKey;
}

/**
 * Permission group presets — predefined permission bundles for quick role creation.
 * Each preset includes a name, description, icon hint, and the permissions it grants.
 */
export const PERMISSION_PRESETS = [
  {
    key: "full_recruiter",
    name: "Full Recruiter",
    description: "Full access to forms, positions, applications, and messages",
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
    name: "Application Reviewer",
    description:
      "Can review and score applications, view positions and messages",
    permissions: [
      PERMISSIONS.VIEW_POSITIONS,
      PERMISSIONS.MANAGE_APPLICATIONS,
      PERMISSIONS.VIEW_APPLICATIONS,
      PERMISSIONS.VIEW_MESSAGES,
    ],
  },
  {
    key: "content_editor",
    name: "Content Editor",
    description: "Can create and manage forms and positions",
    permissions: [
      PERMISSIONS.MANAGE_FORMS,
      PERMISSIONS.VIEW_FORMS,
      PERMISSIONS.MANAGE_POSITIONS,
      PERMISSIONS.VIEW_POSITIONS,
    ],
  },
  {
    key: "read_only",
    name: "Read Only",
    description: "View-only access to all resources",
    permissions: [
      PERMISSIONS.VIEW_FORMS,
      PERMISSIONS.VIEW_POSITIONS,
      PERMISSIONS.VIEW_APPLICATIONS,
      PERMISSIONS.VIEW_MESSAGES,
    ],
  },
  {
    key: "team_admin",
    name: "Team Admin",
    description: "Can manage team members, roles, and organization settings",
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
