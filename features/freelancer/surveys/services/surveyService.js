import {
  getSurveysByUser as repoGetSurveysByUser,
  getSurveyByIdForUser as repoGetSurveyByIdForUser,
  createSurvey as repoCreateSurvey,
  updateSurvey as repoUpdateSurvey,
  deleteSurvey as repoDeleteSurvey,
  getUserByClerkId,
} from "../repositories/surveyRepository";

const QUESTION_TYPES = new Set([
  "text",
  "textarea",
  "number",
  "email",
  "multipleChoice",
  "dropdown",
  "date",
  "time",
  "datetime",
  "file",
]);

async function getFreelancerUserDoc(clerkId) {
  const userDoc = await getUserByClerkId(clerkId);
  if (!userDoc) throw new Error("User not found");
  if (userDoc.accountType !== "freelancer") {
    throw new Error("Freelancer access only");
  }
  return userDoc;
}

function sanitizeQuestion(question, index) {
  if (!question || typeof question !== "object") {
    throw new Error("Each question must be an object");
  }

  const type = String(question.type || "").trim();
  const label = String(question.label || "").trim();
  const options = Array.isArray(question.options)
    ? question.options.map((option) => String(option).trim()).filter(Boolean)
    : [];

  if (!QUESTION_TYPES.has(type)) {
    throw new Error("Invalid question type");
  }

  if (!label) {
    throw new Error("Question label is required");
  }

  if (["multipleChoice", "dropdown"].includes(type) && options.length === 0) {
    throw new Error("Choice questions require at least one option");
  }

  const sanitized = {
    _key: question._key || `question-${Date.now()}-${index}`,
    type,
    label,
    required: Boolean(question.required),
    order: Number.isFinite(Number(question.order)) ? Number(question.order) : index,
  };

  if (question.placeholder) sanitized.placeholder = String(question.placeholder);
  if (options.length > 0) sanitized.options = options;
  if (type === "file") sanitized.fileType = question.fileType || "any";
  if (question.validation && typeof question.validation === "object") {
    sanitized.validation = question.validation;
  }

  return sanitized;
}

function sanitizeSurveyInput(input, { requireQuestions = false } = {}) {
  const title = String(input?.title || "").trim();
  if (!title) throw new Error("Survey title is required");

  const rawQuestions = input?.questions ?? [];
  if (!Array.isArray(rawQuestions)) {
    throw new Error("Survey questions must be an array");
  }

  if (requireQuestions && rawQuestions.length === 0) {
    throw new Error("Survey must include at least one question");
  }

  const settings = input?.settings && typeof input.settings === "object"
    ? {
        allowAnonymous: Boolean(input.settings.allowAnonymous),
        requireAuth: input.settings.requireAuth !== false,
        ...(Number.isFinite(Number(input.settings.limitResponses)) &&
        Number(input.settings.limitResponses) > 0
          ? { limitResponses: Number(input.settings.limitResponses) }
          : {}),
        ...(input.settings.expiresAt
          ? { expiresAt: new Date(input.settings.expiresAt).toISOString() }
          : {}),
      }
    : { allowAnonymous: false, requireAuth: true };

  return {
    title,
    description: input?.description ? String(input.description) : "",
    questions: rawQuestions.map(sanitizeQuestion),
    settings,
  };
}

export async function getSurveysByFreelancer(clerkId) {
  const userDoc = await getFreelancerUserDoc(clerkId);
  return repoGetSurveysByUser(userDoc._id);
}

export async function getSurveyByIdForFreelancer(clerkId, id) {
  const userDoc = await getFreelancerUserDoc(clerkId);
  return repoGetSurveyByIdForUser(id, userDoc._id);
}

export async function createSurvey(clerkId, input) {
  const userDoc = await getFreelancerUserDoc(clerkId);
  const data = sanitizeSurveyInput(input, { requireQuestions: true });

  return repoCreateSurvey({
    createdBy: { _ref: userDoc._id },
    ...data,
  });
}

export async function updateSurvey(clerkId, id, input) {
  const existing = await getSurveyByIdForFreelancer(clerkId, id);
  if (!existing) throw new Error("Survey not found");

  const data = sanitizeSurveyInput(input, { requireQuestions: true });
  return repoUpdateSurvey(id, data);
}

export async function deleteSurvey(clerkId, id) {
  const existing = await getSurveyByIdForFreelancer(clerkId, id);
  if (!existing) throw new Error("Survey not found");

  return repoDeleteSurvey(id);
}

export { getFreelancerUserDoc, sanitizeQuestion };
