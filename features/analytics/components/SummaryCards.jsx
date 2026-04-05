"use client";

import { Users, CheckCircle, Clock } from "lucide-react";
export function SummaryCards({ analytics }) {
  const formatNumber = (value) => {
    const normalized = Number(value || 0);
    return Number.isNaN(normalized)
      ? "0"
      : new Intl.NumberFormat("ar-SA").format(normalized);
  };

  const cards = [
    {
      title: "إجمالي الاستجابات",
      value: formatNumber(analytics.totalResponses),
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "معدل الإكمال",
      value: `${formatNumber(analytics.completionRate)}%`,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "متوسط وقت الإكمال",
      value: `${analytics.averageTimeToComplete}s`,
      icon: Clock,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3" dir="rtl">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg shadow-sm border border-gray-200 p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} rounded-full p-3`}>
                <Icon className={`w-6 h-6 text-white`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
