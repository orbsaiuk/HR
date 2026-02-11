import { client } from '@/sanity/client';
import { responsesQueries } from '@/sanity/queries';

export async function getResponses(formId) {
    return client.fetch(responsesQueries.getByFormId, { formId });
}


export async function getResponseById(id) {
    return client.fetch(responsesQueries.getById, { id });
}

export async function deleteResponse(id) {
    await client.delete(id);
}

export async function getUserResponses(userId) {
    return client.fetch(responsesQueries.getByUserId, { userId });
}

export async function getResponseCount(formId) {
    const responses = await client.fetch(responsesQueries.getAllByFormId, { formId });
    return responses.length;
}
