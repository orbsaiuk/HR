import { CONTRACT_TEMPLATES } from "../../model/contractTemplates";

export function getDefaultClausesForType(type) {
  const matchedTemplate = CONTRACT_TEMPLATES.find(
    (template) =>
      String(template?.type || "").trim() === String(type || "").trim() &&
      Array.isArray(template?.defaultClauses) &&
      template.defaultClauses.length > 0,
  );

  const clauses = matchedTemplate?.defaultClauses || [
    { text: "يلتزم الطرفان بجميع الشروط والأحكام الواردة في هذا العقد." },
  ];

  return clauses.map((clause) => ({ text: String(clause?.text || "").trim() }));
}
