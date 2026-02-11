import { NextResponse } from 'next/server';
import { responsesQueries } from '@/sanity/queries';
import { client } from '@/sanity/client';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const formId = searchParams.get('formId');

        if (!formId) {
            return NextResponse.json(
                { error: 'formId is required' },
                { status: 400 }
            );
        }

        const responses = await client.fetch(responsesQueries.getByFormId, { formId });
        return NextResponse.json(responses);
    } catch (error) {
        console.error('Error fetching responses:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
