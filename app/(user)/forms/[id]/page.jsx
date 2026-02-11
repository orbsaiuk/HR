'use client';

import { useParams } from 'next/navigation';
import { PublicFormPage } from '@/features/public-forms';

export default function Page() {
    const params = useParams();
    return <PublicFormPage formId={params.id} />;
}
