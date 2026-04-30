import fs from "fs";
import path from "path";
import { Font } from "@react-pdf/renderer";

const PDF_FONT_DIR = path.join(process.cwd(), "public/fonts");

export const PDF_FONT_CANDIDATES = [
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

export function registerFontIfNeeded(fontConfig) {
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
