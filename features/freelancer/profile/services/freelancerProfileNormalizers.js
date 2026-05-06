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
      };

      if (entry?._key) {
        normalized._key = entry._key;
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
