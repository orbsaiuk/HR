import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Clock, Users, Star, Briefcase } from "lucide-react";
import { GrCurrency } from "react-icons/gr";

const EXPERIENCE_LABELS = {
  entry: "مبتدئ",
  intermediate: "متوسط",
  expert: "خبير",
};

function formatMoney(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatBudget(budgetMin, budgetMax, currency = "USD") {
  if (budgetMin && budgetMax) {
    return `${formatMoney(budgetMin, currency)} - ${formatMoney(budgetMax, currency)}`;
  }
  if (budgetMin) return `من ${formatMoney(budgetMin, currency)}`;
  if (budgetMax) return `حتى ${formatMoney(budgetMax, currency)}`;
  return null;
}

function formatApplicants(count) {
  if (count === null || count === undefined) return null;
  const num = Number(count);
  if (!Number.isFinite(num)) return null;
  if (num === 0) return "لا يوجد متقدمون";
  if (num === 1) return "متقدم واحد";
  if (num === 2) return "متقدمان";
  if (num <= 10) return `${num} متقدمين`;
  return `${num} متقدم`;
}

export function ProjectDetailSidebar({ project, projectId }) {
  const budget = formatBudget(
    project.budgetMin,
    project.budgetMax,
    project.currency,
  );
  const applicantsText = formatApplicants(project.applicantsCount);

  return (
    <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
      {/* Action Buttons + Details Card */}
      <Card>
        <CardHeader>
          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-[#5286A5] hover:bg-[#5286A5]/90"
              size="lg"
            >
              <Link href={`/projects/${projectId}/apply`}>للتقديم الآن</Link>
            </Button>
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link href={`/projects/${projectId}/message`}>مراسلة العميل</Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <dl className="divide-y divide-gray-100">
            {/* Duration */}
            {project.duration && (
              <DetailRow
                icon={<Clock size={14} />}
                label="المدة المتوقعة"
                value={project.duration}
              />
            )}

            {/* Budget */}
            {budget && (
              <DetailRow
                icon={<GrCurrency size={14} />}
                label="الميزانية"
                value={budget}
              />
            )}

            {/* Experience Level */}
            {project.experienceLevel && (
              <DetailRow
                icon={<Briefcase size={14} />}
                label="مستوى الخبرة"
                value={
                  EXPERIENCE_LABELS[project.experienceLevel] ||
                  project.experienceLevel
                }
              />
            )}

            {/* Applicants Count */}
            {applicantsText && (
              <DetailRow
                icon={<Users size={14} />}
                label="المتقدمون"
                value={applicantsText}
              />
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Client Info Card */}
      {project.client && (
        <Card>
          <CardHeader className="pb-3">
            <h3 className="text-sm font-medium text-gray-500">من العميل</h3>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              {/* Client Avatar */}
              <div className="w-12 h-12 rounded-full bg-[#5286A5] flex items-center justify-center text-white text-lg font-semibold">
                {project.client.name?.charAt(0) || "ع"}
              </div>

              {/* Client Info */}
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {project.client.name}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                  {/* Rating */}
                  {project.client.rating && (
                    <span className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                      />
                      {project.client.rating}
                    </span>
                  )}
                  {/* Projects Count */}
                  {project.client.projectsCount != null && (
                    <span>{project.client.projectsCount} مشروع</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <dt className="text-sm text-muted-foreground flex items-center gap-2">
        {icon}
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
