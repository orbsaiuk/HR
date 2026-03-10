"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

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
 * Arabic labels for departments
 */
const DEPARTMENT_OPTIONS = [
    { value: "التصميم", label: "التصميم" },
    { value: "المبيعات", label: "المبيعات" },
    { value: "التسويق", label: "التسويق" },
    { value: "إدارة الأعمال", label: "إدارة الأعمال" },
    { value: "الموارد البشرية", label: "الموارد البشرية" },
    { value: "المالية", label: "المالية" },
    { value: "الهندسة", label: "الهندسة" },
    { value: "التقنية", label: "التقنية" },
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
    { value: "700-1000", label: "$700 – $1000" },
    { value: "1000-1500", label: "$1000 – $1500" },
    { value: "1500-2000", label: "$1500 – $2000" },
    { value: "3000+", label: "$3000 فأعلى" },
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
    // Dynamic departments from API
    apiDepartments = [],
}) {
    const {
        typeCounts = {},
        departmentCounts = {},
        levelCounts = {},
        salaryRangeCounts = {},
    } = filterCounts;

    // Build type options with counts
    const typeOptionsWithCounts = TYPE_OPTIONS.map((opt) => ({
        ...opt,
        count: typeCounts[opt.value] || 0,
    }));

    // Build department options - merge static Arabic labels with dynamic API data
    const departmentOptionsWithCounts =
        apiDepartments.length > 0
            ? apiDepartments.map((dept) => ({
                value: dept,
                label: dept,
                count: departmentCounts[dept] || 0,
            }))
            : DEPARTMENT_OPTIONS.map((opt) => ({
                ...opt,
                count: departmentCounts[opt.value] || 0,
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
                defaultValue={["type", "departments", "level", "salary"]}
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

                {/* Departments */}
                <AccordionItem value="departments">
                    <AccordionTrigger className="text-sm md:text-base text-gray-900 hover:no-underline">
                        الأقسام
                    </AccordionTrigger>
                    <AccordionContent>
                        <FilterCheckboxList
                            options={departmentOptionsWithCounts}
                            selectedValues={selectedDepartments}
                            onToggle={onToggleDepartment}
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
