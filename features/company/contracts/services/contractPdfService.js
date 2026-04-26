import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import fs from "fs";
import path from "path";

const PDF_FONT_DIR = path.join(process.cwd(), "public/fonts");

const PDF_FONT_CANDIDATES = [
  {
    family: "LamaSans",
    regularPath: path.join(PDF_FONT_DIR, "LamaSans-Regular.otf"),
    boldPath: path.join(PDF_FONT_DIR, "LamaSans-Regular.otf"),
  },
  {
    family: "TsDamasSans",
    regularPath: path.join(PDF_FONT_DIR, "ts-damas-sans-free-regular.otf"),
    boldPath: path.join(PDF_FONT_DIR, "ts-damas-sans-free-regular.otf"),
  },
  {
    family: "CairoPdf",
    regularPath: path.join(PDF_FONT_DIR, "Cairo-Regular.woff"),
    boldPath: path.join(PDF_FONT_DIR, "Cairo-Bold.woff"),
  },
];

const registeredFontFamilies = new Set();

function canUsePath(filePath) {
  try {
    return Boolean(filePath) && fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function removeUnpairedSurrogates(input) {
  let result = "";

  for (let index = 0; index < input.length; index += 1) {
    const code = input.charCodeAt(index);

    // High surrogate
    if (code >= 0xd800 && code <= 0xdbff) {
      const nextCode = input.charCodeAt(index + 1);
      if (nextCode >= 0xdc00 && nextCode <= 0xdfff) {
        result += input[index] + input[index + 1];
        index += 1;
      }
      continue;
    }

    // Skip lone low surrogate
    if (code >= 0xdc00 && code <= 0xdfff) {
      continue;
    }

    result += input[index];
  }

  return result;
}

function sanitizePdfText(value) {
  if (value == null) return "-";

  let text = removeUnpairedSurrogates(String(value));

  // Strip characters that can break PDF text shaping/subsetting.
  text = text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    // Remove bidi control marks that may appear in localized date strings.
    .replace(/[\u200E\u200F\u061C]/g, "")
    .trim();

  return text || "-";
}

function registerFontIfNeeded(fontConfig) {
  if (!fontConfig || !fontConfig.family) return false;
  if (registeredFontFamilies.has(fontConfig.family)) return true;

  if (!canUsePath(fontConfig.regularPath)) {
    return false;
  }

  const fonts = [{ src: fontConfig.regularPath, fontWeight: "normal" }];
  if (canUsePath(fontConfig.boldPath)) {
    fonts.push({ src: fontConfig.boldPath, fontWeight: "bold" });
  }

  Font.register({
    family: fontConfig.family,
    fonts,
  });

  registeredFontFamilies.add(fontConfig.family);
  return true;
}

function createStyles(fontFamily) {
  return StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      padding: 40,
      fontFamily,
    },
    header: {
      marginBottom: 20,
      alignItems: "flex-end", // Align text right for Arabic
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "right",
    },
    subtitle: {
      fontSize: 12,
      marginBottom: 4,
      textAlign: "right",
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      backgroundColor: "#eef2f6",
      padding: 6,
      marginBottom: 8,
      textAlign: "right",
      flexDirection: "row-reverse",
    },
    row: {
      flexDirection: "row-reverse",
      marginBottom: 4,
      justifyContent: "flex-start",
    },
    fieldsContainer: {
      flexDirection: "row-reverse",
      flexWrap: "wrap",
      justifyContent: "flex-start",
    },
    fieldWrapper: {
      width: "50%",
      flexDirection: "row-reverse",
      marginBottom: 8,
      justifyContent: "flex-start",
      paddingLeft: 2,
    },
    label: {
      fontSize: 10,
      fontWeight: "bold",
      textAlign: "right",
      marginLeft: 4,
      marginRight: 4,
    },
    value: {
      fontSize: 10,
      textAlign: "right",
      flex: 1,
    },
    clauseRow: {
      flexDirection: "row-reverse",
      marginBottom: 4,
      alignItems: "flex-start",
    },
    clauseNumber: {
      fontSize: 10,
      textAlign: "right",
      marginLeft: 6,
    },
    clauseText: {
      fontSize: 10,
      textAlign: "right",
      flex: 1,
      lineHeight: 1.6,
    },
    signaturesContainer: {
      flexDirection: "row-reverse",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      marginTop: 10,
      borderTopWidth: 1,
      borderTopColor: "#eef2f6",
      paddingTop: 15,
    },
    pageNumber: {
      position: "absolute",
      fontSize: 10,
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: "right",
      color: "grey",
    },
  });
}

function toSafeString(value) {
  return sanitizePdfText(value);
}

function formatDate(value) {
  if (!value) return "-";

  let date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "number") {
    date = new Date(value);
  } else if (typeof value === "string") {
    date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      const parsed = Date.parse(value);
      if (!Number.isNaN(parsed)) {
        date = new Date(parsed);
      } else {
        return toSafeString(value);
      }
    }
  } else {
    return "-";
  }

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = String(date.getUTCFullYear());

  return `${day}/${month}/${year}`;
}

function formatAmount(amount, currency = "EGP") {
  if (amount == null || amount === "") return "-";

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) {
    return `${toSafeString(amount)} ${toSafeString(currency)}`;
  }

  return `${numericAmount.toLocaleString("en-US")} ${toSafeString(currency)}`;
}

function buildSecondPartyName(formData = {}) {
  const firstName = String(formData.secondPartyFirstName || "").trim();
  const lastName = String(formData.secondPartyLastName || "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return fullName || toSafeString(formData.secondPartyFullName);
}



const ContractDocument = ({ contract, fontFamily }) => {
  const styles = createStyles(fontFamily);
  const formData =
    contract?.formData && typeof contract.formData === "object"
      ? contract.formData
      : {};
  const clauses = Array.isArray(contract?.clauses) ? contract.clauses : [];

  const secondPartyName = buildSecondPartyName(formData);
  const firstPartyName = toSafeString(formData.firstPartyCompanyName);
  const firstPartyRepresentative = toSafeString(
    formData.firstPartyLegalRepresentative,
  );


  const contractTitle = toSafeString(contract?.title || "عقد عمل");
  const issuedAt = formatDate(contract?.createdAt || new Date().toISOString());

  const renderField = (label, value) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>: {label} </Text>
      <Text style={styles.value}>{toSafeString(value)}</Text>
    </View>
  );

  return (
    <Document
      title={contractTitle}
      author="Form Builder"
      subject="Employment Contract"
      creator="Form Builder Contracts"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>عقد عمل</Text>
          <Text style={styles.subtitle}>عنوان العقد: {contractTitle}</Text>
          <Text style={styles.subtitle}>تاريخ الإصدار: {issuedAt}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الطرف الأول</Text>
          <View style={styles.fieldsContainer}>
            {renderField("اسم الشركة", firstPartyName)}
            {renderField("الممثل القانوني", firstPartyRepresentative)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الطرف الثاني</Text>
          <View style={styles.fieldsContainer}>
            {renderField("الاسم الكامل", secondPartyName)}
            {renderField("الرقم القومي", formData.secondPartyNationalId)}
            {renderField("العنوان", formData.secondPartyAddress)}
            {renderField("رقم الهاتف", formData.secondPartyPhone)}
            {renderField("البريد الإلكتروني", formData.secondPartyEmail)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>تفاصيل العقد</Text>
          <View style={styles.fieldsContainer}>
            {renderField("نوع العقد", contract?.type || formData.contractType)}
            {renderField("المسمى الوظيفي", formData.jobTitle)}
            {renderField(
              "الراتب/المقابل",
              formatAmount(
                formData.compensationAmount,
                formData.compensationCurrency,
              ),
            )}
            {renderField("تاريخ البدء", formatDate(formData.startDate))}
            {renderField("تاريخ الانتهاء", formatDate(formData.endDate))}
            {renderField("مدة العقد", formData.contractDuration)}
            {renderField(
              "الشرط الجزائي",
              formatAmount(
                formData.penaltyClauseAmount,
                formData.penaltyClauseCurrency || "EGP",
              ),
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>بنود العقد</Text>
          {clauses.length === 0 ? (
            <View style={styles.clauseRow}>
              <Text style={styles.clauseNumber}>- 1</Text>
              <Text style={styles.clauseText}>لا توجد بنود مضافة.</Text>
            </View>
          ) : (
            clauses.map((clause, index) => (
              <View key={index} style={styles.clauseRow}>
                <Text style={styles.clauseNumber}>- {index + 1}</Text>
                <Text style={styles.clauseText}>
                  {toSafeString(clause?.text)}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.signaturesContainer}>
          {renderField(
            "الطرف الأول",
            `${firstPartyName} / ${firstPartyRepresentative}`
          )}
          {renderField("الطرف الثاني", secondPartyName)}
        </View>
        <View style={{ ...styles.row, marginTop: 10 }}>
          <Text style={styles.label}>: تاريخ التوقيع</Text>
          <Text style={styles.value}>
            {formatDate(new Date().toISOString())}
          </Text>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `صفحة ${pageNumber} من ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export async function generateContractPdfBuffer(contract = {}) {
  const fontCandidates = PDF_FONT_CANDIDATES.filter((font) =>
    registerFontIfNeeded(font),
  );

  if (fontCandidates.length === 0) {
    throw new Error("No Arabic-capable PDF fonts are available on the server");
  }

  let lastError = null;

  for (const font of fontCandidates) {
    try {
      const document = (
        <ContractDocument contract={contract} fontFamily={font.family} />
      );
      return await renderToBuffer(document);
    } catch (error) {
      lastError = error;
      console.warn(
        `Contract PDF rendering failed using font "${font.family}", trying next fallback.`,
        error,
      );
    }
  }

  throw lastError || new Error("Failed to generate contract PDF");
}
