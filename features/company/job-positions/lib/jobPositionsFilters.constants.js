export const PAGE_SIZE_OPTIONS = [6, 9, 12];

export const STATUS_FILTERS = [
  { value: "all", label: "كل الحالات" },
  { value: "open", label: "نشطة" },
  { value: "draft", label: "مسودة" },
  { value: "on-hold", label: "معلقة" },
  { value: "closed", label: "مغلقة" },
];

export const TYPE_FILTERS = [
  { value: "all", label: "كل الأنواع" },
  { value: "full-time", label: "دوام كامل" },
  { value: "part-time", label: "دوام جزئي" },
  { value: "contract", label: "عقد" },
  { value: "internship", label: "تدريب" },
  { value: "remote", label: "عن بعد" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "oldest", label: "الأقدم" },
  { value: "applications-desc", label: "الأكثر طلبات" },
  { value: "deadline-nearest", label: "الأقرب انتهاءً" },
  { value: "title-asc", label: "العنوان (أ-ي)" },
];
