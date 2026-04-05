const PROJECT_CARD_MOCK_TEMPLATE = {
  title: "تطوير تطبيق موبايل للمتجر الإلكتروني",
  location: "الرياض، السعودية",
  category: "برمجة",
  status: "قيد التنفيذ",
  description:
    "تطبيق React Native لمتجر إلكتروني يشمل عربة التسوق، الدفع الإلكتروني، وإشعارات الطلبات.",
  duration: "2-4 أسابيع",
  budgetRange: "$3,000 - $5,000",
};

export const COMPANY_PROJECTS_MOCK = Array.from({ length: 6 }, (_, index) => ({
  id: `project-${index + 1}`,
  ...PROJECT_CARD_MOCK_TEMPLATE,
}));
