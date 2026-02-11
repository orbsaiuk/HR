'use client';

import { useParams } from 'next/navigation';
import { ResponsesPage } from '@/features/responses';

export default function Page() {
    const params = useParams();
    return <ResponsesPage formId={params.id} />;
}
