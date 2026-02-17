import { client, clientRead } from "@/sanity/client";
import { userProfileQueries } from "@/sanity/queries/users";


export async function getFullProfile(clerkId) {
    return clientRead.fetch(userProfileQueries.getFullProfile, { clerkId });
}


export async function getProfileById(userId) {
    return clientRead.fetch(userProfileQueries.getProfileById, { userId });
}


export async function updateProfile(userId, data) {
    const allowedFields = [
        "name",
        "phone",
        "headline",
        "bio",
        "location",
        "dateOfBirth",
        "resumeUrl",
        "workExperience",
        "education",
        "skills",
        "languages",
        "linkedinUrl",
        "githubUrl",
        "portfolioUrl",
        "profileComplete",
    ];

    const patch = client.patch(userId);

    // Only set fields that are explicitly provided and allowed
    const setFields = {};
    for (const key of allowedFields) {
        if (data[key] !== undefined) {
            setFields[key] = data[key];
        }
    }

    setFields.updatedAt = new Date().toISOString();

    return patch.set(setFields).commit();
}


export async function uploadResume(userId, file, filename) {
    const asset = await client.assets.upload("file", file, {
        filename,
    });

    return client
        .patch(userId)
        .set({
            resume: {
                _type: "file",
                asset: { _type: "reference", _ref: asset._id },
            },
            updatedAt: new Date().toISOString(),
        })
        .commit();
}


export async function removeResume(userId) {
    return client
        .patch(userId)
        .unset(["resume"])
        .set({ updatedAt: new Date().toISOString() })
        .commit();
}


export async function getProfileCompleteness(clerkId) {
    return clientRead.fetch(userProfileQueries.getProfileCompleteness, {
        clerkId,
    });
}

export const userProfileService = {
    getFullProfile,
    getProfileById,
    updateProfile,
    uploadResume,
    removeResume,
    getProfileCompleteness,
};
