import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  toSafeString,
  formatDate,
  formatAmount,
  buildSecondPartyName,
} from "./contractPdfFormatters";

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

export const ContractDocument = ({ contract, fontFamily }) => {
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
