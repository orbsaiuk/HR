import { ContractsPage } from "@/features/contracts";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export const metadata = {
  title: "العقود | لوحة تحكم الشركة",
  description: "إدارة العقود الجاهزة وإرسالها عبر واتساب",
};

export default function Page() {
  return (
    <PermissionGate permission={PERMISSIONS.VIEW_CONTRACTS} behavior="block">
      <ContractsPage />
    </PermissionGate>
  );
}
