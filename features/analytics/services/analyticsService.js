import { client } from '@/sanity/client';
import { analyticsQueries } from '@/sanity/queries';

export async function getFormAnalytics(formId, orgId) {
    const responses = await client.fetch(
        analyticsQueries.getResponsesByFormId,
        { formId, orgId },
    );

    const form = await client.fetch(
        analyticsQueries.getFormById,
        { id: formId, orgId },
    );

    const totalResponses = responses.length;
    const fieldStats = calculateFieldStats(form.fields, responses);
    const responsesOverTime = calculateResponsesOverTime(responses);

    return {
        formId,
        totalResponses,
        completionRate: 100, // All submitted responses are complete
        averageTimeToComplete: 0, // Calculate if tracking start time
        responsesOverTime,
        fieldStats,
    };
}

function calculateFieldStats(fields, responses) {
    return fields.map((field) => {
        const fieldResponses = responses
            .map((r) => r.answers.find((a) => a.fieldId === field._key))
            .filter(Boolean);

        const answeredCount = fieldResponses.filter(
            (r) => r.value !== '' && r.value != null,
        ).length;
        const skippedCount = responses.length - answeredCount;

        const stats = {
            fieldId: field._key,
            label: field.label,
            type: field.type,
            totalResponses: responses.length,
            answeredCount,
            skippedCount,
        };

        // Calculate distribution for choice-based fields
        if (['multipleChoice', 'dropdown'].includes(field.type)) {
            const distribution = {};
            field.options?.forEach((option) => {
                distribution[option] = fieldResponses.filter(
                    (r) =>
                        r.value === option ||
                        (Array.isArray(r.value) && r.value.includes(option)),
                ).length;
            });
            stats.distribution = distribution;
        }

        // Calculate average for numeric fields
        if (field.type === 'number') {
            const values = fieldResponses
                .map((r) => Number(r.value))
                .filter((v) => !isNaN(v));

            if (values.length > 0) {
                stats.average = values.reduce((a, b) => a + b, 0) / values.length;
                stats.min = Math.min(...values);
                stats.max = Math.max(...values);
            }
        }

        return stats;
    });
}


function calculateResponsesOverTime(responses) {
    const dateMap = {};

    responses.forEach((response) => {
        const date = new Date(response.submittedAt).toISOString().split('T')[0];
        dateMap[date] = (dateMap[date] || 0) + 1;
    });

    return Object.entries(dateMap).map(([date, count]) => ({ date, count }));
}
