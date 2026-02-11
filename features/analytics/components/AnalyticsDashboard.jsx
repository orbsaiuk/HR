'use client';

import { SummaryCards } from './SummaryCards.jsx';
import { ResponseChart } from './ResponseChart.jsx';
import { FieldStats } from './FieldStats.jsx';

export function AnalyticsDashboard({ analytics }) {
    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <SummaryCards analytics={analytics} />

            {/* Response Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponseChart data={analytics.responsesOverTime} />
            </div>

            {/* Field Statistics */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Field Statistics
                </h2>
                {analytics.fieldStats.length > 0 ? (
                    <div className="space-y-4">
                        {analytics.fieldStats.map((field) => (
                            <FieldStats key={field.fieldId} stats={field} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <p className="text-gray-500">
                            No fields found in this form.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
