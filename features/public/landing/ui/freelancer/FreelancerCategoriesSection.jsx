"use client";

import { CategoriesSection } from "@/shared/components/sections/CategoriesSection";
import { useCategories } from "@/shared/hooks/useCategories";

const RESUME_CATEGORIES = [
    {
        label: "برمجه",
        image: "/images/Home/CV/cv-4.png",
    },
    {
        label: "كتابه",
        image: "/images/Home/CV/cv-3.png",
    },
    {
        label: "التصميم",
        image: "/images/Home/CV/cv-2.png",
    },
    {
        label: "اداره اعمال",
        image: "/images/Home/CV/cv-1.png",
    },
    {
        label: "اخرى",
        image: "/images/Home/CV/cv-1.png",
    },
    {
        label: "كتابه",
        image: "/images/Home/CV/cv-2.png",
    },
    {
        label: "تسويق",
        image: "/images/Home/CV/cv-3.png",
    },
    {
        label: "اداره اعمال",
        image: "/images/Home/CV/cv-4.png",
    },
];

export function FreelancerCategoriesSection() {
    const { categories } = useCategories();
    const displayCategories = categories?.length > 0
        ? categories.map((cat, i) => ({
            label: cat.title,
            image: RESUME_CATEGORIES[i % RESUME_CATEGORIES.length].image,
        }))
        : RESUME_CATEGORIES;

    return (
        <CategoriesSection
            title="اختر مجالك وابدأ التقديم على المشاريع المناسبة لك"
            description="نظم مهاراتك، وسيظهر لك أفضل الفرص فورًا."
            buttonTitle="استكشف كل المشاريع"
            categories={displayCategories}
        />
    );
}
