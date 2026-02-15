"use client";

import { Users, UserPlus, Clock, UserCheck, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const STAT_CONFIG = [
  {
    key: "total",
    label: "Total",
    icon: Users,
    color: "text-gray-700",
    bg: "bg-gray-100",
  },
  {
    key: "new",
    label: "New",
    icon: UserPlus,
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: Clock,
    color: "text-purple-700",
    bg: "bg-purple-50",
  },
  {
    key: "hired",
    label: "Hired",
    icon: UserCheck,
    color: "text-green-700",
    bg: "bg-green-50",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    color: "text-red-700",
    bg: "bg-red-50",
  },
];

export function ApplicationsStatsBar({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {STAT_CONFIG.map((s) => {
        const Icon = s.icon;
        const value = stats[s.key] ?? 0;
        return (
          <Card key={s.key} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 p-3">
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <Icon size={16} className={s.color} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-lg font-bold leading-none ${s.color}`}>
                  {value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
