/**
 * Resolves template clause placeholders with actual form values.
 * Placeholders use {{variableName}} syntax.
 */
export function generateContractClauses(template, formValues = {}) {
  const clauses =
    (Array.isArray(template?.clauses) && template.clauses) ||
    (Array.isArray(template?.defaultClauses) && template.defaultClauses) ||
    [];
  if (!Array.isArray(clauses) || clauses.length === 0) {
    return [];
  }

  const penaltyDisplay =
    formValues.penaltyClauseAmount != null &&
    formValues.penaltyClauseAmount !== ""
      ? `${formValues.penaltyClauseAmount} ${formValues.penaltyClauseCurrency || "EGP"}`
      : "___";

  const variables = {
    noticePeriod: formValues.noticePeriodDays || "30",
    paymentMethod: formValues.paymentMethod || "تحويل بنكي",
    contractDuration: formValues.contractDuration || "حسب الاتفاق",
    penaltyAmount: penaltyDisplay,
    nonCompetePeriod: formValues.nonCompetePeriod || "6 أشهر",
    jurisdiction: formValues.jurisdiction || "القاهرة",
  };

  return clauses.map((clause) => ({
    text: clause.text.replace(
      /\{\{(\w+)\}\}/g,
      (_, key) => variables[key] || "___",
    ),
  }));
}
