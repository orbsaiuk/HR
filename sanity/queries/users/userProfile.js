/**
 * User Profile GROQ Queries
 *
 * Pure query strings — no logic, no client calls.
 * Used by features/user-profile/services/userProfileService.js
 */

export const userProfileQueries = {
  /**
   * Get full user profile by Clerk ID
   */
  getFullProfile: `*[_type == "user" && clerkId == $clerkId][0] {
    ...,
    "resumeUrl": resume.asset->url
  }`,

  /**
   * Get full user profile by Sanity document ID
   */
  getProfileById: `*[_type == "user" && _id == $userId][0] {
    ...,
    "resumeUrl": resume.asset->url
  }`,

  /**
   * Get profile completeness data for a user
   */
  getProfileCompleteness: `*[_type == "user" && clerkId == $clerkId][0] {
    _id,
    name,
    email,
    phone,
    headline,
    bio,
    location,
    "hasResume": defined(resume) || defined(resumeUrl),
    "hasWorkExperience": count(workExperience) > 0,
    "hasEducation": count(education) > 0,
    "hasSkills": count(skills) > 0,
    profileComplete
  }`,

  /**
   * Get a user by Clerk ID (basic document)
   */
  getByClerkId: `*[_type == "user" && clerkId == $clerkId][0]`,

  /**
   * Get a user by Sanity document ID (basic document)
   */
  getById: `*[_type == "user" && _id == $id][0]`,

  /**
   * Get a legacy teacher document by Clerk ID
   */
  getLegacyTeacher: `*[_type == "teacher" && clerkId == $clerkId][0]`,

  /**
   * Get all applications for a user
   */
  getUserApplications: `*[_type == "application" && applicant._ref == $userId] | order(appliedAt desc) {
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

  /**
   * Get a single application for a user by application ID
   */
  getUserApplication: `*[_type == "application" && _id == $applicationId && applicant._ref == $userId][0]{
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
};
