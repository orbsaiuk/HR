'use client';

import { useParams } from 'next/navigation';
import { FormDetailPage } from '@/features/forms';

export default function Page() {
    const params = useParams();
    return <FormDetailPage formId={params.id} />;
}
