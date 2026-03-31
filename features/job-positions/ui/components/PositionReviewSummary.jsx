"use client";

export function PositionReviewSummary({ formData }) {
  const TYPE_LABELS = {
    "full-time": "دوام كامل",
    "part-time": "دوام جزئي",
    contract: "عقد",
    internship: "تدريب",
    remote: "عن بعد",
  };

  return (
    <div className="rounded-lg border bg-white p-6 space-y-4">
      <h3 className="text-lg font-semibold">ملخص المراجعة</h3>
      <div className="grid gap-3 text-sm">
        <div>
          <p className="font-medium">المسمى الوظيفي</p>
          <p className="text-muted-foreground">
            {formData.title || "لم يتم تعيينه"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="font-medium">القسم</p>
            <p className="text-muted-foreground">
              {formData.department || "لم يتم تعيينه"}
            </p>
          </div>
          <div>
            <p className="font-medium">الموقع</p>
            <p className="text-muted-foreground">
              {formData.location || "لم يتم تعيينه"}
            </p>
          </div>
        </div>
        <div>
          <p className="font-medium">طبيعة العمل</p>
          <p className="text-muted-foreground">
            {TYPE_LABELS[formData.type] || formData.type || "لم يتم تعيينه"}
          </p>
        </div>
        <div>
          <p className="font-medium">نطاق الراتب</p>
          <p className="text-muted-foreground">
            {formData.salaryMin && formData.salaryMax
              ? `${formData.currency} ${formData.salaryMin} - ${formData.salaryMax}`
              : "لم يتم تعيينه"}
          </p>
        </div>
        <div>
          <p className="font-medium">طريقة التقديم</p>
          <p className="text-muted-foreground">
            {formData.applicationMethod === "profile"
              ? "التقديم بالملف الشخصي"
              : formData.applicationMethod === "both"
                ? "كلاهما — الملف الشخصي + نموذج التقديم"
                : "التقديم بالنموذج"}
          </p>
        </div>
        <div>
          <p className="font-medium">الموعد النهائي للتقديم</p>
          <p className="text-muted-foreground">
            {formData.deadline || "لم يتم تعيينه"}
          </p>
        </div>
      </div>
    </div>
  );
}
