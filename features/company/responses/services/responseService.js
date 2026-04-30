import { getSupabaseServer } from "@/lib/supabase/server";
import { uploadFileAsset } from "@/shared/services/assetService";

export async function getResponsesByFormId(formId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("form_responses")
    .select("*")
    .eq("form_id", formId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getResponseById(id) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("form_responses")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateResponseStatus(id, status) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("form_responses")
    .update({ 
      status: status, 
      status_viewed: false,
      updated_at: new Date().toISOString() 
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateResponseStatusWithDetails(
  id,
  { status, statusNote, rejectionReason },
) {
  const updateData = {
    status,
    status_note: statusNote || "",
    updated_at: new Date().toISOString(),
    status_viewed: false,
  };

  if (status === "rejected" && rejectionReason) {
    updateData.rejection_reason = rejectionReason;
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("form_responses")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteResponse(id) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("form_responses").delete().eq("id", id);
  if (error) throw error;
}

export async function createResponse({ formId, userId, answers }) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("form_responses")
    .insert({
      form_id: formId,
      respondent_id: userId,
      answers,
      status: "pending",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

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
