import { AuthProvider } from "@/features/auth/components/AuthProvider.jsx";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import "./globals.css";

const tsDamas = localFont({
  src: "../public/fonts/ts-damas-sans-free-regular.otf",
  variable: "--font-heading",
  display: "swap",
});

const lamaSans = localFont({
  src: "../public/fonts/LamaSans-Regular.otf",
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "HireHub - منصة التوظيف الذكية",
  description:
    "منصة ذكية تربط الشركات الطموحة بأفضل المواهب بدوام كامل أو بنظام العمل الحر",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tsDamas.variable} ${lamaSans.variable}`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-left" richColors />
      </body>
    </html>
  );
}
