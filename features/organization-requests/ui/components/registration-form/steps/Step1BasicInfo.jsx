"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrgLogoUpload } from "../OrgLogoUpload";
import { Building2, Users, Briefcase, FileText } from "lucide-react";

const INDUSTRY_OPTIONS = [
  { label: "تكنولوجيا المعلومات", value: "technology" },
  { label: "الرعاية الصحية", value: "healthcare" },
  { label: "الخدمات المالية", value: "finance" },
  { label: "التعليم", value: "education" },
  { label: "التجزئة", value: "retail" },
  { label: "التصنيع", value: "manufacturing" },
  { label: "الاستشارات", value: "consulting" },
  { label: "الإعلام والترفيه", value: "media" },
  { label: "غير ربحي", value: "nonprofit" },
  { label: "حكومي", value: "government" },
  { label: "أخرى", value: "other" },
];

const SIZE_OPTIONS = [
  { label: "1-10 موظفين", value: "1-10" },
  { label: "11-50 موظف", value: "11-50" },
  { label: "51-200 موظف", value: "51-200" },
  { label: "201-500 موظف", value: "201-500" },
  { label: "أكثر من 500 موظف", value: "500+" },
];

/**
 * Step 1: Basic Organization Information (Enhanced UX)
 * Fields: orgName*, orgSize*, orgIndustry*, orgLogo*, orgDescription*
 */
export function Step1BasicInfo() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const description = watch("orgDescription") || "";
  const maxDescriptionLength = 500;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="text-primary" size={28} />
          البيانات الأساسية
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          أدخل المعلومات الأساسية عن مؤسستك. هذه البيانات ستظهر في ملفك
          التعريفي.
        </p>
      </div>

      <div className="space-y-6">
        {/* Organization Name */}
        <div className="space-y-3 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
          <Label
            htmlFor="orgName"
            className="text-base font-semibold flex items-center gap-2"
          >
            <Building2 size={16} className="text-primary" />
            اسم المؤسسة <span className="text-destructive">*</span>
          </Label>
          <Input
            id="orgName"
            {...register("orgName")}
            placeholder="مثال: شركة الابتكار للتقنية"
            className="text-base h-11"
            aria-describedby={errors.orgName ? "orgName-error" : "orgName-help"}
            aria-invalid={errors.orgName ? "true" : "false"}
          />
          {!errors.orgName && (
            <p
              id="orgName-help"
              className="text-xs text-muted-foreground flex items-start gap-1.5"
            >
              <span className="inline-block mt-0.5">💡</span>
              <span>
                استخدم الاسم الرسمي الكامل للمؤسسة كما هو موجود في السجل التجاري
              </span>
            </p>
          )}
          {errors.orgName && (
            <p
              id="orgName-error"
              className="text-sm text-destructive font-medium"
              role="alert"
            >
              {errors.orgName.message}
            </p>
          )}
        </div>

        {/* Employee Size and Industry */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Users size={16} className="text-primary" />
              عدد الموظفين <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="orgSize"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  dir="rtl"
                >
                  <SelectTrigger
                    className="h-11"
                    aria-invalid={errors.orgSize ? "true" : "false"}
                  >
                    <SelectValue placeholder="اختر حجم المؤسسة..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.orgSize && (
              <p className="text-sm text-destructive font-medium" role="alert">
                {errors.orgSize.message}
              </p>
            )}
          </div>

          <div className="space-y-3 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Briefcase size={16} className="text-primary" />
              نوع الصناعة <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="orgIndustry"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  dir="rtl"
                >
                  <SelectTrigger
                    className="h-11"
                    aria-invalid={errors.orgIndustry ? "true" : "false"}
                  >
                    <SelectValue placeholder="اختر نوع الصناعة..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.orgIndustry && (
              <p className="text-sm text-destructive font-medium" role="alert">
                {errors.orgIndustry.message}
              </p>
            )}
          </div>
        </div>

        {/* Logo Upload */}
        <OrgLogoUpload />

        {/* Description with character counter */}
        <div className="space-y-3 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="orgDescription"
              className="text-base font-semibold flex items-center gap-2"
            >
              <FileText size={16} className="text-primary" />
              وصف المؤسسة <span className="text-destructive">*</span>
            </Label>
            <span
              className={`text-xs font-medium ${description.length > maxDescriptionLength ? "text-destructive" : "text-muted-foreground"}`}
            >
              {description.length} / {maxDescriptionLength}
            </span>
          </div>
          <Textarea
            id="orgDescription"
            {...register("orgDescription")}
            rows={5}
            maxLength={maxDescriptionLength}
            placeholder="اكتب نبذة مختصرة عن مؤسستك، أنشطتها الرئيسية، ورؤيتها المستقبلية..."
            className="text-base resize-none"
            aria-describedby={
              errors.orgDescription
                ? "orgDescription-error"
                : "orgDescription-help"
            }
            aria-invalid={errors.orgDescription ? "true" : "false"}
          />
          {!errors.orgDescription && (
            <p
              id="orgDescription-help"
              className="text-xs text-muted-foreground flex items-start gap-1.5"
            >
              <span className="inline-block mt-0.5">💡</span>
              <span>
                قدم وصفاً واضحاً يعكس طبيعة عملك وخدماتك. سيساعد هذا في جذب
                المواهب المناسبة.
              </span>
            </p>
          )}
          {errors.orgDescription && (
            <p
              id="orgDescription-error"
              className="text-sm text-destructive font-medium"
              role="alert"
            >
              {errors.orgDescription.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
