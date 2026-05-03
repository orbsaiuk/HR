"use client";

import Link from "next/link";
import { Briefcase, FileText, Star, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ApplicationRow, StatCard } from "../../components";
import { useFreelancerDashboard } from "../../model/useFreelancerDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export function FreelancerDashboardPage() {
  const { data, loading, error } = useFreelancerDashboard();

  if (loading) {
    return (
      <div dir="rtl" className="space-y-8 rounded-3xl bg-[#F8F9FB] p-6 lg:p-10 min-h-screen">
        <Skeleton className="h-16 w-1/3 rounded-xl" />
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </section>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="flex min-h-[400px] items-center justify-center rounded-3xl bg-[#F8F9FB] p-6">
        <div className="text-center text-red-500 font-medium">{error}</div>
      </div>
    );
  }

  const { header, stats, recentApplications } = data;

  const dynamicStats = [
    {
      title: "المشاريع النشطة",
      value: stats.activeProjects.toString(),
      icon: Briefcase,
      cardClassName: "bg-[#4B2EE8] text-white",
    },
    {
      title: "إجمالي الأرباح",
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: Wallet,
      cardClassName: "bg-[#F6B533] text-white",
    },
    {
      title: "التقييم",
      value: stats.rating.toString(),
      icon: Star,
      cardClassName: "bg-[#5F9E7A] text-white",
    },
    {
      title: "العروض المرسلة",
      value: stats.sentProposals.toString(),
      icon: FileText,
      cardClassName: "bg-[#D33B2A] text-white",
    },
  ];

  return (
    <div
      dir="rtl"
      className="space-y-8 rounded-3xl bg-[#F8F9FB] p-6 lg:p-10 min-h-screen"
    >
      <section className="flex flex-col gap-1.5 text-right">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
          أهلاً، {header.name}! 👋
        </h1>
        <p className="text-sm lg:text-base font-medium text-slate-500">
          لديك{" "}
          <span className="text-slate-700 font-semibold">{header.activeCount} مشاريع نشطة</span> و{" "}
          <span className="text-slate-700 font-semibold">{header.newCount} عروض معلقة</span>{" "}
          في الوقت الحالي
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {dynamicStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm ring-1 ring-slate-100">
        <CardHeader className="flex-row items-center justify-between border-b border-slate-100/80 px-6 py-5">
          <CardTitle className="text-lg lg:text-xl font-bold text-slate-900">
            سجل طلبات التقديم الأخيرة
          </CardTitle>
          <Button
            asChild
            variant="ghost"
            className="h-auto px-4 py-2 text-sm font-semibold text-[#4B2EE8] hover:bg-[#4B2EE8]/5 hover:text-[#4B2EE8]"
          >
            <Link href="/freelancer/contracts">عرض الكل</Link>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col">
            {recentApplications && recentApplications.length > 0 ? (
              recentApplications.map((item, index) => (
                <ApplicationRow
                  key={item.id}
                  item={item}
                  isLast={index === recentApplications.length - 1}
                />
              ))
            ) : (
              <div className="flex h-48 flex-col items-center justify-center p-6 text-center">
                <FileText className="mb-3 h-12 w-12 text-slate-200" />
                <p className="text-base font-semibold text-slate-700">لا توجد طلبات تقديم حديثة</p>
                <p className="mt-1 text-sm text-slate-500">لم تقم بإرسال أي عروض حتى الآن.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
