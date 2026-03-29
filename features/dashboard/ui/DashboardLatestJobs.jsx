import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarClock,
  UsersRound,
  Wallet,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardLatestJobs({ jobs }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-slate-800">أحدث الوظائف</CardTitle>
        <Button variant="link" asChild className="h-auto p-0 text-indigo-600">
          <Link href="/dashboard/positions">عرض الكل</Link>
        </Button>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600">
                    {job.logoText}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-slate-900">{job.title}</h3>
                  <p className="text-xs text-slate-500">{job.location}</p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-600"
              >
                {job.postedAt}
              </Badge>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {job.description}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Wallet size={16} className="text-slate-400" />
                <span>{job.salary}</span>
              </p>
              <p className="flex items-center gap-2">
                <BriefcaseBusiness size={16} className="text-slate-400" />
                <span>{job.level}</span>
              </p>
              <p className="flex items-center gap-2">
                <CalendarClock size={16} className="text-slate-400" />
                <span>{job.workType}</span>
              </p>
              <p className="flex items-center gap-2">
                <UsersRound size={16} className="text-slate-400" />
                <span>{job.applications} طلبات جديدة</span>
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <Badge
                variant="outline"
                className="border-amber-300 text-amber-700"
              >
                {job.industryTag}
              </Badge>
              <Button
                size="sm"
                asChild
                className="rounded-lg bg-indigo-600 hover:bg-indigo-700"
              >
                <Link href={`/dashboard/positions`}>عرض التفاصيل</Link>
              </Button>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
