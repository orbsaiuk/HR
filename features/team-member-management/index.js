export { TeamMemberManagementPage } from "./ui/TeamMemberManagementPage";
export { useTeamMemberManagement } from "./model/useTeamMemberManagement";
export { usePermissions } from "./model/usePermissions";
export { PermissionGuard } from "./ui/PermissionGuard";
export { TemporaryGrantDialog } from "./ui/TemporaryGrantDialog";

// Re-export new shared auth components for convenience
export { PermissionGate } from "@/shared/components/auth/PermissionGate";
export { AccessDenied } from "@/shared/components/auth/AccessDenied";
