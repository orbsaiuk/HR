"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarPageHeader } from "../components/CalendarPageHeader";
import { InteractiveMonthCalendar } from "../components/InteractiveMonthCalendar";
import { AppointmentCard } from "../components/AppointmentCard";
import Link from "next/link";

export function CalendarDashboard() {
  const [date, setDate] = useState(new Date(2026, 2, 10)); // Fixed to March 10, 2026 for the UI match

  // Mock Data
  const selectedDayAppointments = [
    {
      id: 1,
      title: "مقابلة مطور React",
      subtitle: "مقابلة مع أحمد محمد - مطور Frontend",
      time: "10:00 ص",
      person: "أحمد محمد",
      type: "مقابلة",
    },
    {
      id: 2,
      title: "مقابلة مطور React",
      subtitle: "مقابلة مع أحمد محمد - مطور Frontend",
      time: "10:00 ص",
      person: "أحمد محمد",
      type: "مقابلة",
    },
  ];

  const upcomingAppointments = [
    {
      id: 3,
      title: "مقابلة مطور React",
      subtitle: "مقابلة مع أحمد محمد - مطور Frontend",
      time: "10:00 ص",
      date: "١ مارس",
      type: "مقابلة",
    },
    {
      id: 4,
      title: "مقابلة مطور React",
      subtitle: "مقابلة مع أحمد محمد - مطور Frontend",
      time: "10:00 ص",
      date: "١ مارس",
      type: "مقابلة",
    },
    {
      id: 5,
      title: "مقابلة مطور React",
      subtitle: "مقابلة مع أحمد محمد - مطور Frontend",
      time: "10:00 ص",
      date: "١ مارس",
      type: "مقابلة",
    },
    {
      id: 6,
      title: "مقابلة مطور React",
      subtitle: "مقابلة مع أحمد محمد - مطور Frontend",
      time: "10:00 ص",
      date: "١ مارس",
      type: "مقابلة",
    },
  ];

  return (
    <div className="p-6 md:p-8 text-[#2F3646]" dir="rtl">
      <CalendarPageHeader />

      <div className="mb-8 rounded-xl border border-[#E6E8F0] bg-[#FCFCFE] p-3 md:p-4 shadow-[0_1px_2px_rgba(38,43,62,0.04)]">
        <div className="flex flex-col gap-5 items-start">
          <h2 className="text-xl md:text-3xl leading-[1.2] font-medium text-[#4C556A] mb-3 text-right">
            مواعيد يوم الثلاثاء، ١٠ مارس ٢٠٢٦
          </h2>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full m-0 p-0">
            <div className="w-full lg:col-span-1 shrink-0">
              <InteractiveMonthCalendar date={date} setDate={setDate} />
            </div>
            <div className="space-y-3 lg:col-span-2">
              {selectedDayAppointments.map((apt) => (
                <AppointmentCard key={apt.id} {...apt} className="w-full" />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Upcoming Section (Full Width Bottom) */}
      <section id="upcoming" className="w-full m-0 p-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#4C556A]">
            المواعيد القادمة
          </h2>
          <Link
            href="/company/calendar#upcoming"
            className="text-sm font-semibold text-secondary-700 hover:text-secondary-800"
          >
            عرض الكل
          </Link>
        </div>
        <div className="bg-white border border-[#E6E8F0] rounded-xl p-3 shadow-[0_1px_2px_rgba(38,43,62,0.04)]">
          <div className="space-y-3 flex flex-col">
            {upcomingAppointments.map((apt) => (
              <AppointmentCard key={apt.id} {...apt} className="w-full" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
