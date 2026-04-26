"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const AVATARS = [
    {
        id: 1,
        title: "مدير تسويق",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        top: "5%",
        start: "15%",
        delay: "0s",
    },
    {
        id: 2,
        title: "مدير تسويق",
        image: "https://randomuser.me/api/portraits/men/44.jpg",
        top: "2%",
        start: "55%",
        delay: "0.5s",
    },
    {
        id: 3,
        title: "مدير تسويق",
        image: "https://randomuser.me/api/portraits/men/36.jpg",
        top: "32%",
        start: "5%",
        delay: "1s",
    },
    {
        id: 4,
        title: "مدير تسويق",
        image: "https://randomuser.me/api/portraits/men/52.jpg",
        top: "35%",
        start: "50%",
        delay: "0.3s",
    },
    {
        id: 5,
        title: "مدير تسويق",
        image: "https://randomuser.me/api/portraits/men/28.jpg",
        top: "62%",
        start: "20%",
        delay: "0.7s",
    },
    {
        id: 6,
        title: "مدير تسويق",
        image: "https://randomuser.me/api/portraits/men/65.jpg",
        top: "58%",
        start: "45%",
        delay: "0.2s",
    },
];

export function HeroSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("السعودية");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) {
            params.set("search", searchQuery.trim());
        }
        if (location && location !== "السعودية") {
            params.set("location", location);
        }
        const query = params.toString();
        router.push(query ? `/careers?${query}` : "/careers");
    };

    return (
        <section className="relative bg-white overflow-hidden min-h-[auto] md:min-h-[580px] bg-hero">
            {/* Decorative hand-drawn arrow */}
            <Image
                src="/images/Home/Hero/hero-arrow.png"
                alt=""
                aria-hidden="true"
                width={64}
                height={64}
                className="absolute top-2 start-[300px] w-16 h-auto z-10 pointer-events-none hidden md:block"
            />

            <div className="relative container mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
                    {/* Right Column - Text Content (appears first in RTL) */}
                    <div className="text-center lg:text-right order-1 lg:ps-4 col-span-1 lg:col-span-2">
                        {/* Main heading */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.3] text-gray-900 mb-4 md:mb-6">
                            حيث تلتقي{" "}
                            <span className="relative inline-block z-1 text-white px-3 sm:px-4 py-1">
                                الكفاءات بالفرص
                                <Image
                                    src="/images/Home/Hero/Vector.png"
                                    alt=""
                                    aria-hidden="true"
                                    fill
                                    sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 400px"
                                    className="object-fill -z-1 pointer-events-none"
                                />
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-sm sm:text-base md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 max-w-3xl leading-relaxed mx-auto lg:mx-0">
                            منصة ذكية تربط الشركات الطموحة بأفضل المواهب بدوام
                            كامل أو بنظام العمل الحر، ضمن تجربة سريعة وموثوقة.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch}>
                            <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-2xl mx-auto lg:mx-0">
                                {/* Job search input */}
                                <div className="relative flex-1">
                                    <Search
                                        size={18}
                                        className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                                    />
                                    <Input
                                        type="text"
                                        placeholder="ابحث عن الوظائف والشركات"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-11 pe-10 ps-4 rounded-lg border-gray-200 bg-white text-sm shadow-none focus-visible:ring-0 focus-visible:border-gray-300"
                                        dir="rtl"
                                    />
                                </div>

                                {/* Location selector */}
                                <Select value={location} onValueChange={setLocation} dir="rtl">
                                    <SelectTrigger className="h-11 w-full sm:w-48 rounded-lg border-gray-200 bg-white shadow-none focus:ring-0 gap-2">
                                        <MapPin size={16} className="text-muted-foreground shrink-0" />
                                        <SelectValue placeholder="السعوديه" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="السعودية">السعوديه</SelectItem>
                                        <SelectItem value="مصر">مصر</SelectItem>
                                        <SelectItem value="الإمارات">الإمارات</SelectItem>
                                        <SelectItem value="الكويت">الكويت</SelectItem>
                                        <SelectItem value="قطر">قطر</SelectItem>
                                        <SelectItem value="البحرين">البحرين</SelectItem>
                                        <SelectItem value="عمان">عمان</SelectItem>
                                        <SelectItem value="الأردن">الأردن</SelectItem>
                                        <SelectItem value="عن بُعد">عن بُعد</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Search button */}
                                <Button
                                    type="submit"
                                    className="h-11 px-10 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm"
                                >
                                    بحث
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Left Column - Avatar Network (appears second in RTL) */}
                    <div className="hidden lg:block relative order-2">
                        <div className="relative w-full h-[480px]">
                            {/* Floating avatar cards */}
                            {AVATARS.map((avatar) => (
                                <AvatarCard
                                    key={avatar.id}
                                    title={avatar.title}
                                    image={avatar.image}
                                    style={{
                                        position: "absolute",
                                        top: avatar.top,
                                        insetInlineStart: avatar.start,
                                        animationDelay: avatar.delay,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function AvatarCard({ title, image, style }) {
    return (
        <div
            className="animate-float-card flex flex-col items-center gap-1.5 w-max"
            style={style}
        >
            {/* Circular avatar with orange border */}
            <div className="w-16 h-16 rounded-full border-[3px] border-amber-500 overflow-hidden bg-gray-100 shadow-md relative">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="64px"
                />
            </div>
            {/* Title badge */}
            <div className="bg-emerald-700 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap shadow-sm">
                {title}
            </div>
        </div>
    );
}
