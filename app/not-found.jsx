import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-primary/10 font-heading select-none">
          404
        </h1>

        {/* Arabic Title */}
        <h2 className="text-3xl font-heading font-bold text-foreground -mt-8 mb-4">
          الصفحة غير موجودة
        </h2>

        {/* Arabic Description */}
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها إلى مكان آخر.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">العودة للصفحة الرئيسية</Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/careers">تصفح الوظائف</Link>
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
