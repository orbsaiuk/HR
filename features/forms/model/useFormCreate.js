"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formsApi } from "../api/formsApi";

export function useFormCreate() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([]);
  const [savingDraft, setSavingDraft] = useState(false);
  const [savingPublish, setSavingPublish] = useState(false);
  const [error, setError] = useState(null);

  const validateForm = (publish) => {
    if (!title.trim()) {
      return { valid: false, message: "يرجى إدخال عنوان للنموذج" };
    }

    if (publish && fields.length === 0) {
      return {
        valid: false,
        message: "يرجى إضافة حقل واحد على الأقل قبل نشر النموذج",
      };
    }

    return { valid: true };
  };

  const saveForm = async (publish = false) => {
    const validation = validateForm(publish);
    if (!validation.valid) {
      setError(validation.message);
      return { success: false, error: validation.message };
    }

    if (publish) {
      setSavingPublish(true);
    } else {
      setSavingDraft(true);
    }
    setError(null);

    try {
      const formData = {
        title,
        description,
        fields,
        status: publish ? "published" : "draft",
      };

      const form = await formsApi.create(formData);
      router.push(`/company/forms/${form._id}`);
      return { success: true, form };
    } catch (err) {
      const errorMessage = err.message || "تعذر حفظ النموذج";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSavingDraft(false);
      setSavingPublish(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    fields,
    setFields,
    savingDraft,
    savingPublish,
    error,
    saveForm,
  };
}
