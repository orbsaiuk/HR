export function getContractTypeLabel(type) {
  if (!type) return "عقد";
  if (type.includes("دوام كامل")) return "عقد توظيف بدوام كامل";
  if (type.includes("دوام جزئي")) return "عقد دوام جزئي";
  if (type.includes("تدريب")) return "عقد تدريب (Internship)";
  if (type.includes("فريلانسر")) return "عقد فريلانسر";
  return `عقد ${type}`;
}

export function formatCompensation(amount, currency) {
  if (amount == null || amount === "") return "___________";
  const num = Number(amount);
  if (Number.isNaN(num)) return "___________";
  return `${num.toLocaleString("en-US")} ${currency || "EGP"}`;
}

export function formatSignatureDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
