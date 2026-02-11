"use client";

import { Users, UserCheck, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useApplicationStats } from "../model/useApplicationStats";

export function ApplicationsStats() {
  const { stats, loading } = useApplicationStats();

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-16 animate-pulse bg-gray-100 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total",
      value: stats.total,
      icon: Users,
      color: "text-gray-700",
      bg: "bg-gray-50",
    },
    {
      label: "New",
      value: stats.new,
      icon: Clock,
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      label: "In Progress",
      value: stats.screening + stats.interview,
      icon: Star,
      color: "text-purple-700",
      bg: "bg-purple-50",
    },
    {
      label: "Hired",
      value: stats.hired,
      icon: UserCheck,
      color: "text-green-700",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.bg}`}>
                  <Icon size={20} className={card.color} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
