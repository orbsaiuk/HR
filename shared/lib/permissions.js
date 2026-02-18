// Permission keys
export const PERMISSIONS = {
    MANAGE_TEAM: 'manage_team',
    MANAGE_ROLES: 'manage_roles',
    MANAGE_FORMS: 'manage_forms',
    VIEW_FORMS: 'view_forms',
    MANAGE_POSITIONS: 'manage_positions',
    VIEW_POSITIONS: 'view_positions',
    MANAGE_APPLICATIONS: 'manage_applications',
    VIEW_APPLICATIONS: 'view_applications',
    MANAGE_MESSAGES: 'manage_messages',
    VIEW_MESSAGES: 'view_messages',
    MANAGE_SETTINGS: 'manage_settings',
    VIEW_ANALYTICS: 'view_analytics',
};

// Human-readable metadata for each permission (for the UI)
export const PERMISSION_METADATA = {
    [PERMISSIONS.MANAGE_TEAM]: { label: 'Manage Team', description: 'Invite, remove, and change roles of team members', group: 'Team' },
    [PERMISSIONS.MANAGE_ROLES]: { label: 'Manage Roles', description: 'Create, edit, and delete custom roles', group: 'Team' },
    [PERMISSIONS.MANAGE_FORMS]: { label: 'Manage Forms', description: 'Create, edit, publish, and close forms', group: 'Forms' },
    [PERMISSIONS.VIEW_FORMS]: { label: 'View Forms', description: 'View forms and form responses', group: 'Forms' },
    [PERMISSIONS.MANAGE_POSITIONS]: { label: 'Manage Positions', description: 'Create, edit, and publish job positions', group: 'Recruitment' },
    [PERMISSIONS.VIEW_POSITIONS]: { label: 'View Positions', description: 'View job positions', group: 'Recruitment' },
    [PERMISSIONS.MANAGE_APPLICATIONS]: { label: 'Manage Applications', description: 'Review, score, and change status of applications', group: 'Recruitment' },
    [PERMISSIONS.VIEW_APPLICATIONS]: { label: 'View Applications', description: 'View applications', group: 'Recruitment' },
    [PERMISSIONS.MANAGE_MESSAGES]: { label: 'Manage Messages', description: 'Send and manage messages and conversations', group: 'Communication' },
    [PERMISSIONS.VIEW_MESSAGES]: { label: 'View Messages', description: 'View messages', group: 'Communication' },
    [PERMISSIONS.MANAGE_SETTINGS]: { label: 'Manage Settings', description: 'Edit organization settings', group: 'Organization' },
    [PERMISSIONS.VIEW_ANALYTICS]: { label: 'View Analytics', description: 'View form and position analytics', group: 'Analytics' },
};

// All permission keys as an array
export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

// Default roles to seed when an organization is created
export const DEFAULT_ROLES = [
    {
        _key: 'admin',
        name: 'Admin',
        description: 'Full access to all organization features',
        permissions: ALL_PERMISSIONS, // Admin gets everything
        isSystem: true,
    },
    {
        _key: 'recruiter',
        name: 'Recruiter',
        description: 'Can manage forms, positions, applications, and messages',
        permissions: [
            PERMISSIONS.MANAGE_FORMS, PERMISSIONS.VIEW_FORMS,
            PERMISSIONS.MANAGE_POSITIONS, PERMISSIONS.VIEW_POSITIONS,
            PERMISSIONS.MANAGE_APPLICATIONS, PERMISSIONS.VIEW_APPLICATIONS,
            PERMISSIONS.MANAGE_MESSAGES, PERMISSIONS.VIEW_MESSAGES,
            PERMISSIONS.VIEW_ANALYTICS,
        ],
        isSystem: true,
    },
    {
        _key: 'hiring_manager',
        name: 'Hiring Manager',
        description: 'Can review applications and view positions',
        permissions: [
            PERMISSIONS.VIEW_FORMS, PERMISSIONS.VIEW_POSITIONS,
            PERMISSIONS.MANAGE_APPLICATIONS, PERMISSIONS.VIEW_APPLICATIONS,
            PERMISSIONS.VIEW_MESSAGES, PERMISSIONS.VIEW_ANALYTICS,
        ],
        isSystem: true,
    },
    {
        _key: 'viewer',
        name: 'Viewer',
        description: 'Read-only access to forms, positions, applications, and messages',
        permissions: [
            PERMISSIONS.VIEW_FORMS, PERMISSIONS.VIEW_POSITIONS,
            PERMISSIONS.VIEW_APPLICATIONS, PERMISSIONS.VIEW_MESSAGES,
        ],
        isSystem: true,
    },
];

// The admin role key - the first member of an org always gets this
export const ADMIN_ROLE_KEY = 'admin';
