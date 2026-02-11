import { NextResponse } from 'next/server';
import { getFormAnalytics } from '@/features/analytics/services/analyticsService';

export async function GET(request, { params }) {
    try {
        const { formId } = await params;

        const analytics = await getFormAnalytics(formId);

        return NextResponse.json(analytics);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
