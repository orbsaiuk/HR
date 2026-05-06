import { client, clientRead } from "@/sanity/client";
import {
  freelancerProfileQueries,
  userProfileQueries,
} from "@/sanity/queries/users";

import { PROFILE_FIELDS, toFreelancerProfileDto } from "./freelancerProfileDto";
import {
  normalizePortfolioForStorage,
  normalizeServicesForStorage,
  normalizeSkillsForStorage,
} from "./freelancerProfileNormalizers";

async function ensureFreelancerProfile(userId) {
  let profile = await clientRead.fetch(freelancerProfileQueries.getByUserId, {
    userId,
  });

  if (profile) {
    return profile;
  }

  const now = new Date().toISOString();
  const deterministicId = `freelancerProfile-${userId.replace("drafts.", "")}`;

  await client.createIfNotExists({
    _id: deterministicId,
    _type: "freelancerProfile",
    user: {
      _type: "reference",
      _ref: userId,
    },
    createdAt: now,
    updatedAt: now,
  });

  profile = await client.fetch(freelancerProfileQueries.getByUserId, {
    userId,
  });

  return profile;
}

async function getOrCreateFreelancerProfile(clerkId, { fresh = false } = {}) {
  const reader = fresh ? client : clientRead;

  const user = await reader.fetch(userProfileQueries.getByClerkId, {
    clerkId,
  });

  if (!user) {
    return null;
  }

  const profile = fresh
    ? await client.fetch(freelancerProfileQueries.getByUserId, {
        userId: user._id,
      })
    : await ensureFreelancerProfile(user._id);

  if (!profile) {
    return null;
  }

  return toFreelancerProfileDto(user, profile);
}

function buildPatchFields(data) {
  const setFields = {};

  for (const field of PROFILE_FIELDS) {
    if (data[field] === undefined) continue;

    if (field === "skills") {
      setFields.skills = normalizeSkillsForStorage(data.skills || []);
      continue;
    }

    if (field === "services") {
      setFields.services = normalizeServicesForStorage(data.services || []);
      continue;
    }

    if (field === "portfolioProjects") {
      setFields.portfolioProjects = normalizePortfolioForStorage(
        data.portfolioProjects || [],
      );
      continue;
    }

    setFields[field] = data[field];
  }

  return setFields;
}

async function updateFreelancerProfile(clerkId, data) {
  const user = await clientRead.fetch(userProfileQueries.getByClerkId, {
    clerkId,
  });

  if (!user) {
    return null;
  }

  const profile = await ensureFreelancerProfile(user._id);

  if (!profile) {
    return null;
  }

  const now = new Date().toISOString();

  if (data.name !== undefined) {
    await client
      .patch(user._id)
      .set({
        name: String(data.name || "").trim(),
        updatedAt: now,
      })
      .commit();
  }

  const setFields = buildPatchFields(data);

  if (Object.keys(setFields).length > 0) {
    setFields.updatedAt = now;
    await client.patch(profile._id).set(setFields).commit();
  }

  return getOrCreateFreelancerProfile(clerkId, { fresh: true });
}

async function uploadPortfolioImage(file, filename) {
  const asset = await client.assets.upload("image", file, {
    filename,
  });

  return {
    image: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    },
    imageUrl: asset.url || "",
  };
}

export const freelancerProfileService = {
  getOrCreateFreelancerProfile,
  updateFreelancerProfile,
  uploadPortfolioImage,
};
