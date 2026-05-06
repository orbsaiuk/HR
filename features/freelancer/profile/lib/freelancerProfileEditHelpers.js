export const MAX_PORTFOLIO_IMAGE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_PORTFOLIO_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export function normalizeTags(values = []) {
  const seen = new Set();
  return values
    .map((value) => String(value || "").trim())
    .filter((value) => {
      if (!value) return false;
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function getSectionMeta(section) {
  const map = {
    header: {
      title: "تعديل معلومات الملف الشخصي",
      description: "قم بتحديث الاسم والعنوان والموقع الظاهر في أعلى الصفحة.",
    },
    about: {
      title: "تعديل نبذة عني",
      description: "اكتب وصفا مختصرا عن خبرتك وما تقدمه للعملاء.",
    },
    details: {
      title: "تعديل التفاصيل الإضافية",
      description: "حدث رقم الهاتف واللغات التي تتقنها.",
    },
    social: {
      title: "تعديل روابط التواصل",
      description:
        "أضف روابط حساباتك على المنصات المختلفة لتسهيل تواصل العملاء معك.",
    },
    skills: {
      title: "تعديل المهارات",
      description:
        "أضف المهارات كوسوم واضحة بدلا من كتابة قائمة مفصولة بفواصل.",
    },
    services: {
      title: "تعديل الخدمات",
      description: "أضف الخدمات التي تقدمها.",
    },
    portfolio: {
      title: "تعديل معرض الأعمال",
      description: "أضف أعمالك السابقة وروابطها وصور العرض لتعزيز ثقة العملاء.",
    },
  };

  return (
    map[section] || {
      title: "تعديل",
      description: "قم بتحديث بيانات هذا القسم.",
    }
  );
}

export function createDefaultValues(profile) {
  return {
    name: profile?.name || "",
    headline: profile?.headline || "",
    location: profile?.location || "",
    bio: profile?.bio || "",
    phone: profile?.phone || "",
    skills: normalizeTags(profile?.skills || []),
    linkedinUrl: profile?.linkedinUrl || "",
    githubUrl: profile?.githubUrl || "",
    instagramUrl: profile?.instagramUrl || "",
    twitterUrl: profile?.twitterUrl || "",
    websiteUrl: profile?.websiteUrl || "",
    services: (profile?.services || []).map((entry) => ({
      _key: entry._key,
      title: entry.title || "",
      description: entry.description || "",
    })),
    portfolioProjects: (profile?.portfolioProjects || []).map((entry) => ({
      _key: entry._key,
      title: entry.title || "",
      link: entry.link || "",
      image: entry.image,
      imageUrl: entry.imageUrl || "",
      fieldId: "",
    })),
  };
}

export async function buildSubmitPayload({
  section,
  values,
  portfolioFilesById,
  onUploadPortfolioImage,
}) {
  if (section === "header") {
    return {
      name: values.name.trim(),
      headline: values.headline.trim(),
      location: values.location.trim(),
    };
  }

  if (section === "about") {
    return { bio: values.bio.trim() };
  }

  if (section === "details") {
    return {
      phone: values.phone.trim(),
    };
  }

  if (section === "social") {
    return {
      linkedinUrl: values.linkedinUrl.trim(),
      githubUrl: values.githubUrl.trim(),
      twitterUrl: values.twitterUrl.trim(),
      instagramUrl: values.instagramUrl.trim(),
      websiteUrl: values.websiteUrl.trim(),
    };
  }

  if (section === "skills") {
    return { skills: normalizeTags(values.skills) };
  }

  if (section === "services") {
    return {
      services: (values.services || [])
        .map((entry) => {
          const title = String(entry.title || "").trim();
          const description = String(entry.description || "").trim();
          const hasAnyValue = Boolean(title || description);

          if (!hasAnyValue || !title) return null;

          return {
            _key: entry._key,
            title,
            description,
          };
        })
        .filter(Boolean),
    };
  }

  if (section === "portfolio") {
    const projects = [];

    for (const entry of values.portfolioProjects || []) {
      const title = String(entry.title || "").trim();
      const link = String(entry.link || "").trim();
      const hasAnyValue = Boolean(
        title || link || entry.image || entry.imageUrl,
      );
      if (!hasAnyValue || !title) continue;

      let image = entry.image;
      const file = entry.fieldId ? portfolioFilesById[entry.fieldId] : null;

      if (file) {
        const uploaded = await onUploadPortfolioImage(file);
        image = uploaded.image;
      }

      projects.push({
        _key: entry._key,
        title,
        link,
        image,
      });
    }

    return { portfolioProjects: projects };
  }

  return {};
}
