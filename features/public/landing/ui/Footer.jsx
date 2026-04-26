import Link from "next/link";

const FOOTER_LINKS = {
    company: [
        { label: "من نحن", href: "#" },
        { label: "تواصل معنا", href: "#" },
        { label: "الشروط والأحكام", href: "#" },
        { label: "سياسة الخصوصية", href: "#" },
    ],
    jobSeekers: [
        { label: "تصفح الوظائف", href: "/careers" },
        { label: "إنشاء حساب", href: "/sign-up" },
    ],
    employers: [
        { label: "انشر وظيفة", href: "/register-organization" },
        { label: "تصفح المواهب", href: "#" },
    ],
};

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14">
                {/* Footer Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10">
                    {/* Brand */}
                    <div className="col-span-2 sm:col-span-3 lg:col-span-1 mb-4 lg:mb-0">
                        <Link href="/" className="text-2xl font-bold text-white font-heading">
                            HireHub
                        </Link>
                        <p className="mt-3 text-sm leading-relaxed max-w-xs">
                            منصة ذكية تربط الشركات الطموحة بأفضل المواهب بدوام كامل أو بنظام العمل الحر.
                        </p>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">
                            الشركة
                        </h4>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Job Seekers Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">
                            للباحثين عن عمل
                        </h4>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.jobSeekers.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Employers Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">
                            لأصحاب العمل
                        </h4>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.employers.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 mt-8 sm:mt-10 pt-6 sm:pt-8">
                    <p className="text-center text-xs sm:text-sm text-gray-500">
                        © {new Date().getFullYear()} HireHub. جميع الحقوق محفوظة.
                    </p>
                </div>
            </div>
        </footer>
    );
}
