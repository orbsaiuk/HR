/**
 * Dashboard statistics cards component
 */

import { FileText, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

export function StatsCards({ stats }) {
    const cards = [
        {
            label: 'Total Forms',
            value: stats.totalForms,
            icon: FileText,
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            valueColor: 'text-gray-900',
        },
        {
            label: 'Published',
            value: stats.publishedForms,
            icon: CheckCircle,
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            valueColor: 'text-green-600',
        },
        {
            label: 'Drafts',
            value: stats.draftForms,
            icon: AlertCircle,
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            valueColor: 'text-yellow-600',
        },
        {
            label: 'Total Responses',
            value: stats.totalResponses,
            icon: MessageSquare,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            valueColor: 'text-purple-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{card.label}</p>
                            <p className={`text-3xl font-bold mt-1 ${card.valueColor}`}>
                                {card.value}
                            </p>
                        </div>
                        <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                            <card.icon className={card.iconColor} size={24} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
