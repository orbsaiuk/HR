export { OrgMembersManagementPage } from "./ui/OrgMembersManagementPage";
export { useOrgMembersManagement } from "./model/useOrgMembersManagement";
export { OrgMembersManagementPage as TeamMemberManagementPage } from "./ui/OrgMembersManagementPage";
export { useOrgMembersManagement as useTeamMemberManagement } from "./model/useOrgMembersManagement";
export { usePermissions } from "./model/usePermissions";
export { PermissionGuard } from "./ui/PermissionGuard";
export { TemporaryGrantDialog } from "./ui/TemporaryGrantDialog";

// Re-export new shared auth components for convenience
export { PermissionGate } from "@/shared/components/auth/PermissionGate";
export { AccessDenied } from "@/shared/components/auth/AccessDenied";
