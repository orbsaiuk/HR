import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { PDF_FONT_CANDIDATES, registerFontIfNeeded } from "./contractPdfFonts";
import { ContractDocument } from "./ContractPdfDocument";

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
