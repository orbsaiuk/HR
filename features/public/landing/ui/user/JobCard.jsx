"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Banknote } from "lucide-react";

export function JobCard({ job }) {
  return (
    <Card className="h-full overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl bg-white">
      <CardContent className="p-4 sm:p-5">
        {/* Company Info */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            <Image
              src={job.companyLogo}
              alt={job.company}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base text-gray-900 truncate mb-0.5">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs sm:text-sm truncate">{job.company}</span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs sm:text-sm">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Banknote className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs sm:text-sm">{job.salary} ر.س</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            variant="secondary"
            className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-100"
          >
            {job.type}
          </Badge>
          {job.isRemote && (
            <Badge
              variant="secondary"
              className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
            >
              عن بُعد
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 h-9 rounded-lg bg-[#5286A5] hover:bg-[#5286A5]/90 text-white text-xs sm:text-sm"
          >
            <Link href="/careers">قدّم الآن</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="flex-1 h-9 rounded-lg border-[#5286A5] text-[#5286A5] text-xs sm:text-sm"
          >
            <Link href="/careers">عرض التفاصيل</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
