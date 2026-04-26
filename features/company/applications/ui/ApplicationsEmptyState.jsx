"use client";

import { Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ApplicationsEmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-gray-100 mb-4">
          <Inbox size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          لا توجد طلبات تقديم حتى الآن
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          ستظهر الطلبات هنا عند تقديم المرشحين على هذه الوظيفة. شارك رابط
          الوظيفة لبدء استقبال الطلبات.
        </p>
      </CardContent>
    </Card>
  );
}
