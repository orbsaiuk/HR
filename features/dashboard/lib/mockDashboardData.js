export const MOCK_DASHBOARD_DATA = {
    header: {
        companyName: 'شركة المستقبل الرقمية',
        greeting: 'صباح الخير، محمد!',
        subtitle: 'لديك 5 متقدمين جدد و 2 مقابلات اليوم',
    },
    metrics: [
        {
            id: 'active-jobs',
            label: 'وظيفة نشطة',
            value: 24,
            tone: 'indigo',
        },
        {
            id: 'total-applicants',
            label: 'إجمالي المتقدمين',
            value: 156,
            tone: 'amber',
        },
        {
            id: 'job-views',
            label: 'مشاهدة الإعلانات',
            value: 8432,
            tone: 'emerald',
        },
        {
            id: 'hiring-rate',
            label: 'معدل التوظيف',
            value: '68%',
            tone: 'rose',
        },
    ],
    applicantsSummary: {
        total: 67,
        label: 'متقدم',
        segments: [
            { id: 'full-time', label: 'دوام كامل', value: 32, color: '#ef4444' },
            { id: 'part-time', label: 'دوام جزئي', value: 32, color: '#f59e0b' },
            { id: 'co-op', label: 'تدريب', value: 10, color: '#4f46e5' },
            { id: 'remote', label: 'عن بُعد', value: 22, color: '#0ea5e9' },
            { id: 'contract', label: 'عقد مؤقت', value: 10, color: '#10b981' },
        ],
    },
    jobsOverview: {
        rangeLabel: 'عرض إحصائيات الوظائف من 19 إلى 25 يوليو',
        summary: {
            views: {
                value: 2342,
                delta: 6.4,
            },
            applications: {
                value: 100,
                delta: -0.5,
            },
        },
        charts: {
            week: [
                { label: 'الأحد', applications: 94, views: 140 },
                { label: 'الإثنين', applications: 86, views: 132 },
                { label: 'الثلاثاء', applications: 52, views: 78 },
                { label: 'الأربعاء', applications: 120, views: 152 },
                { label: 'الخميس', applications: 48, views: 92 },
                { label: 'الجمعة', applications: 38, views: 65 },
                { label: 'السبت', applications: 60, views: 112 },
            ],
            month: [
                { label: 'الأسبوع 1', applications: 350, views: 590 },
                { label: 'الأسبوع 2', applications: 280, views: 510 },
                { label: 'الأسبوع 3', applications: 420, views: 680 },
                { label: 'الأسبوع 4', applications: 360, views: 562 },
            ],
            year: [
                { label: 'يناير', applications: 940, views: 1300 },
                { label: 'فبراير', applications: 1020, views: 1480 },
                { label: 'مارس', applications: 1190, views: 1620 },
                { label: 'أبريل', applications: 1080, views: 1540 },
                { label: 'مايو', applications: 1290, views: 1730 },
                { label: 'يونيو', applications: 1240, views: 1660 },
            ],
        },
    },
    latestJobs: [
        {
            id: 'graphic-designer',
            title: 'مصمم جرافيك',
            location: 'الرياض، السعودية',
            salary: '15025 سنوياً',
            workType: 'دوام كامل',
            level: 'مستوى متقدم',
            industryTag: 'التصميم',
            postedAt: 'منذ 3 أيام',
            description:
                'تصميم الهوية البصرية والأصول الرقمية للحملات التسويقية ومنصات التواصل.',
            applications: 21,
            logoText: 'PS',
        },
        {
            id: 'frontend-engineer',
            title: 'مطور واجهات أمامية',
            location: 'جدة، السعودية',
            salary: '18000 سنوياً',
            workType: 'دوام كامل',
            level: 'خبرة متوسطة',
            industryTag: 'التقنية',
            postedAt: 'منذ يومين',
            description:
                'تطوير واجهات استخدام حديثة وتحسين تجربة المستخدم بالتعاون مع فريق المنتج.',
            applications: 33,
            logoText: 'FE',
        },
        {
            id: 'data-analyst',
            title: 'محلل بيانات',
            location: 'الدمام، السعودية',
            salary: '16500 سنوياً',
            workType: 'دوام جزئي',
            level: 'خبرة متوسطة',
            industryTag: 'التحليلات',
            postedAt: 'منذ 4 أيام',
            description:
                'تحويل البيانات التشغيلية إلى لوحات تحليلية لدعم قرارات التوظيف.',
            applications: 17,
            logoText: 'DA',
        },
    ],
};
