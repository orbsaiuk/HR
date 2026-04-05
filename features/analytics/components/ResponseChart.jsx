"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

export function ResponseChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div
        className="rounded-lg border border-gray-200 bg-white p-12 text-center"
        dir="rtl"
      >
        <TrendingUp className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold text-gray-700">
          لا توجد بيانات استجابة
        </h3>
        <p className="text-gray-500">
          ستظهر البيانات هنا بمجرد بدء المستخدمين بإرسال الاستجابات.
        </p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("ar-SA", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6" dir="rtl">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">
        تطور الاستجابات عبر الوقت
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value) => [
              new Intl.NumberFormat("ar-SA").format(value),
              "عدد الاستجابات",
            ]}
            labelFormatter={(label) => `التاريخ: ${label}`}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
