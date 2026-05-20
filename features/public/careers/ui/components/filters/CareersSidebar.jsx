"use client";

import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategories } from "@/shared/hooks/useCategories";

/**
 * Arabic labels for employment types
 */
const TYPE_OPTIONS = [
  { value: "full-time", label: "دوام كامل" },
  { value: "part-time", label: "دوام جزئي" },
  { value: "remote", label: "عن بعد" },
  { value: "internship", label: "تدريب" },
  { value: "contract", label: "تعاقد" },
];

/**
 * Arabic labels for job levels
 */
const LEVEL_OPTIONS = [
  { value: "entry", label: "مبتدئ" },
  { value: "mid", label: "متوسط الخبرة" },
  { value: "senior", label: "خبير" },
  { value: "manager", label: "مدير" },
];

/**
 * Salary range options
 */
const SALARY_RANGE_OPTIONS = [
  { value: "700-1000", label: "700 – 1000 USD" },
  { value: "1000-1500", label: "1000 – 1500 USD" },
  { value: "1500-2000", label: "1500 – 2000 USD" },
  { value: "3000+", label: "3000+ USD" },
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

/**
 * Renders categories with nested subcategories as checkboxes.
 * - Parent categories with subcategories show as a bold label with indented children.
 * - Parent categories without subcategories are directly selectable.
 */
function CategoryCheckboxList({ categories, selectedValues, onToggle, departmentCounts }) {
  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const hasSubs = cat.subcategories?.length > 0;

        if (hasSubs) {
          // Count all positions that match any subcategory of this parent
          const parentCount = cat.subcategories.reduce(
            (sum, sub) => sum + (departmentCounts[sub.title] || 0),
            0,
          );

          return (
            <div key={cat._id || cat.slug}>
              {/* Parent category label (non-selectable header) */}
              <p className="text-xs font-bold text-muted-foreground mb-2">
                {cat.title}
                {parentCount > 0 && (
                  <span className="text-gray-400 font-normal mr-1">({parentCount})</span>
                )}
              </p>
              {/* Subcategories as checkboxes */}
              <div className="space-y-2.5 pr-2">
                {cat.subcategories.map((sub) => {
                  const isChecked = selectedValues.includes(sub.title);
                  const count = departmentCounts[sub.title] || 0;
                  return (
                    <div
                      key={sub.slug}
                      className="flex items-center justify-between cursor-pointer group"
                      onClick={() => onToggle(sub.title)}
                    >
                      <div className="flex items-center gap-2.5">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => onToggle(sub.title)}
                          className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          {sub.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">({count})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // Category without subcategories — directly selectable
        const isChecked = selectedValues.includes(cat.title);
        const count = departmentCounts[cat.title] || 0;
        return (
          <div
            key={cat._id || cat.slug}
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => onToggle(cat.title)}
          >
            <div className="flex items-center gap-2.5">
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => onToggle(cat.title)}
                className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {cat.title}
              </span>
            </div>
            <span className="text-xs text-gray-400">({count})</span>
          </div>
        );
      })}
    </div>
  );
}

export function CareersSidebar({
  // Filter state
  selectedTypes = [],
  onToggleType,
  selectedDepartments = [],
  onToggleDepartment,
  selectedLevels = [],
  onToggleLevel,
  selectedSalaryRanges = [],
  onToggleSalaryRange,
  // Counts
  filterCounts = {},
}) {
  const {
    typeCounts = {},
    departmentCounts = {},
    levelCounts = {},
    salaryRangeCounts = {},
  } = filterCounts;

  const { categories } = useCategories();

  // Build type options with counts
  const typeOptionsWithCounts = TYPE_OPTIONS.map((opt) => ({
    ...opt,
    count: typeCounts[opt.value] || 0,
  }));

  // Build level options with counts
  const levelOptionsWithCounts = LEVEL_OPTIONS.map((opt) => ({
    ...opt,
    count: levelCounts[opt.value] || 0,
  }));

  // Build salary range options with counts
  const salaryRangeOptionsWithCounts = SALARY_RANGE_OPTIONS.map((opt) => ({
    ...opt,
    count: salaryRangeCounts[opt.value] || 0,
  }));

  return (
    <aside className="w-full">
      <Accordion
        type="multiple"
        defaultValue={["type", "categories", "level", "salary"]}
        className="w-full"
      >
        {/* Employment Type */}
        <AccordionItem value="type">
          <AccordionTrigger className="text-sm md:text-base text-gray-900 hover:no-underline">
            نوع التوظيف
          </AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxList
              options={typeOptionsWithCounts}
              selectedValues={selectedTypes}
              onToggle={onToggleType}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm md:text-base text-gray-900 hover:no-underline">
            التصنيف
          </AccordionTrigger>
          <AccordionContent>
            <CategoryCheckboxList
              categories={categories}
              selectedValues={selectedDepartments}
              onToggle={onToggleDepartment}
              departmentCounts={departmentCounts}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Job Level */}
        <AccordionItem value="level">
          <AccordionTrigger className="text-sm md:text-base text-gray-900 hover:no-underline">
            المستوى الوظيفي
          </AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxList
              options={levelOptionsWithCounts}
              selectedValues={selectedLevels}
              onToggle={onToggleLevel}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Salary Range */}
        <AccordionItem value="salary">
          <AccordionTrigger className="text-sm md:text-base text-gray-900 hover:no-underline">
            نطاق الراتب
          </AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxList
              options={salaryRangeOptionsWithCounts}
              selectedValues={selectedSalaryRanges}
              onToggle={onToggleSalaryRange}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
