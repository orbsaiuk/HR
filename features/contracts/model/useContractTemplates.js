"use client";

import { useEffect, useMemo, useState } from "react";
import { contractsApi } from "../api/contractsApi";
import { CONTRACT_TYPES } from "./contractSchema";
import { CONTRACT_TEMPLATES } from "./contractTemplates";

function normalizeArabicText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normalizeTypeValue(value) {
  return String(value || "").trim();
}

function inferCategoryFromType(type) {
  const normalizedType = normalizeTypeValue(type);
  if (!normalizedType) return "فريلانسر";
  if (normalizedType.includes("دوام كامل")) return "دوام كامل";
  if (normalizedType.includes("دوام جزئي")) return "دوام جزئي";
  if (normalizedType.includes("تدريب")) return "تدريب";
  return "فريلانسر";
}

function formatLastUsedLabel(dateValue) {
  if (!dateValue) return "الآن";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "الآن";

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "اليوم";
  if (diffDays === 1) return "منذ يوم";
  if (diffDays <= 10) return `منذ ${diffDays} أيام`;

  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function normalizeTemplate(template = {}) {
  const type =
    normalizeTypeValue(template.type) ||
    CONTRACT_TYPES.FREELANCER_SINGLE_PROJECT;

  return {
    id: template._id || template.id || `template-${Date.now()}`,
    title: String(template.title || "قالب عقد جديد").trim(),
    description: String(template.description || "").trim(),
    type,
    category: String(template.category || inferCategoryFromType(type)).trim(),
    clauses: Array.isArray(template.clauses)
      ? template.clauses
      : Array.isArray(template.defaultClauses)
        ? template.defaultClauses
        : [],
    usageCount: Number(template.usageCount || 0),
    lastUsed:
      String(template.lastUsed || "").trim() ||
      formatLastUsedLabel(template.updatedAt || template.createdAt),
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  };
}

function normalizeTemplateList(items = []) {
  return items.map((item) => normalizeTemplate(item));
}

export function useContractTemplates(initialTemplates = CONTRACT_TEMPLATES) {
  const [templates, setTemplates] = useState(() =>
    normalizeTemplateList(initialTemplates),
  );
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadTemplates() {
      try {
        const backendTemplates = await contractsApi.getTemplates();

        if (!mounted) return;

        if (Array.isArray(backendTemplates) && backendTemplates.length > 0) {
          setTemplates(normalizeTemplateList(backendTemplates));
          return;
        }

        setTemplates(normalizeTemplateList(initialTemplates));
      } catch (error) {
        if (!mounted) return;
        console.error("Failed to fetch contract templates:", error);
        setTemplates(normalizeTemplateList(initialTemplates));
      }
    }

    loadTemplates();

    return () => {
      mounted = false;
    };
  }, [initialTemplates]);

  const categories = useMemo(() => {
    const typeTabs = templates
      .map((template) => normalizeTypeValue(template.category || template.type))
      .filter(Boolean);

    if (typeTabs.length === 0) {
      return ["الكل", ...Object.values(CONTRACT_TYPES).map(normalizeTypeValue)];
    }

    return ["الكل", ...new Set(typeTabs)];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = normalizeArabicText(searchQuery);

    return templates.filter((template) => {
      const categoryMatch =
        activeCategory === "الكل" ||
        normalizeTypeValue(template.category || template.type) ===
          normalizeTypeValue(activeCategory);

      if (!categoryMatch) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = normalizeArabicText(
        `${template.title} ${template.description} ${template.type} ${template.category}`,
      );

      return searchableText.includes(normalizedSearch);
    });
  }, [activeCategory, searchQuery, templates]);

  return {
    templates,
    setTemplates,
    normalizeTemplate,
    filteredTemplates,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    categories,
    resultCount: filteredTemplates.length,
  };
}
