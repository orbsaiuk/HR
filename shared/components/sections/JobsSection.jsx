"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselDots,
} from "@/components/ui/carousel";
import { JobCard } from "@/features/public/landing/ui/user/JobCard";

export function JobsSection({ title, description, buttonTitle, jobs }) {
    return (
        <section className="py-8 sm:py-12 bg-gray-50">
            <div className="mx-auto container px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-12"
                    dir="rtl"
                >
                    <div className="text-right">
                        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-tight mb-2 sm:mb-3">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                    <Button
                        asChild
                        className="h-10 sm:h-11 px-6 sm:px-8 rounded-lg font-medium text-sm sm:text-base w-full sm:w-auto shrink-0"
                    >
                        <Link href="/careers">{buttonTitle}</Link>
                    </Button>
                </div>

                {/* Jobs Carousel */}
                <Carousel
                    opts={{
                        align: "start",
                        direction: "rtl",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-mr-4 ml-0">
                        {jobs.map((job) => (
                            <CarouselItem
                                key={job.id}
                                className="pr-4 pl-0 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                            >
                                <JobCard job={job} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselDots className="mt-6 sm:mt-8" />
                </Carousel>
            </div>
        </section>
    );
}
