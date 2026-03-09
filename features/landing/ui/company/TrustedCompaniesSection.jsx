"use client";

import { ArrowLeft } from "lucide-react";

const COMPANIES = [
    {
        id: 1,
        name: "اسم الشركة",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg",
    },
    {
        id: 2,
        name: "اسم الشركة",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoft.svg",
    },
    {
        id: 3,
        name: "اسم الشركة",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazon.svg",
    },
    {
        id: 4,
        name: "اسم الشركة",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg",
    },
    {
        id: 5,
        name: "اسم الشركة",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/meta.svg",
    },
    {
        id: 6,
        name: "اسم الشركة",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/netflix.svg",
    },
];

export function TrustedCompaniesSection() {
    return (
        <section className="bg-white py-12">
            <div className="mx-auto container px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <div className="text-center mb-10 sm:mb-14">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
                        شركات تثق بمنصتنا
                    </h2>
                </div>

                {/* Company Logos Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8">
                    {COMPANIES.map((company) => (
                        <div
                            key={company.id}
                            className="flex flex-col items-center gap-3 group cursor-pointer"
                        >
                            {/* Logo Square */}
                            <div className="w-full aspect-square overflow-hidden rounded-sm bg-gray-50 border border-gray-100 flex items-center justify-center p-6">
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="w-full h-full object-contain opacity-70"
                                />
                            </div>
                            {/* Company Name with Arrow */}
                            <div className="flex items-center justify-between gap-1.5 text-gray-600 w-full">
                                <span className="text-xs sm:text-base font-medium underline">
                                    {company.name}
                                </span>
                                <ArrowLeft size={20} className="text-red-700" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
