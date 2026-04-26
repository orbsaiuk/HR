import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/shared/lib/sanityImage";
import { ArrowRight, MapPin, Clock, Building2 } from "lucide-react";
import { timeAgo } from "../components/position-card/positionCardUtils";

export function CareerDetailHeader({ position }) {
    const relativeTime = timeAgo(position.createdAt);

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-6">
                <Link
                    href="/careers"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowRight size={16} className="rtl:rotate-0 ltr:rotate-180" />
                    العودة إلى الوظائف
                </Link>

                <h1 className="text-2xl md:text-3xl text-[#5286A5] mb-3">
                    {position.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {position.organizationName && (
                        <Link
                            href={
                                position.organizationSlug
                                    ? `/companies/${position.organizationSlug}`
                                    : "#"
                            }
                            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                        >
                            {position.organizationLogo ? (
                                <Image
                                    src={urlFor(position.organizationLogo)
                                        .width(28)
                                        .height(28)
                                        .url()}
                                    alt=""
                                    width={28}
                                    height={28}
                                    className="w-5 h-5 rounded object-cover"
                                />
                            ) : (
                                <Building2 size={14} />
                            )}
                            {position.organizationName}
                        </Link>
                    )}
                    {position.location && (
                        <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {position.location}
                        </span>
                    )}
                    {relativeTime && (
                        <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {relativeTime}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
