"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PositionDetailsCard({ position }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>التفاصيل</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground mb-2">تاريخ الإنشاء</dt>
            <dd className="text-gray-900 font-medium">
              {position.createdAt
                ? new Date(position.createdAt).toLocaleDateString("ar-SA")
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground mb-2">آخر تحديث</dt>
            <dd className="text-gray-900 font-medium">
              {position.updatedAt
                ? new Date(position.updatedAt).toLocaleDateString("ar-SA")
                : "—"}
            </dd>
          </div>
          {position.teamMember && (
            <div>
              <dt className="text-muted-foreground">أنشئ بواسطة</dt>
              <dd className="text-gray-900 font-medium">
                {position.teamMember.name}
              </dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
