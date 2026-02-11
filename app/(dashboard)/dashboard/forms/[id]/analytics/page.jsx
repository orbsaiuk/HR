'use client';

import { useParams } from 'next/navigation';
import { AnalyticsPage } from '@/features/analytics';

export default function Page() {
    const params = useParams();
    return <AnalyticsPage formId={params.id} />;
}