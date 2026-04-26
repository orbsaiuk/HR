import { BriefcaseBusiness, Eye, Target, UsersRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ICONS = {
  "active-jobs": BriefcaseBusiness,
  "total-applicants": UsersRound,
  "job-views": Eye,
  "hiring-rate": Target,
};

const TONE_STYLES = {
  indigo: {
    card: "bg-indigo-600 text-white",
    label: "text-indigo-100",
    value: "text-white",
    icon: "text-white/90",
  },
  amber: {
    card: "bg-amber-400 text-slate-900",
    label: "text-amber-950/80",
    value: "text-slate-900",
    icon: "text-amber-950/80",
  },
  emerald: {
    card: "bg-emerald-600 text-white",
    label: "text-emerald-100",
    value: "text-white",
    icon: "text-white/90",
  },
  rose: {
    card: "bg-rose-600 text-white",
    label: "text-rose-100",
    value: "text-white",
    icon: "text-white/90",
  },
};

export function DashboardStatCards({ metrics }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = ICONS[metric.id] || BriefcaseBusiness;
        const tone = TONE_STYLES[metric.tone] || TONE_STYLES.indigo;

        return (
          <Card key={metric.id} className={`border-0 shadow-md ${tone.card}`}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className={`text-sm ${tone.label}`}>{metric.label}</p>
                <p className={`mt-2 text-3xl font-bold ${tone.value}`}>
                  {metric.value}
                </p>
              </div>
              <div className="rounded-full bg-white/15 p-2.5">
                <Icon className={tone.icon} size={20} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
