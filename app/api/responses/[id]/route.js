import { NextResponse } from 'next/server';
import { responsesQueries } from '@/sanity/queries';
import { client } from '@/sanity/client';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const response = await client.fetch(responsesQueries.getById, { id });

        if (!response) {
            return NextResponse.json(
                { error: 'Response not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching response:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await client.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting response:', error);
        return NextResponse.json(
            { error: 'Failed to delete response' },
            { status: 500 }
        );
    }
}
