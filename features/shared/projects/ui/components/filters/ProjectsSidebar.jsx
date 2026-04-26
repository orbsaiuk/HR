"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FilterCheckboxList } from "./FilterCheckboxList";
import {
  DURATION_OPTIONS,
  INDUSTRY_OPTIONS,
  STATUS_OPTIONS,
  TEAM_SIZE_OPTIONS,
  TYPE_OPTIONS,
} from "./projectsFilterOptions";
import {
  mapOptionsWithCounts,
  mapTechnologyOptionsWithCounts,
} from "./projectsSidebarUtils";

export function ProjectsSidebar({
  // Filter state
  selectedTypes = [],
  onToggleType,
  selectedIndustries = [],
  onToggleIndustry,
  selectedTechnologies = [],
  onToggleTechnology,
  selectedStatuses = [],
  onToggleStatus,
  selectedDurations = [],
  onToggleDuration,
  selectedTeamSizes = [],
  onToggleTeamSize,
  // Counts
  filterCounts = {},
  // Dynamic technologies from API
  apiTechnologies = [],
}) {
  const {
    typeCounts = {},
    industryCounts = {},
    technologyCounts = {},
    statusCounts = {},
    durationRangeCounts = {},
    teamSizeCounts = {},
  } = filterCounts;

  const sections = [
    {
      key: "type",
      label: "نوع المشروع",
      options: mapOptionsWithCounts(TYPE_OPTIONS, typeCounts),
      selectedValues: selectedTypes,
      onToggle: onToggleType,
    },
    {
      key: "industry",
      label: "المجال",
      options: mapOptionsWithCounts(INDUSTRY_OPTIONS, industryCounts),
      selectedValues: selectedIndustries,
      onToggle: onToggleIndustry,
    },
    {
      key: "tech",
      label: "التقنيات",
      options: mapTechnologyOptionsWithCounts(
        apiTechnologies,
        technologyCounts,
      ),
      selectedValues: selectedTechnologies,
      onToggle: onToggleTechnology,
    },
    {
      key: "status",
      label: "الحالة",
      options: mapOptionsWithCounts(STATUS_OPTIONS, statusCounts),
      selectedValues: selectedStatuses,
      onToggle: onToggleStatus,
    },
    {
      key: "duration",
      label: "المدة",
      options: mapOptionsWithCounts(DURATION_OPTIONS, durationRangeCounts),
      selectedValues: selectedDurations,
      onToggle: onToggleDuration,
    },
    {
      key: "team",
      label: "حجم الفريق",
      options: mapOptionsWithCounts(TEAM_SIZE_OPTIONS, teamSizeCounts),
      selectedValues: selectedTeamSizes,
      onToggle: onToggleTeamSize,
    },
  ];

  return (
    <aside className="w-full">
      <Accordion
        type="multiple"
        defaultValue={sections.map((section) => section.key)}
        className="w-full"
      >
        {sections.map((section) => (
          <AccordionItem key={section.key} value={section.key}>
            <AccordionTrigger className="text-sm text-gray-900 hover:no-underline md:text-base">
              {section.label}
            </AccordionTrigger>
            <AccordionContent>
              <FilterCheckboxList
                options={section.options}
                selectedValues={section.selectedValues}
                onToggle={section.onToggle}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
}
