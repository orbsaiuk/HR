import { getSupabaseServer } from "@/lib/supabase/server";
import { clientRead } from "@/sanity/client";

export async function getFreelancerDashboardStats(freelancerId) {
  const supabase = getSupabaseServer();

  // 1. Fetch Freelancer Profile from Sanity
  const profilePromise = clientRead.fetch(
    `*[_type == "freelancerProfile" && _id == $freelancerId][0]{ 
      "name": user->name,
      rating
    }`,
    { freelancerId }
  );

  // 2. Fetch Supabase Data
  // Active Projects (accepted proposals)
  const activeProjectsPromise = supabase
    .from("project_proposals")
    .select("*", { count: "exact", head: true })
    .eq("freelancer_id", freelancerId)
    .eq("status", "accepted");

  // Sent Proposals (pending)
  const sentProposalsPromise = supabase
    .from("project_proposals")
    .select("*", { count: "exact", head: true })
    .eq("freelancer_id", freelancerId)
    .eq("status", "pending");

  // All non-rejected proposals for earnings calculation
  const earningProposalsPromise = supabase
    .from("project_proposals")
    .select("proposed_budget")
    .eq("freelancer_id", freelancerId)
    .in("status", ["accepted", "completed"]);

  // Latest 5 proposals
  const latestProposalsPromise = supabase
    .from("project_proposals")
    .select(`
      id,
      status,
      proposed_budget,
      created_at,
      project:projects (
        id,
        title,
        status,
        budget_min,
        budget_max,
        experience_level,
        org_id,
        location:org_id
      )
    `)
    .eq("freelancer_id", freelancerId)
    .order("created_at", { ascending: false })
    .limit(5);

  const [
    profile,
    activeProjectsRes,
    sentProposalsRes,
    earningProposalsRes,
    latestProposalsRes,
  ] = await Promise.all([
    profilePromise,
    activeProjectsPromise,
    sentProposalsPromise,
    earningProposalsPromise,
    latestProposalsPromise,
  ]);

  // Calculate earnings
  let totalEarnings = 0;
  if (earningProposalsRes.data) {
    totalEarnings = earningProposalsRes.data.reduce((sum, p) => sum + (Number(p.proposed_budget) || 0), 0);
  }

  // Get Organization Details for recent proposals
  let mappedLatestProposals = [];
  if (latestProposalsRes.data && latestProposalsRes.data.length > 0) {
    const orgIds = [...new Set(latestProposalsRes.data.map((p) => p.project?.org_id).filter(Boolean))];
    
    let orgMap = {};
    if (orgIds.length > 0) {
      const orgs = await clientRead.fetch(
        `*[_type == "organization" && _id in $orgIds]{ _id, name, location }`,
        { orgIds }
      );
      orgMap = orgs.reduce((acc, org) => {
        acc[org._id] = org;
        return acc;
      }, {});
    }

    mappedLatestProposals = latestProposalsRes.data.map((p) => {
      const org = orgMap[p.project?.org_id] || {};
      const budgetStr = p.project?.budget_min && p.project?.budget_max 
        ? `$${p.project.budget_min} - $${p.project.budget_max}` 
        : p.proposed_budget ? `$${p.proposed_budget}` : "غير محدد";

      const statusMap = {
        pending: "بانتظار الرد",
        accepted: "تم القبول",
        rejected: "مرفوض",
        completed: "مكتمل"
      };

      return {
        id: p.id,
        title: p.project?.title || "مشروع محذوف",
        company: org.name || "شركة غير معروفة",
        location: org.location?.city || "غير محدد",
        budget: budgetStr,
        level: p.project?.experience_level || "غير محدد",
        submittedAt: new Date(p.created_at).toLocaleDateString("ar-SA"),
        status: statusMap[p.status] || p.status,
      };
    });
  }

  return {
    header: {
      name: profile?.name ? profile.name.split(" ")[0] : "مستقل",
      activeCount: activeProjectsRes.count || 0,
      newCount: sentProposalsRes.count || 0,
    },
    stats: {
      activeProjects: activeProjectsRes.count || 0,
      totalEarnings: totalEarnings,
      rating: profile?.rating || "0.0",
      sentProposals: sentProposalsRes.count || 0,
    },
    recentApplications: mappedLatestProposals,
  };
}
