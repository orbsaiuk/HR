import { FREELANCER_CONTRACT_TABS } from "../../model/freelancerContractSchema";
import { Button } from "@/components/ui/button";

export function FreelancerContractFilterTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2" dir="rtl">
      {FREELANCER_CONTRACT_TABS.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <Button
            key={tab.key}
            type="button"
            variant="outline"
            onClick={() => onTabChange(tab.key)}
            className={[
              "h-8 rounded-full border px-4 text-xs font-medium",
              isActive
                ? "border-[#5338D5] bg-[#5338D5] text-white hover:bg-[#462EA8] hover:text-white"
                : "border-[#C7CFDF] bg-white text-[#7A8397] hover:bg-[#F7F8FC]",
            ].join(" ")}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
