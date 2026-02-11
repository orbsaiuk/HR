'use client';

import { useParams } from 'next/navigation';
import { ComparePage } from '@/features/responses';

export default function Page() {
    const params = useParams();
    return <ComparePage formId={params.id} />;
}
