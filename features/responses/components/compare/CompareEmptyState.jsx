'use client';

import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function CompareEmptyState() {
    return (
        <Card className="p-12 text-center border-dashed">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Responses to Compare</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
                Select responses from the list to compare them side by side. You can compare up to 3 responses at once.
            </p>
        </Card>
    );
}
