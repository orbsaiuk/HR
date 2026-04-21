import Link from "next/link";
import { Briefcase, FileText, Star, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { StatCard } from "../components/StatCard";
import { ApplicationRow } from "../components/ApplicationRow";

const stats = [
  {
    title: "المشاريع النشطة",
    value: "2",
    icon: Briefcase,
    cardClassName: "bg-[#4B2EE8] text-white",
  },
  {
    title: "إجمالي الأرباح",
    value: "21,300",
    icon: Wallet,
    cardClassName: "bg-[#F6B533] text-white",
  },
  {
    title: "التقييم",
    value: "4.8",
    icon: Star,
    cardClassName: "bg-[#5F9E7A] text-white",
  },
  {
    title: "العروض المرسلة",
    value: "10",
    icon: FileText,
    cardClassName: "bg-[#D33B2A] text-white",
  },
];

const recentApplications = [
  {
    id: "app-1",
    title: "تطوير موقع تجارة إلكترونية",
    company: "شركة تقنية بلس",
    location: "القاهرة، مصر",
    budget: "$3,000 - $5,000",
    level: "مستوى متقدم",
    submittedAt: "24 July 2021",
    status: "بانتظار الرد",
  },
  {
    id: "app-2",
    title: "تطوير موقع تجارة إلكترونية",
    company: "شركة تقنية بلس",
    location: "القاهرة، مصر",
    budget: "$3,000 - $5,000",
    level: "مستوى متقدم",
    submittedAt: "24 July 2021",
    status: "بانتظار الرد",
  },
  {
    id: "app-3",
    title: "تطوير موقع تجارة إلكترونية",
    company: "شركة تقنية بلس",
    location: "القاهرة، مصر",
    budget: "$3,000 - $5,000",
    level: "مستوى متقدم",
    submittedAt: "24 July 2021",
    status: "بانتظار الرد",
  },
  {
    id: "app-4",
    title: "تطوير موقع تجارة إلكترونية",
    company: "شركة تقنية بلس",
    location: "القاهرة، مصر",
    budget: "$3,000 - $5,000",
    level: "مستوى متقدم",
    submittedAt: "24 July 2021",
    status: "بانتظار الرد",
  },
  {
    id: "app-5",
    title: "تطوير موقع تجارة إلكترونية",
    company: "شركة تقنية بلس",
    location: "القاهرة، مصر",
    budget: "$3,000 - $5,000",
    level: "مستوى متقدم",
    submittedAt: "24 July 2021",
    status: "بانتظار الرد",
  },
];

export function FreelancerDashboardPage() {
  return (
    <div
      dir="rtl"
      className="space-y-8 rounded-3xl bg-[#F8F9FB] p-6 lg:p-10 min-h-screen"
    >
      <section className="flex flex-col gap-1.5 text-right">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
          أهلاً، علي! 👋
        </h1>
        <p className="text-sm lg:text-base font-medium text-slate-500">
          لديك{" "}
          <span className="text-slate-700 font-semibold">3 مشاريع نشطة</span> و{" "}
          <span className="text-slate-700 font-semibold">2 عروض جديدة</span>{" "}
          بانتظارك
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {stats.map((stat) => (
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
            <Link href="/freelancer/my-applications">عرض الكل</Link>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col">
            {recentApplications.map((item, index) => (
              <ApplicationRow
                key={item.id}
                item={item}
                isLast={index === recentApplications.length - 1}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
