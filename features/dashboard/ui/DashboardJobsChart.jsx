'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const TAB_LABELS = {
    week: 'أسبوع',
    month: 'شهر',
    year: 'سنة',
};

export function DashboardJobsChart({ overview }) {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="gap-4">
                <div>
                    <CardTitle className="text-2xl text-slate-800">إحصائيات الوظائف</CardTitle>
                    <CardDescription className="mt-1 text-sm text-slate-500">
                        {overview.rangeLabel}
                    </CardDescription>
                </div>

                <Tabs defaultValue="week" dir="rtl" className="w-full">
                    <TabsList className="grid w-full max-w-55 grid-cols-3">
                        {Object.entries(TAB_LABELS).map(([key, label]) => (
                            <TabsTrigger key={key} value={key}>
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {Object.keys(TAB_LABELS).map((rangeKey) => (
                        <TabsContent key={rangeKey} value={rangeKey} className="mt-4">
                            <CardContent className="grid gap-4 p-0 lg:grid-cols-[230px_1fr]">
                                <div className="space-y-3">
                                    <SummaryBox
                                        label="مشاهدات الوظائف"
                                        value={overview.summary.views.value}
                                        delta={overview.summary.views.delta}
                                        deltaTone="positive"
                                    />
                                    <SummaryBox
                                        label="المتقدمات"
                                        value={overview.summary.applications.value}
                                        delta={overview.summary.applications.delta}
                                        deltaTone="negative"
                                    />
                                </div>

                                <div className="h-75 rounded-xl border border-slate-100 bg-white p-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={overview.charts[rangeKey]}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis
                                                dataKey="label"
                                                tick={{ fontSize: 11 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip content={<JobsChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                                            <Bar
                                                dataKey="applications"
                                                name="المتقدمات"
                                                fill="#4f46e5"
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={28}
                                            />
                                            <Bar
                                                dataKey="views"
                                                name="مشاهدات الوظائف"
                                                fill="#f59e0b"
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={28}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardHeader>
        </Card>
    );
}

function SummaryBox({ label, value, delta, deltaTone }) {
    const isPositive = deltaTone === 'positive';
    const deltaColor = isPositive ? 'text-emerald-600' : 'text-rose-600';
    const symbol = delta > 0 ? '+' : '';

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
                {new Intl.NumberFormat('ar-SA').format(value)}
            </p>
            <p className={`mt-2 text-xs font-medium ${deltaColor}`}>
                {`${symbol}${delta}% هذا الأسبوع`}
            </p>
        </div>
    );
}

function JobsChartTooltip({ active, payload, label }) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg">
            <p className="mb-2 font-semibold text-slate-900">{label}</p>
            {payload.map((entry) => (
                <p key={entry.name} className="text-slate-600">
                    {entry.name}: {new Intl.NumberFormat('ar-SA').format(entry.value)}
                </p>
            ))}
        </div>
    );
}
