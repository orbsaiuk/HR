"use client";

import { Briefcase, Clock, CheckCircle, PauseCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function JobPositionsStats({ positions }) {
  const stats = {
    total: positions.length,
    open: positions.filter((p) => p.status === "open").length,
    closed: positions.filter((p) => p.status === "closed").length,
    onHold: positions.filter((p) => p.status === "on-hold").length,
    totalApplications: positions.reduce(
      (sum, p) => sum + (p.applicationCount || 0),
      0,
    ),
  };

  const cards = [
    {
      label: "Total Positions",
      value: stats.total,
      icon: Briefcase,
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
    {
      label: "Open",
      value: stats.open,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "On Hold",
      value: stats.onHold,
      icon: PauseCircle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Applications",
      value: stats.totalApplications,
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon size={20} className={card.color} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
