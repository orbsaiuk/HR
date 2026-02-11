'use client';

import { useParams } from 'next/navigation';
import { FormSharePage } from '@/features/forms';

export default function Page() {
    const params = useParams();
    return <FormSharePage formId={params.id} />;
}