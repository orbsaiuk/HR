import { CONTRACT_TYPES } from "./contractSchema";

const FULL_TIME_CLAUSES = [
  {
    text: "يلتزم الطرف الثاني بتنفيذ جميع المهام المتفق عليها بجودة عالية وفي المواعيد المحددة",
  },
  {
    text: "يحق للطرف الأول إنهاء التعاقد في حالة الإخلال بأي بند مع إشعار مسبق مدته {{noticePeriod}} يوم",
  },
  {
    text: "يلتزم الطرف الثاني بالحفاظ على سرية جميع المعلومات والبيانات المتعلقة بالشركة ومشاريعها ويمنع أي إفشاء إعلامياً ومسبقاً بالعقد",
  },
  { text: "يتم دفع الراتب في نهاية كل شهر ميلادي عبر {{paymentMethod}}" },
  { text: "مدة العقد: {{contractDuration}}" },
  {
    text: "شرط جزائي: في حالة إخلال أي طرف ببنود هذا العقد، يلتزم الطرف المخل بدفع تعويض قدره {{penaltyAmount}} للطرف الآخر",
  },
  {
    text: "لا يحق للطرف الثاني العمل مع منافسين مباشرين خلال فترة سريان العقد وبعدها بـ {{nonCompetePeriod}}",
  },
  {
    text: "جميع حقوق الملكية الفكرية للأعمال المنتجة خلال فترة التعاقد تؤول للطرف الأول بالكامل",
  },
  {
    text: "في حالة نشوء أي نزاع، يتم اللجوء أولاً للتسوية الودية، وفي حال عدم التوصل لاتفاق يكون الاختصاص لمحاكم {{jurisdiction}}",
  },
];

const FREELANCER_CLAUSES = [
  {
    text: "يلتزم الطرف الثاني بتنفيذ جميع المهام المتفق عليها بجودة عالية وفي المواعيد المحددة",
  },
  {
    text: "يحق للطرف الأول إنهاء التعاقد في حالة الإخلال بأي بند مع إشعار مسبق مدته {{noticePeriod}} يوم",
  },
  {
    text: "يلتزم الطرف الثاني بالحفاظ على سرية جميع المعلومات والبيانات المتعلقة بالمشروع",
  },
  {
    text: "يتم دفع المقابل المادي عبر {{paymentMethod}} بعد إتمام المهام المتفق عليها",
  },
  { text: "مدة العقد: {{contractDuration}}" },
  {
    text: "شرط جزائي: في حالة إخلال أي طرف ببنود هذا العقد، يلتزم الطرف المخل بدفع تعويض قدره {{penaltyAmount}} للطرف الآخر",
  },
  {
    text: "جميع حقوق الملكية الفكرية للأعمال المنتجة خلال فترة التعاقد تؤول للطرف الأول بالكامل",
  },
  {
    text: "في حالة نشوء أي نزاع، يتم اللجوء أولاً للتسوية الودية، وفي حال عدم التوصل لاتفاق يكون الاختصاص لمحاكم {{jurisdiction}}",
  },
];

const PART_TIME_CLAUSES = [
  {
    text: "يلتزم الطرف الثاني بتنفيذ جميع المهام المتفق عليها بجودة عالية خلال ساعات العمل المحددة",
  },
  {
    text: "يحق للطرف الأول إنهاء التعاقد في حالة الإخلال بأي بند مع إشعار مسبق مدته {{noticePeriod}} يوم",
  },
  {
    text: "يلتزم الطرف الثاني بالحفاظ على سرية جميع المعلومات والبيانات المتعلقة بالشركة",
  },
  { text: "يتم دفع الراتب في نهاية كل شهر ميلادي عبر {{paymentMethod}}" },
  { text: "مدة العقد: {{contractDuration}}" },
  {
    text: "شرط جزائي: في حالة إخلال أي طرف ببنود هذا العقد، يلتزم الطرف المخل بدفع تعويض قدره {{penaltyAmount}} للطرف الآخر",
  },
  {
    text: "في حالة نشوء أي نزاع، يتم اللجوء أولاً للتسوية الودية، وفي حال عدم التوصل لاتفاق يكون الاختصاص لمحاكم {{jurisdiction}}",
  },
];

const INTERNSHIP_CLAUSES = [
  {
    text: "يلتزم المتدرب (الطرف الثاني) بالحضور في المواعيد المحددة وتنفيذ المهام التدريبية بجدية",
  },
  {
    text: "يحق للطرف الأول إنهاء التدريب في حالة الإخلال بأي بند مع إشعار مسبق مدته {{noticePeriod}} يوم",
  },
  {
    text: "يلتزم المتدرب بالحفاظ على سرية جميع المعلومات والبيانات المتعلقة بالشركة",
  },
  { text: "يتم صرف المكافأة التدريبية عبر {{paymentMethod}}" },
  { text: "مدة التدريب: {{contractDuration}}" },
  {
    text: "في حالة نشوء أي نزاع، يتم اللجوء أولاً للتسوية الودية، وفي حال عدم التوصل لاتفاق يكون الاختصاص لمحاكم {{jurisdiction}}",
  },
];

const NDA_CLAUSES = [
  {
    text: "يلتزم الطرف الثاني بعدم إفشاء أي معلومات سرية يتم مشاركتها خلال فترة التعاقد أو بعدها",
  },
  {
    text: "تشمل المعلومات السرية جميع البيانات التقنية والتجارية والمالية والاستراتيجية",
  },
  {
    text: "يسري هذا الالتزام خلال فترة التعاقد وبعد انتهائه بـ {{nonCompetePeriod}}",
  },
  {
    text: "شرط جزائي: في حالة إخلال الطرف الثاني بالسرية، يلتزم بدفع تعويض قدره {{penaltyAmount}} للطرف الأول",
  },
  { text: "في حالة نشوء أي نزاع، يكون الاختصاص لمحاكم {{jurisdiction}}" },
];

export const CONTRACT_TEMPLATES = [
  {
    id: "freelancer-single-project",
    title: "عقد فريلانسر - مشروع واحد",
    description:
      "عقد مستقل لتنفيذ مشروع محدد يشمل نطاق العمل والميزانية والجدول الزمني.",
    type: CONTRACT_TYPES.FREELANCER_SINGLE_PROJECT,
    category: "فريلانسر",
    usageCount: 45,
    lastUsed: "منذ 3 أيام",
    defaultClauses: FREELANCER_CLAUSES,
  },
  {
    id: "freelancer-monthly",
    title: "عقد فريلانسر - تعاقد شهري",
    description: "عقد تعاون مستمر بنظام الساعات أو المهام مع فريلانسر خارجي.",
    type: CONTRACT_TYPES.FREELANCER_SINGLE_PROJECT,
    category: "فريلانسر",
    usageCount: 45,
    lastUsed: "منذ 3 أيام",
    defaultClauses: FREELANCER_CLAUSES,
  },
  {
    id: "full-time-employment",
    title: "عقد توظيف بدوام كامل",
    description:
      "عقد عمل رسمي يشمل الراتب والمزايا والإجازات وشروط إنهاء التعاقد.",
    type: CONTRACT_TYPES.FULL_TIME,
    category: "دوام كامل",
    usageCount: 45,
    lastUsed: "منذ 3 أيام",
    defaultClauses: FULL_TIME_CLAUSES,
  },
  {
    id: "nda",
    title: "اتفاقية عدم إفشاء (NDA)",
    description: "اتفاقية سرية لحماية المعلومات الحساسة قبل بدء التعاقد.",
    type: CONTRACT_TYPES.FREELANCER_SINGLE_PROJECT,
    category: "فريلانسر",
    usageCount: 45,
    lastUsed: "منذ 3 أيام",
    defaultClauses: NDA_CLAUSES,
  },
  {
    id: "internship",
    title: "عقد تدريب (Internship)",
    description:
      "عقد تدريب للطلاب أو حديثي التخرج يشمل فترة التدريب والمكافأة.",
    type: CONTRACT_TYPES.INTERNSHIP,
    category: "تدريب",
    usageCount: 45,
    lastUsed: "منذ 3 أيام",
    defaultClauses: INTERNSHIP_CLAUSES,
  },
  {
    id: "part-time",
    title: "عقد دوام جزئي",
    description: "عقد عمل جزئي يحدد ساعات العمل والراتب والمسؤوليات.",
    type: CONTRACT_TYPES.PART_TIME,
    category: "دوام جزئي",
    usageCount: 45,
    lastUsed: "منذ 3 أيام",
    defaultClauses: PART_TIME_CLAUSES,
  },
  {
    id: "freelancer-ui-design",
    title: "عقد فريلانسر - تصميم واجهات",
    description:
      "قالب مخصص لمشاريع تصميم واجهات المستخدم وتسليم ملفات التصميم النهائية.",
    type: CONTRACT_TYPES.FREELANCER_SINGLE_PROJECT,
    category: "فريلانسر",
    usageCount: 18,
    lastUsed: "منذ يوم",
    defaultClauses: FREELANCER_CLAUSES,
  },
  {
    id: "freelancer-content-writing",
    title: "عقد فريلانسر - كتابة محتوى",
    description:
      "قالب لتعاقدات كتابة المحتوى التسويقي أو التقني مع مواعيد تسليم واضحة.",
    type: CONTRACT_TYPES.FREELANCER_SINGLE_PROJECT,
    category: "فريلانسر",
    usageCount: 12,
    lastUsed: "اليوم",
    defaultClauses: FREELANCER_CLAUSES,
  },
  {
    id: "full-time-sales",
    title: "عقد دوام كامل - مسؤول مبيعات",
    description:
      "عقد توظيف بدوام كامل لوظائف المبيعات مع أهداف أداء ومسؤوليات تشغيلية.",
    type: CONTRACT_TYPES.FULL_TIME,
    category: "دوام كامل",
    usageCount: 22,
    lastUsed: "منذ 5 أيام",
    defaultClauses: FULL_TIME_CLAUSES,
  },
  {
    id: "full-time-engineer",
    title: "عقد دوام كامل - مهندس برمجيات",
    description:
      "قالب توظيف للمهندسين يشمل بنود الملكية الفكرية والسرية والتسليم.",
    type: CONTRACT_TYPES.FULL_TIME,
    category: "دوام كامل",
    usageCount: 31,
    lastUsed: "منذ 4 أيام",
    defaultClauses: FULL_TIME_CLAUSES,
  },
  {
    id: "part-time-customer-support",
    title: "عقد دوام جزئي - خدمة عملاء",
    description: "قالب عمل جزئي لفِرق خدمة العملاء مع ساعات عمل مرنة.",
    type: CONTRACT_TYPES.PART_TIME,
    category: "دوام جزئي",
    usageCount: 14,
    lastUsed: "منذ 2 أيام",
    defaultClauses: PART_TIME_CLAUSES,
  },
  {
    id: "part-time-accounting",
    title: "عقد دوام جزئي - محاسبة",
    description: "قالب جزئي للمهام المالية والمحاسبية مع نطاق واضح للصلاحيات.",
    type: CONTRACT_TYPES.PART_TIME,
    category: "دوام جزئي",
    usageCount: 9,
    lastUsed: "منذ 6 أيام",
    defaultClauses: PART_TIME_CLAUSES,
  },
  {
    id: "internship-summer-program",
    title: "عقد تدريب - برنامج صيفي",
    description: "قالب تدريب قصير المدى للطلاب خلال الإجازة الصيفية.",
    type: CONTRACT_TYPES.INTERNSHIP,
    category: "تدريب",
    usageCount: 16,
    lastUsed: "منذ 3 أيام",
    defaultClauses: INTERNSHIP_CLAUSES,
  },
  {
    id: "internship-graduate-program",
    title: "عقد تدريب - حديثي التخرج",
    description: "قالب تدريب يمتد لعدة أشهر لتأهيل حديثي التخرج داخل الشركة.",
    type: CONTRACT_TYPES.INTERNSHIP,
    category: "تدريب",
    usageCount: 11,
    lastUsed: "منذ يومين",
    defaultClauses: INTERNSHIP_CLAUSES,
  },
];
