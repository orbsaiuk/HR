import { client } from "@/sanity/client";
import { responsesQueries } from "@/sanity/queries";
import { uploadFileAsset } from "@/shared/services/assetService";

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

/**
 * Update response status with full details (status, note, rejection reason)
 */
export async function updateResponseStatusWithDetails(
  id,
  { status, statusNote, rejectionReason },
) {
  const updateData = {
    status,
    statusNote: statusNote || "",
    updatedAt: new Date().toISOString(),
    statusUpdated: true,
    statusViewed: false,
  };

  if (status === "rejected" && rejectionReason) {
    updateData.rejectionReason = rejectionReason;
  }

  return client.patch(id).set(updateData).commit();
}

/**
 * Delete a response by ID
 */
export async function deleteResponse(id) {
  return client.delete(id);
}

/**
 * Create a new form response
 */
export async function createResponse({ formId, userId, answers }) {
  return client.create({
    _type: "response",
    form: { _type: "reference", _ref: formId },
    user: { _type: "reference", _ref: userId },
    answers,
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Process form answers, uploading file assets as needed
 */
export async function processFormAnswers(answers, fields, formData) {
  return Promise.all(
    Object.entries(answers).map(async ([key, value]) => {
      const field = fields?.find((f) => f._key === key);
      const fieldType = field?.type || "text";
      const fieldLabel = field?.label || "Untitled Field";

      // Handle file uploads
      if (fieldType === "file") {
        const file = formData.get(`file_${key}`);
        if (file && file.size > 0) {
          try {
            const asset = await uploadFileAsset(file, {
              filename: file.name,
            });

            return {
              _key: key,
              fieldId: key,
              fieldType,
              fieldLabel,
              value: file.name,
              fileAsset: {
                _type: "file",
                asset: {
                  _type: "reference",
                  _ref: asset._id,
                },
              },
            };
          } catch (uploadError) {
            console.error("File upload error:", uploadError);
            return {
              _key: key,
              fieldId: key,
              fieldType,
              fieldLabel,
              value: `Upload failed: ${file.name}`,
            };
          }
        }
      }

      // Handle other field types
      let processedValue = value;
      if (typeof value === "object" && value !== null) {
        processedValue = Array.isArray(value)
          ? JSON.stringify(value)
          : JSON.stringify(value);
      } else {
        processedValue = String(value ?? "");
      }

      return {
        _key: key,
        fieldId: key,
        fieldType,
        fieldLabel,
        value: processedValue,
      };
    }),
  );
}

export const responseService = {
  getResponsesByFormId,
  getResponseById,
  updateResponseStatus,
  updateResponseStatusWithDetails,
  deleteResponse,
  createResponse,
  processFormAnswers,
};
