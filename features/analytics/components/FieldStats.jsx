"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export function FieldStats({ stats }) {
  const isChoiceField = ["multipleChoice", "dropdown"].includes(stats.type);
  const isNumericField = stats.type === "number";

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];
  const answerRate = stats.totalResponses
    ? (stats.answeredCount / stats.totalResponses) * 100
    : 0;

  const typeLabel =
    {
      text: "نص قصير",
      textarea: "نص طويل",
      number: "رقم",
      email: "بريد إلكتروني",
      multipleChoice: "اختيار متعدد",
      dropdown: "قائمة منسدلة",
      date: "تاريخ",
      time: "وقت",
      datetime: "تاريخ ووقت",
      file: "رفع ملف",
    }[stats.type] || stats.type;

  const formatPercent = (value) =>
    `${new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 1 }).format(value || 0)}%`;
  const formatNumber = (value) =>
    new Intl.NumberFormat("ar-SA").format(value || 0);

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      dir="rtl"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            {stats.label || "حقل بدون عنوان"}
          </h4>
          <p className="text-sm text-gray-500">{typeLabel}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {formatNumber(stats.answeredCount)} مجاب
          </span>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {formatNumber(stats.skippedCount)} متروك
          </span>
        </div>
      </div>

      {/* Distribution Chart for Choice Fields */}
      {isChoiceField && stats.distribution && (
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={Object.entries(stats.distribution).map(
                  ([name, value]) => ({
                    name,
                    value,
                  }),
                )}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
              >
                {Object.entries(stats.distribution).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Numeric Stats for Number/Rating Fields */}
      {isNumericField && stats.average !== undefined && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">المتوسط</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.average.toFixed(1)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">الحد الأدنى</p>
            <p className="text-2xl font-bold text-gray-900">{stats.min}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">الحد الأعلى</p>
            <p className="text-2xl font-bold text-gray-900">{stats.max}</p>
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>معدل الإجابة</span>
          <span>{formatPercent(answerRate)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{
              width: `${answerRate}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
