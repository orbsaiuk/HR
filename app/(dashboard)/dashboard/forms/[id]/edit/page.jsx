'use client';

import { useParams } from 'next/navigation';
import { FormEditPage } from '@/features/forms';

export default function Page() {
    const params = useParams();
    return <FormEditPage formId={params.id} />;
}
