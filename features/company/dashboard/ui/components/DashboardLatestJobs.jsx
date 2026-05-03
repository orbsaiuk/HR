import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobPositionCard } from "@/features/company/job-positions";

function normalizeDashboardJob(job) {
  return {
    id: job.id,
    title: job.title,
    location: job.location,
    salary: job.salary,
    workType: job.workType,
    level: job.level,
    department: job.industryTag,
    description: job.description,
    applications: job.applications,
    logoText: job.logoText,
    postedAt: job.postedAt,
    status: "open",
  };
}

export function DashboardLatestJobs({ jobs }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-slate-800">أحدث الوظائف</CardTitle>
        <Button variant="link" asChild className="h-auto p-0 text-indigo-600">
          <Link href="/company/positions">عرض الكل</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobPositionCard
                key={job.id}
                position={normalizeDashboardJob(job)}
                detailsHref="/company/positions"
              />
            ))}
          </div>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-500">
            <p>لا توجد وظائف أضيفت مؤخراً</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
