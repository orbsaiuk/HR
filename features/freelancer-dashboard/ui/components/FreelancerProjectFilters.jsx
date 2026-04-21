import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { key: "all", label: "الكل", countKey: null },
  { key: "completed", label: "مكتملة", countKey: "completed" },
  { key: "active", label: "نشطة", countKey: "active" },
];

export function FreelancerProjectFilters({ activeTab, onTabChange, counts }) {
  return (
    <Tabs dir="rtl" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0 sm:gap-3">
        {tabs.map((tab) => {
          const label =
            tab.countKey === null
              ? tab.label
              : `${tab.label} (${counts[tab.countKey] ?? 0})`;

          return (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="h-9 rounded-md border border-[#C9CEDA] bg-white px-4 text-sm font-medium text-[#6B7280] transition-colors hover:bg-slate-50 hover:text-[#6B7280] data-[state=active]:border-[#4B2EE8] data-[state=active]:bg-[#4B2EE8] data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              {label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
