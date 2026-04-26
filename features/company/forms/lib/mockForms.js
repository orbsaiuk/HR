export const MOCK_FORMS = [
  {
    _id: "mock-form-1",
    title: "استبيان رضا العملاء بعد الشراء",
    description: "نموذج لجمع تقييم العميل حول تجربة الشراء وخدمة الدعم.",
    status: "published",
    responseCount: 124,
    createdAt: "2026-02-15T09:30:00.000Z",
    updatedAt: "2026-04-02T11:20:00.000Z",
    fields: [
      {
        _key: "mock-form-1-field-1",
        label: "ما مدى رضاك عن سرعة التوصيل؟",
        type: "dropdown",
        required: true,
      },
      {
        _key: "mock-form-1-field-2",
        label: "قيّم جودة المنتج",
        type: "number",
        required: true,
      },
      {
        _key: "mock-form-1-field-3",
        label: "ملاحظات إضافية",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    _id: "mock-form-2",
    title: "طلب عرض سعر لخدمات التطوير",
    description: "نموذج أولي لاستقبال متطلبات العملاء قبل إعداد عرض السعر.",
    status: "published",
    responseCount: 56,
    createdAt: "2026-02-22T12:15:00.000Z",
    updatedAt: "2026-03-29T16:40:00.000Z",
    fields: [
      {
        _key: "mock-form-2-field-1",
        label: "اسم الشركة",
        type: "text",
        required: true,
      },
      {
        _key: "mock-form-2-field-2",
        label: "البريد الإلكتروني",
        type: "email",
        required: true,
      },
      {
        _key: "mock-form-2-field-3",
        label: "وصف نطاق المشروع",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    _id: "mock-form-3",
    title: "نموذج تسجيل شريك تقني",
    description: "استمارة انضمام للشركاء المحتملين مع بيانات التواصل والخبرة.",
    status: "draft",
    responseCount: 0,
    createdAt: "2026-03-01T08:10:00.000Z",
    updatedAt: "2026-03-31T09:55:00.000Z",
    fields: [
      {
        _key: "mock-form-3-field-1",
        label: "اسم الجهة",
        type: "text",
        required: true,
      },
      {
        _key: "mock-form-3-field-2",
        label: "الخبرات التقنية",
        type: "multipleChoice",
        required: false,
      },
      {
        _key: "mock-form-3-field-3",
        label: "ملف تعريفي",
        type: "file",
        required: false,
      },
    ],
  },
  {
    _id: "mock-form-4",
    title: "استبيان احتياجات التوظيف",
    description: "يجمع متطلبات الأقسام الداخلية للوظائف الجديدة المطلوبة.",
    status: "published",
    responseCount: 31,
    createdAt: "2026-03-07T10:45:00.000Z",
    updatedAt: "2026-04-04T14:05:00.000Z",
    fields: [
      {
        _key: "mock-form-4-field-1",
        label: "المسمى الوظيفي المطلوب",
        type: "text",
        required: true,
      },
      {
        _key: "mock-form-4-field-2",
        label: "الأولوية",
        type: "dropdown",
        required: true,
      },
      {
        _key: "mock-form-4-field-3",
        label: "تاريخ البدء المتوقع",
        type: "date",
        required: false,
      },
    ],
  },
  {
    _id: "mock-form-5",
    title: "طلب مشاركة مشروع",
    description: "نموذج موحد لتقديم أفكار مشاريع جديدة من فريق الشركة.",
    status: "archived",
    responseCount: 88,
    createdAt: "2026-01-28T07:20:00.000Z",
    updatedAt: "2026-03-18T18:30:00.000Z",
    fields: [
      {
        _key: "mock-form-5-field-1",
        label: "اسم صاحب الفكرة",
        type: "text",
        required: true,
      },
      {
        _key: "mock-form-5-field-2",
        label: "ملخص الفكرة",
        type: "textarea",
        required: true,
      },
      {
        _key: "mock-form-5-field-3",
        label: "القسم المستفيد",
        type: "text",
        required: false,
      },
    ],
  },
  {
    _id: "mock-form-6",
    title: "تقييم تجربة المقابلة",
    description: "نموذج متابعة جودة تجربة المرشح بعد انتهاء المقابلات.",
    status: "draft",
    responseCount: 0,
    createdAt: "2026-03-19T13:25:00.000Z",
    updatedAt: "2026-04-01T10:15:00.000Z",
    fields: [
      {
        _key: "mock-form-6-field-1",
        label: "وضوح أسئلة المقابلة",
        type: "number",
        required: true,
      },
      {
        _key: "mock-form-6-field-2",
        label: "هل ترغب بإضافة تعليق؟",
        type: "textarea",
        required: false,
      },
    ],
  },
];

export function isMockFormId(formId) {
  return typeof formId === "string" && formId.startsWith("mock-form-");
}

export function getMockFormById(formId) {
  const form = MOCK_FORMS.find((item) => item._id === formId);
  if (!form) return null;

  return {
    ...form,
    fields: Array.isArray(form.fields)
      ? form.fields.map((field) => ({ ...field }))
      : [],
    isMock: true,
  };
}
