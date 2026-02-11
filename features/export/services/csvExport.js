import { getFileUrl } from '@/lib/sanityFileUrl';

export function exportToCSV(responses, form) {
    const headers = [
        'Submitted At',
        'User Name',
        'User Email',
        ...form.fields.map((f) => f.label),
    ];

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

    const rows = responses.map((response) => {
        const answers = form.fields.map((field) => {
            const answer = response.answers.find((a) => a.fieldId === field._key);
            const value = answer?.value;
            const fieldType = answer?.fieldType || field?.type;

            // Handle file uploads - include file URL
            if (fieldType === 'file' && answer?.fileAsset?.asset?._ref) {
                const fileUrl = getFileUrl(answer.fileAsset.asset._ref, projectId, dataset);
                if (fileUrl) {
                    return `${value || 'File'} (${fileUrl})`;
                }
                // Fallback if URL generation fails
                return value || 'File (URL unavailable)';
            }

            // Handle checkbox (array values)
            if (fieldType === 'checkbox') {
                try {
                    const values = JSON.parse(value);
                    if (Array.isArray(values)) {
                        return values.join(', ');
                    }
                } catch (e) {
                    // If not JSON, continue to default handling
                }
            }

            // Handle arrays
            if (Array.isArray(value)) {
                return value.join(', ');
            }

            return String(value ?? '');
        });

        return [
            new Date(response.submittedAt).toLocaleString(),
            response.user.name,
            response.user.email,
            ...answers,
        ];
    });

    const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','),
        ),
    ].join('\n');

    return csvContent;
}
