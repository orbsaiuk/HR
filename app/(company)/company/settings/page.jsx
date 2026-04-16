"use client";

import { Users, ScrollText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { RolesSettingsPage } from "@/features/roles";
import { AuditLogPage } from "@/features/audit";
import { PERMISSIONS } from "@/shared/lib/permissions";

export default function SettingsPage() {
  return (
    <PermissionGate permission={PERMISSIONS.MANAGE_SETTINGS} behavior="block">
      <div className="space-y-6" dir="rtl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
          <p className="mt-1 text-gray-600">إدارة اعدادات الشركة </p>
        </div>

        <Tabs defaultValue="roles" className="w-full" dir="rtl">
          <TabsList className="mb-6">
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              الأدوار
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <ScrollText className="h-4 w-4" />
              سجل النشاط
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roles">
            <RolesSettingsPage />
          </TabsContent>

          <TabsContent value="activity">
            <AuditLogPage />
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGate>
  );
}
