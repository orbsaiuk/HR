"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Arabic labels for project types
 */
const TYPE_OPTIONS = [
  { value: "web-app", label: "تطبيق ويب" },
  { value: "mobile-app", label: "تطبيق موبايل" },
  { value: "design", label: "تصميم" },
  { value: "data-science", label: "علم البيانات" },
  { value: "consulting", label: "استشارات تقنية" },
];

/**
 * Arabic labels for industries
 */
const INDUSTRY_OPTIONS = [
  { value: "healthcare", label: "الرعاية الصحية" },
  { value: "finance", label: "التمويل" },
  { value: "ecommerce", label: "التجارة الإلكترونية" },
  { value: "education", label: "التعليم" },
  { value: "saas", label: "البرمجيات كخدمة" },
  { value: "real-estate", label: "العقارات" },
  { value: "entertainment", label: "الترفيه" },
];

/**
 * Arabic labels for project status
 */
const STATUS_OPTIONS = [
  { value: "completed", label: "مكتمل" },
  { value: "ongoing", label: "قيد التنفيذ" },
  { value: "archived", label: "أرشيف" },
];

/**
 * Duration range options
 */
const DURATION_OPTIONS = [
  { value: "0-1", label: "أقل من شهر" },
  { value: "1-3", label: "1-3 أشهر" },
  { value: "3-6", label: "3-6 أشهر" },
  { value: "6+", label: "أكثر من 6 أشهر" },
];

/**
 * Team size options
 */
const TEAM_SIZE_OPTIONS = [
  { value: "solo", label: "فردي" },
  { value: "small", label: "صغير (2-5)" },
  { value: "medium", label: "متوسط (6-10)" },
  { value: "large", label: "كبير (10+)" },
];

/**
 * Static fallback for common technologies
 */
const COMMON_TECHNOLOGIES = [
  "React",
  "Node.js",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
  "TypeScript",
  "Next.js",
  "Vue.js",
  "Django",
  "Laravel",
  "Flutter",
  "React Native",
];

/**
 * Renders a list of checkboxes for a filter section
 */
function FilterCheckboxList({ options, selectedValues, onToggle }) {
  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isChecked = selectedValues.includes(option.value);
        return (
          <div
            key={option.value}
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => onToggle(option.value)}
          >
            <div className="flex items-center gap-2.5">
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => onToggle(option.value)}
                className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {option.label}
              </span>
            </div>
            {option.count !== undefined && (
              <span className="text-xs text-gray-400">({option.count})</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

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

  // Build type options with counts
  const typeOptionsWithCounts = TYPE_OPTIONS.map((opt) => ({
    ...opt,
    count: typeCounts[opt.value] || 0,
  }));

  // Build industry options with counts
  const industryOptionsWithCounts = INDUSTRY_OPTIONS.map((opt) => ({
    ...opt,
    count: industryCounts[opt.value] || 0,
  }));

  // Build technology options - use API data if available, fallback to common technologies
  const technologyOptionsWithCounts =
    apiTechnologies.length > 0
      ? apiTechnologies.map((tech) => ({
          value: tech,
          label: tech,
          count: technologyCounts[tech] || 0,
        }))
      : COMMON_TECHNOLOGIES.map((tech) => ({
          value: tech,
          label: tech,
          count: technologyCounts[tech] || 0,
        }));

  // Build status options with counts
  const statusOptionsWithCounts = STATUS_OPTIONS.map((opt) => ({
    ...opt,
    count: statusCounts[opt.value] || 0,
  }));

  // Build duration range options with counts
  const durationOptionsWithCounts = DURATION_OPTIONS.map((opt) => ({
    ...opt,
    count: durationRangeCounts[opt.value] || 0,
  }));

  // Build team size options with counts
  const teamSizeOptionsWithCounts = TEAM_SIZE_OPTIONS.map((opt) => ({
    ...opt,
    count: teamSizeCounts[opt.value] || 0,
  }));

  return (
    <aside className="w-full">
      <Accordion
        type="multiple"
        defaultValue={[
          "type",
          "industry",
          "tech",
          "status",
          "duration",
          "team",
        ]}
        className="w-full"
      >
        {/* Project Type */}
        <AccordionItem value="type">
          <AccordionTrigger className="text-sm md:text-base text-gray-900 hover:no-underline">
            نوع المشروع
          </AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxList
              options={typeOptionsWithCounts}
              selectedValues={selectedTypes}
              onToggle={onToggleType}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Industry */}
        <AccordionItem value="industry">
          <AccordionTrigger className="text-sm md:text-base text-gray-900 hover:no-underline">
            المجال
          </AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxList
              options={industryOptionsWithCounts}
              selectedValues={selectedIndustries}
              onToggle={onToggleIndustry}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Technologies */}
        <AccordionItem value="tech">
          <AccordionTrigger className="text-sm md:text-base text-gray-900 hover:no-underline">
            التقنيات
          </AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxList
              options={technologyOptionsWithCounts}
              selectedValues={selectedTechnologies}
              onToggle={onToggleTechnology}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Status */}
        <AccordionItem value="status">
          <AccordionTrigger className="text-sm md:text-base text-gray-900 hover:no-underline">
            الحالة
          </AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxList
              options={statusOptionsWithCounts}
              selectedValues={selectedStatuses}
              onToggle={onToggleStatus}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Duration */}
        <AccordionItem value="duration">
          <AccordionTrigger className="text-sm md:text-base text-gray-900 hover:no-underline">
            المدة
          </AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxList
              options={durationOptionsWithCounts}
              selectedValues={selectedDurations}
              onToggle={onToggleDuration}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Team Size */}
        <AccordionItem value="team">
          <AccordionTrigger className="text-sm md:text-base text-gray-900 hover:no-underline">
            حجم الفريق
          </AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxList
              options={teamSizeOptionsWithCounts}
              selectedValues={selectedTeamSizes}
              onToggle={onToggleTeamSize}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
