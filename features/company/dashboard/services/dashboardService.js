import { getSupabaseServer } from "@/lib/supabase/server";
import { clientRead } from "@/sanity/client";

export async function getCompanyDashboardStats(orgId, userId) {
  const supabase = getSupabaseServer();

  // 1. Fetch organization and user details from Sanity
  const orgPromise = clientRead.fetch(`*[_type == "organization" && _id == $orgId][0]{ name }`, { orgId });
  const userPromise = clientRead.fetch(`*[_type == "user" && _id == $userId][0]{ name }`, { userId });

  // 2. Fetch Supabase Data
  // Active jobs count
  const activeJobsPromise = supabase
    .from("job_positions")
    .select("*", { count: "exact", head: true })
    .eq("org_id", orgId)
    .eq("status", "published");

  // Total applicants count
  const totalApplicantsPromise = supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("org_id", orgId);

  // Latest 3 jobs
  const latestJobsPromise = supabase
    .from("job_positions")
    .select("id, title, location, salary_min, salary_max, employment_type, experience_level, industry, published_at, applications:applications(count)")
    .eq("org_id", orgId)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  // Grouped charts via RPC
  const chartStatsPromise = supabase.rpc("get_application_stats_by_day", {
    p_org_id: orgId,
    p_days_limit: 7,
  });

  const [
    org, 
    user, 
    activeJobsRes, 
    totalApplicantsRes, 
    latestJobsRes,
    chartStatsRes
  ] = await Promise.all([
    orgPromise,
    userPromise,
    activeJobsPromise,
    totalApplicantsPromise,
    latestJobsPromise,
    chartStatsPromise
  ]);

  // Handle Chart Mapping (fill empty days)
  const chartData = [];
  const daysMap = {};
  if (!chartStatsRes.error && chartStatsRes.data) {
    chartStatsRes.data.forEach(row => {
      daysMap[row.apply_date] = row.applications_count;
    });
  }

  // Generate last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
    
    // Arabic short day name
    const dayName = d.toLocaleDateString("ar-SA", { weekday: "short" });
    
    chartData.push({
      label: dayName,
      applications: daysMap[dateStr] || 0,
      views: 0 // Mock views since we don't track page views yet
    });
  }

  // Map latest jobs to the required format
  const mappedLatestJobs = (latestJobsRes.data || []).map(job => {
    return {
      id: job.id,
      title: job.title,
      location: job.location,
      salary: job.salary_min && job.salary_max ? `${job.salary_min} - ${job.salary_max}` : "غير محدد",
      workType: job.employment_type || "غير محدد",
      level: job.experience_level || "غير محدد",
      industryTag: job.industry || "عام",
      postedAt: new Date(job.published_at).toLocaleDateString("ar-SA"),
      description: "",
      applications: job.applications?.[0]?.count || 0,
      logoText: job.title.substring(0, 2),
    };
  });

  return {
    header: {
      companyName: org?.name || "شركتي",
      greeting: `مرحباً، ${user?.name ? user.name.split(" ")[0] : ""}!`,
      subtitle: `لديك ${activeJobsRes.count || 0} وظائف نشطة و ${totalApplicantsRes.count || 0} متقدم.`,
    },
    metrics: [
      {
        id: "active-jobs",
        label: "وظيفة نشطة",
        value: activeJobsRes.count || 0,
        tone: "indigo",
      },
      {
        id: "total-applicants",
        label: "إجمالي المتقدمين",
        value: totalApplicantsRes.count || 0,
        tone: "amber",
      },
      {
        id: "job-views",
        label: "مشاهدة الإعلانات",
        value: 0, // Placeholder
        tone: "emerald",
      },
      {
        id: "hiring-rate",
        label: "معدل التوظيف",
        value: "0%", // Placeholder
        tone: "rose",
      },
    ],
    applicantsSummary: {
      total: totalApplicantsRes.count || 0,
      label: "متقدم",
      segments: [
        { id: "full-time", label: "دوام كامل", value: totalApplicantsRes.count || 0, color: "#ef4444" },
      ],
    },
    jobsOverview: {
      rangeLabel: "عرض إحصائيات الوظائف في آخر 7 أيام",
      summary: {
        views: { value: 0, delta: 0 },
        applications: { value: totalApplicantsRes.count || 0, delta: 0 },
      },
      charts: {
        week: chartData,
        month: [],
        year: [],
      },
    },
    latestJobs: mappedLatestJobs,
  };
}
