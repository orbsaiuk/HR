"use client";

import { useMemo, useState } from "react";

import { InteractiveMonthCalendar } from "@/features/company/calendar/components/InteractiveMonthCalendar";
import { FreelancerCalendarHeader } from "./components/FreelancerCalendarHeader";

import { cn } from "@/lib/utils";
import { CreateReminderDialog } from "./components/CreateReminderDialog";
import { FreelancerReminderCard } from "./components/FreelancerReminderCard";
import { FreelancerUpcomingSection } from "./components/FreelancerUpcomingSection";

const arabicFullDateFormatter = new Intl.DateTimeFormat("ar-EG-u-nu-arab", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const arabicDateFormatter = new Intl.DateTimeFormat("ar-EG-u-nu-arab", {
  day: "numeric",
  month: "long",
});

const arabicTimeFormatter = new Intl.DateTimeFormat("ar-EG-u-nu-arab", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const INITIAL_REMINDERS = [
  {
    id: "rem-1",
    title: "تسليم تصميم الهوية البصرية",
    type: "project_delivery",
    projectName: "هوية متجر العبير",
    projectHref: "/freelancer/projects",
    priority: "high",
    date: "2026-03-12",
    time: "10:00",
    notes: "إرسال ملفات المصدر مع نسخة العرض النهائية",
  },
  {
    id: "rem-2",
    title: "تسليم المرحلة الأولى",
    type: "milestone",
    projectName: "لوحة إدارة الطلبات",
    projectHref: "/freelancer/projects",
    priority: "medium",
    date: "2026-03-12",
    time: "13:30",
    notes: "مراجعة عناصر واجهة المستخدم قبل التسليم",
  },
  {
    id: "rem-3",
    title: "تذكير بمتابعة العميل",
    type: "reminder",
    projectName: "تطبيق الخدمات المنزلية",
    projectHref: "/freelancer/projects",
    priority: "low",
    date: "2026-03-14",
    time: "09:30",
    notes: "التأكد من اعتماد النسخة التجريبية",
  },
  {
    id: "rem-4",
    title: "مراجعة نهائية قبل الإطلاق",
    type: "review",
    projectName: "منصة الدورات التعليمية",
    projectHref: "/freelancer/projects",
    priority: "high",
    date: "2026-03-18",
    time: "15:00",
    notes: "فحص التوافق مع الهواتف والأجهزة اللوحية",
  },
  {
    id: "rem-5",
    title: "تسليم مشروع متجر الأزياء",
    type: "project_delivery",
    projectName: "متجر الأزياء السريع",
    projectHref: "/freelancer/projects",
    priority: "high",
    date: "2026-03-20",
    time: "11:00",
    notes: "تسليم نسخة الأداء النهائية",
  },
];

function dateToKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getTimeInMinutes(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatArabicTime(value) {
  if (!value) return "--:--";
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date(2000, 0, 1, hours, minutes || 0, 0, 0);
  return arabicTimeFormatter.format(date);
}

function toDisplayReminder(item) {
  return {
    ...item,
    displayTime: formatArabicTime(item.time),
  };
}

export function FreelancerCalendarPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState(null);

  const selectedDateKey = useMemo(() => dateToKey(selectedDate), [selectedDate]);

  const filteredReminders = reminders;

  const remindersByDate = useMemo(() => {
    const grouped = filteredReminders.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {});

    for (const key of Object.keys(grouped)) {
      grouped[key].sort((a, b) => getTimeInMinutes(a.time) - getTimeInMinutes(b.time));
    }

    return grouped;
  }, [filteredReminders]);

  const selectedDayReminders = useMemo(
    () => (remindersByDate[selectedDateKey] || []).map(toDisplayReminder),
    [remindersByDate, selectedDateKey],
  );

  const upcomingGroups = useMemo(() => {
    const todayKey = dateToKey(new Date());

    return Object.keys(remindersByDate)
      .filter((dateKey) => dateKey >= todayKey)
      .sort((a, b) => a.localeCompare(b))
      .map((dateKey) => ({
        dateKey,
        dateLabel: arabicDateFormatter.format(parseDateKey(dateKey)),
        items: remindersByDate[dateKey].map(toDisplayReminder),
      }));
  }, [remindersByDate]);

  const calendarEventDates = useMemo(
    () => filteredReminders.map((item) => parseDateKey(item.date)),
    [filteredReminders],
  );

  const editingReminder = useMemo(
    () => reminders.find((item) => item.id === editingReminderId) ?? null,
    [reminders, editingReminderId],
  );

  function handleCreateReminder() {
    setEditingReminderId(null);
    setDialogOpen(true);
  }

  function handleEditReminder(reminderId) {
    setEditingReminderId(reminderId);
    setDialogOpen(true);
  }

  function handleDeleteReminder(reminderId) {
    setReminders((current) => current.filter((item) => item.id !== reminderId));
  }

  function handleDialogOpenChange(nextOpen) {
    setDialogOpen(nextOpen);
    if (!nextOpen) {
      setEditingReminderId(null);
    }
  }

  function handleSaveReminder(values) {
    if (editingReminderId) {
      setReminders((current) =>
        current.map((item) =>
          item.id === editingReminderId
            ? {
                ...item,
                ...values,
              }
            : item,
        ),
      );
      return;
    }

    const newReminder = {
      id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `rem-${Date.now()}`,
      title: values.title,
      type: values.type,
      projectName: values.projectName || "تذكير شخصي",
      projectHref: "/freelancer/projects",
      priority: values.priority,
      date: values.date,
      time: values.time,
      notes: values.notes,
    };

    setReminders((current) => [...current, newReminder]);
  }

  const selectedDateLabel = arabicFullDateFormatter.format(selectedDate);

  return (
    <div className="p-6 md:p-8 text-[#2F3646]" dir="rtl">
      <CreateReminderDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleSaveReminder}
        initialValues={
          editingReminder
            ? {
                title: editingReminder.title,
                type: editingReminder.type,
                date: editingReminder.date,
                time: editingReminder.time,
                priority: editingReminder.priority,
                projectName: editingReminder.projectName,
                notes: editingReminder.notes,
              }
            : undefined
        }
        mode={editingReminder ? "edit" : "create"}
      />

      <FreelancerCalendarHeader onAddReminder={handleCreateReminder} />

      <div className="mb-8 rounded-xl border border-[#E6E8F0] bg-[#FCFCFE] p-3 md:p-4 shadow-[0_1px_2px_rgba(38,43,62,0.04)]">
        <div className="flex flex-col gap-5 items-start">
          <h2 className="text-xl md:text-3xl leading-[1.2] font-medium text-[#4C556A] mb-3 text-right">
            {`تذكيرات ${selectedDateLabel}`}
          </h2>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full m-0 p-0">
            <div className="w-full lg:col-span-1 shrink-0">
              <InteractiveMonthCalendar
                date={selectedDate}
                setDate={(nextDate) => {
                  if (!nextDate) return;
                  setSelectedDate(nextDate);
                }}
                eventDates={calendarEventDates}
              />
            </div>
            
            <div className="space-y-3 lg:col-span-2">
              {selectedDayReminders.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#D7DBE6] bg-[#FAFBFD] px-4 py-8 text-center text-sm text-[#8A90A2]">
                  لا توجد تذكيرات في هذا اليوم
                </div>
              ) : (
                selectedDayReminders.map((item) => (
                  <FreelancerReminderCard
                    key={item.id}
                    title={item.title}
                    time={item.displayTime}
                    type={item.type}
                    projectName={item.projectName}
                    projectHref={item.projectHref}
                    priority={item.priority}
                    onEdit={() => handleEditReminder(item.id)}
                    onDelete={() => handleDeleteReminder(item.id)}
                    className="w-full"
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <FreelancerUpcomingSection
        groups={upcomingGroups}
        onEdit={handleEditReminder}
        onDelete={handleDeleteReminder}
      />
    </div>
  );
}
