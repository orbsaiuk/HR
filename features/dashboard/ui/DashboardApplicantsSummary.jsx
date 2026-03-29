import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardApplicantsSummary({ summary }) {
    const segmentsTotal = summary.segments.reduce((total, segment) => {
        return total + segment.value;
    }, 0);

    return (
        <Card className="h-full border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-2xl text-slate-800">ملف المتقدمين</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6 flex items-end justify-between">
                    <p className="text-sm text-slate-500">إجمالي المتقدمين</p>
                    <div className="text-left">
                        <p className="text-5xl font-bold text-slate-900">{summary.total}</p>
                        <p className="text-sm text-slate-500">{summary.label}</p>
                    </div>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    {summary.segments.map((segment) => {
                        const width = segmentsTotal > 0
                            ? (segment.value / segmentsTotal) * 100
                            : 0;

                        return (
                            <div
                                key={segment.id}
                                className="h-full"
                                style={{
                                    width: `${width}%`,
                                    backgroundColor: segment.color,
                                }}
                            />
                        );
                    })}
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {summary.segments.map((segment) => (
                        <div
                            key={segment.id}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: segment.color }}
                                />
                                <span className="text-sm text-slate-600">{segment.label}</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-800">
                                {segment.value}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
