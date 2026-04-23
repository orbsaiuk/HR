export const FREELANCER_EVENT_TYPES = [
  {
    value: "project_delivery",
    label: "تسليم مشروع",
    badgeClassName: "bg-[#EDE9FD] text-[#5B4AE4]",
    dotClassName: "bg-[#5B4AE4]",
  },
  {
    value: "milestone",
    label: "تسليم مرحلة",
    badgeClassName: "bg-[#E5F0FF] text-[#2563EB]",
    dotClassName: "bg-[#2563EB]",
  },
  {
    value: "reminder",
    label: "تذكير",
    badgeClassName: "bg-[#EAF7EF] text-[#2E7D32]",
    dotClassName: "bg-[#2E7D32]",
  },
  {
    value: "review",
    label: "مراجعة",
    badgeClassName: "bg-[#FFF3E4] text-[#C26A18]",
    dotClassName: "bg-[#C26A18]",
  },
];

export const FREELANCER_PRIORITY_OPTIONS = [
  {
    value: "high",
    label: "عالية",
    badgeClassName: "bg-[#FEE2E2] text-[#B91C1C]",
  },
  {
    value: "medium",
    label: "متوسطة",
    badgeClassName: "bg-[#FEF3C7] text-[#B45309]",
  },
  {
    value: "low",
    label: "منخفضة",
    badgeClassName: "bg-[#DCFCE7] text-[#166534]",
  },
];

export const EVENT_TYPE_MAP = FREELANCER_EVENT_TYPES.reduce((acc, item) => {
  acc[item.value] = item;
  return acc;
}, {});

export const PRIORITY_MAP = FREELANCER_PRIORITY_OPTIONS.reduce((acc, item) => {
  acc[item.value] = item;
  return acc;
}, {});
