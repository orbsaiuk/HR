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
};
