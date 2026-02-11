'use client';

import { useRouter } from 'next/navigation';
import { X, GitCompare, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const MAX_SELECTIONS = 3;
const MIN_SELECTIONS = 2;

export function CompareSelector({ formId, selectedIds, onClearSelection }) {
    const router = useRouter();
    const count = selectedIds.length;
    const isMaxReached = count >= MAX_SELECTIONS;
    const canCompare = count >= MIN_SELECTIONS;
    const remaining = MIN_SELECTIONS - count;

    const handleCompare = () => {
        if (!canCompare) return;
        const idsParam = selectedIds.join(',');
        router.push(`/dashboard/forms/${formId}/compare?selectedIds=${idsParam}`);
    };

    if (count === 0) return null;

    const getStatusMessage = () => {
        if (isMaxReached) {
            return (
                <span className="flex items-center gap-1 text-amber-600">
                    <AlertCircle size={12} />
                    Maximum reached ({MAX_SELECTIONS})
                </span>
            );
        }
        if (canCompare) {
            return (
                <span className="flex items-center gap-1 text-green-600">
                    <Check size={12} />
                    Ready to compare
                </span>
            );
        }
        return `Select ${remaining} more to compare`;
    };

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <Card className="px-6 py-4 flex items-center gap-6 shadow-2xl border-gray-200 animate-in slide-in-from-bottom-4 fade-in duration-300">
                {/* Selection Info */}
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${isMaxReached
                            ? 'bg-amber-100 text-amber-700'
                            : canCompare
                                ? 'bg-green-100 text-green-700'
                                : 'bg-primary/10 text-primary'
                        }`}>
                        {count}
                    </div>
                    <div>
                        <p className="font-medium text-foreground">
                            {count === 1 ? '1 response selected' : `${count} responses selected`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {getStatusMessage()}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-border" />

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClearSelection}
                        className="flex items-center gap-2"
                    >
                        <X size={18} />
                        Clear
                    </Button>
                    <Button
                        onClick={handleCompare}
                        disabled={!canCompare}
                        className="flex items-center gap-2"
                    >
                        <GitCompare size={18} />
                        Compare
                    </Button>
                </div>
            </Card>
        </div>
    );
}
