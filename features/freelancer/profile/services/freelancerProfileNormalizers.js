export function normalizeLanguagesForUi(languages) {
  return (languages || [])
    .map((entry) => {
      if (typeof entry === "string") return entry.trim();
      // Back-compat: legacy data may still be `{language, proficiency}`.
      return entry?.language?.trim?.() || "";
    })
    .filter(Boolean);
}

export function normalizeLanguagesForStorage(languages = []) {
  return languages
    .map((entry) => {
      if (typeof entry === "string") return entry.trim();
      // Back-compat: tolerate legacy `{language}` objects on write.
      return entry?.language?.trim?.() || "";
    })
    .filter(Boolean);
}

export function normalizeSkillsForStorage(skills = []) {
  const seen = new Set();
  return skills
    .map((entry) => String(entry || "").trim())
    .filter((entry) => {
      if (!entry) return false;
      const key = entry.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function normalizeServicesForUi(services) {
  return (services || []).map((entry, index) => ({
    id: entry._key || `service-${index}`,
    title: entry.title || "",
    description: entry.description || "",
    price: typeof entry.price === "number" ? entry.price : 0,
    deliveryTime: entry.deliveryTime || "",
    _key: entry._key,
  }));
}

export function normalizeServicesForStorage(services = []) {
  return services
    .map((entry) => {
      const title = entry?.title?.trim?.() || "";
      if (!title) return null;

      const normalized = {
        _type: "serviceEntry",
        title,
        description: entry?.description?.trim?.() || "",
        deliveryTime: entry?.deliveryTime?.trim?.() || "",
      };

      if (entry?._key) {
        normalized._key = entry._key;
      }

      const parsedPrice = Number(entry?.price);
      if (!Number.isNaN(parsedPrice)) {
        normalized.price = parsedPrice;
      }

      return normalized;
    })
    .filter(Boolean);
}

export function normalizePortfolioForUi(portfolioProjects) {
  return (portfolioProjects || []).map((entry, index) => ({
    id: entry._key || `project-${index}`,
    title: entry.title || "",
    link: entry.link || "",
    image: entry.image,
    imageUrl: entry.imageUrl || "",
    _key: entry._key,
  }));
}

export function normalizePortfolioForStorage(portfolioProjects = []) {
  return portfolioProjects
    .map((entry) => {
      const title = entry?.title?.trim?.() || "";
      if (!title) return null;

      const normalized = {
        _type: "portfolioProject",
        title,
        link: entry?.link?.trim?.() || "",
      };

      if (entry?._key) {
        normalized._key = entry._key;
      }

      if (entry?.image?.asset?._ref) {
        normalized.image = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: entry.image.asset._ref,
          },
        };
      }

      return normalized;
    })
    .filter(Boolean);
}
