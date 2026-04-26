"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

/**
 * Step 3: Legal Information
 * Fields: registrationNumber (optional), taxId (optional)
 */
export function Step3LegalInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">المعلومات القانونية</h2>
        <p className="text-sm text-muted-foreground">
          أدخل بيانات التسجيل القانونية (اختياري)
        </p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-start gap-3">
          <FileText
            className="text-muted-foreground shrink-0 mt-0.5"
            size={20}
          />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">ملاحظة</p>
            <p>
              هذه الحقول اختيارية. يمكنك تقديم الطلب بدون هذه المعلومات وإضافتها
              لاحقاً بعد الموافقة على طلب التسجيل.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Registration Number */}
        <div className="space-y-2">
          <Label htmlFor="registrationNumber">رقم السجل التجاري</Label>
          <Input
            id="registrationNumber"
            {...register("registrationNumber")}
            placeholder="123XXXXXXX"
            dir="ltr"
            className="text-right"
            aria-describedby={
              errors.registrationNumber ? "registrationNumber-error" : undefined
            }
          />
          {errors.registrationNumber && (
            <p
              id="registrationNumber-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.registrationNumber.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            رقم السجل التجاري الصادر من وزارة التجارة
          </p>
        </div>

        {/* Tax ID */}
        <div className="space-y-2">
          <Label htmlFor="taxId">الرقم الضريبي</Label>
          <Input
            id="taxId"
            {...register("taxId")}
            placeholder="123XXXXXXX"
            dir="ltr"
            className="text-right"
            aria-describedby={errors.taxId ? "taxId-error" : undefined}
          />
          {errors.taxId && (
            <p
              id="taxId-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.taxId.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            رقم التسجيل في ضريبة القيمة المضافة
          </p>
        </div>
      </div>
    </div>
  );
}
