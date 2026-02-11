'use client';

import { useParams } from 'next/navigation';
import { ResponseDetailPage } from '@/features/responses';

export default function Page() {
    const params = useParams();
    return <ResponseDetailPage responseId={params.responseId} formId={params.id} />;
}