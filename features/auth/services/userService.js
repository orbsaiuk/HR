import { client } from "@/sanity/client";

export async function getUserByClerkId(clerkId) {
  return client.fetch(`*[_type == "user" && clerkId == $clerkId][0]`, {
    clerkId,
  });
}

export async function getUserApplications(userId) {
  return client.fetch(
    `*[_type == "application" && applicant._ref == $userId] | order(appliedAt desc) {
      _id,
      "jobPosition": jobPosition->{
        _id,
        title,
        department,
        location
      },
      status,
      appliedAt
    }`,
    { userId },
  );
}

export async function getUserApplication(userId, applicationId) {
  return client.fetch(
    `*[_type == "application" && _id == $applicationId && applicant._ref == $userId][0]{
      _id,
      "jobPosition": jobPosition->{
        _id,
        title,
        department,
        location,
        description
      },
      status,
      appliedAt,
      notes,
      rejectionReason
    }`,
    { userId, applicationId },
  );
}

export async function getLegacyTeacher(clerkId) {
  return client.fetch(`*[_type == "teacher" && clerkId == $clerkId][0]`, {
    clerkId,
  });
}

export const userService = {
  getUserByClerkId,
  getUserApplications,
  getUserApplication,
  getLegacyTeacher,
};
