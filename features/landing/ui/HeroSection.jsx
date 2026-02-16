"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export function HeroSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/careers?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push("/careers");
        }
    };

    return (
        <section className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
            <div className="container mx-auto px-4 py-20 md:py-28">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Find Your Next
                        <span className="text-blue-200"> Career Opportunity</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Connect with top companies hiring right now. Browse thousands of job
                        openings and take the next step in your career.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-2">
                            <div className="relative flex-1">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Job title, keyword, or company..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                                />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3.5 rounded-lg font-semibold"
                            >
                                Search Jobs
                            </Button>
                        </div>
                    </form>

                    {/* Quick Links */}
                    <div className="flex flex-wrap justify-center gap-3 mt-6">
                        <Link href="/careers?type=remote">
                            <Badge
                                variant="secondary"
                                className="bg-white/15 text-white hover:bg-white/25 cursor-pointer px-3 py-1"
                            >
                                Remote Jobs
                            </Badge>
                        </Link>
                        <Link href="/careers?type=full-time">
                            <Badge
                                variant="secondary"
                                className="bg-white/15 text-white hover:bg-white/25 cursor-pointer px-3 py-1"
                            >
                                Full-time
                            </Badge>
                        </Link>
                        <Link href="/careers?type=internship">
                            <Badge
                                variant="secondary"
                                className="bg-white/15 text-white hover:bg-white/25 cursor-pointer px-3 py-1"
                            >
                                Internships
                            </Badge>
                        </Link>
                        <Link href="/careers">
                            <Badge
                                variant="secondary"
                                className="bg-white/15 text-white hover:bg-white/25 cursor-pointer px-3 py-1"
                            >
                                Browse All Jobs
                            </Badge>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
