export { OrgMembersManagementPage } from "./ui";
export { useOrgMembersManagement } from "./model/useOrgMembersManagement";
export { OrgMembersManagementPage as TeamMemberManagementPage } from "./ui";
export { useOrgMembersManagement as useTeamMemberManagement } from "./model/useOrgMembersManagement";
export { usePermissions } from "./model/usePermissions";
export { PermissionGuard, TemporaryGrantDialog } from "./ui";

// Re-export new shared auth components for convenience
export { PermissionGate } from "@/shared/components/auth/PermissionGate";
export { AccessDenied } from "@/shared/components/auth/AccessDenied";
