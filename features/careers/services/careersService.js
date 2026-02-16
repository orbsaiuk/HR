import { client } from "@/sanity/client";
import { careerQueries } from "@/sanity/queries/recruitment";

export async function checkApplicationExists(positionId, userId) {
  return client.fetch(careerQueries.checkApplicationExists, { positionId, userId });
}

export const careersService = {
  checkApplicationExists,
};
