import { client } from "@/sanity/client";

export async function checkApplicationExists(positionId, userId) {
  return client.fetch(
    `count(*[_type == "application" && jobPosition._ref == $positionId && applicant._ref == $userId]) > 0`,
    { positionId, userId },
  );
}

export const careersService = {
  checkApplicationExists,
};
