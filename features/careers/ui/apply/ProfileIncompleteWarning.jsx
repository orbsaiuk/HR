"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export function ProfileIncompleteWarning({ positionId }) {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
          <AlertTriangle size={20} />
          أكمل ملفك الشخصي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-amber-700">
          تتطلب هذه الوظيفة التقديم باستخدام ملفك الشخصي. يرجى إكمال ملفك الشخصي
          قبل إرسال طلبك. كحد أدنى، أضف عنوانًا تعريفيًا أو نبذة شخصية أو
          مهارات.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/user/profile/edit">إكمال الملف الشخصي</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/careers/${positionId}`}>العودة إلى الوظيفة</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
