"use client";

import { User, Mail } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ApplicantInfoCard({ name, email }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>معلومات المتقدم</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium">{name || "غير معروف"}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Mail size={12} />
              {email || "لا يوجد بريد إلكتروني"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
