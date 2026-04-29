import { client } from "@/sanity/client";
import { surveyResponseQueries } from "@/sanity/queries";
import { getFreelancerUserDoc } from "./surveyService";

export async function getSurveyResponsesForOwner(clerkId, surveyId) {
  const userDoc = await getFreelancerUserDoc(clerkId);
  return client.fetch(surveyResponseQueries.getBySurveyForOwner, {
    surveyId,
    userId: userDoc._id,
  });
}

export async function getSurveyResponseByIdForOwner(clerkId, responseId) {
  const userDoc = await getFreelancerUserDoc(clerkId);
  return client.fetch(surveyResponseQueries.getByIdForOwner, {
    responseId,
    userId: userDoc._id,
  });
}

export async function deleteSurveyResponse(clerkId, responseId) {
  const existing = await getSurveyResponseByIdForOwner(clerkId, responseId);
  if (!existing) throw new Error("Survey response not found");
  await client.delete(responseId);
}
