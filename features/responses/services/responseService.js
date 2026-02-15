import { client } from "@/sanity/client";
import { responsesQueries } from "@/sanity/queries";

export async function getResponsesByFormId(formId) {
  return client.fetch(responsesQueries.getByFormId, { formId });
}

export async function getResponseById(id) {
  return client.fetch(responsesQueries.getById, { id });
}

export async function updateResponseStatus(id, status) {
  return client
    .patch(id)
    .set({ reviewStatus: status, reviewedAt: new Date().toISOString() })
    .commit();
}

export const responseService = {
  getResponsesByFormId,
  getResponseById,
  updateResponseStatus,
};
