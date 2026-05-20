import { getSupabaseServer } from "@/lib/supabase/server";
import { clientRead } from "@/sanity/client";
import { formatBudgetRange } from "@/features/shared/projects/model/companyProjectsSchema";

function mapProject(row) {
  const budgetMin = row.budget_min;
  const budgetMax = row.budget_max;
  return {
    _id: row.id,
    id: row.id,
    organization: { _id: row.org_id },
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    projectType: row.project_type,
    industry: row.industry,
    location: row.location || "",
    category: row.category || "",
    status: row.status,
    technologies: row.technologies || [],
    budgetMin,
    budgetMax,
    budgetRange:
      budgetMin != null && budgetMax != null
        ? formatBudgetRange(budgetMin, budgetMax)
        : "",
    currency: row.currency,
    duration: row.duration || "",
    experienceLevel: row.experience_level,
    teamSize: row.team_size,
    requirements: row.requirements || [],
    deliverables: row.deliverables || [],
    featured: row.featured,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    clientName: row.org_id, // Placeholder until joined
    proposalsCount: row.proposals_count || 0,
  };
}

export async function getProjects(filters = {}) {
  const supabase = getSupabaseServer();
  let query = supabase.from("projects").select("*, proposals_count:project_proposals(count)");

  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  
  if (!data || data.length === 0) return [];
  
  // Join Sanity orgs
  const orgIds = [...new Set(data.map((p) => p.org_id))];
  const orgs = await clientRead.fetch(
    `*[_type == "organization" && _id in $orgIds]{ _id, name, logo, rating, projectsCount }`,
    { orgIds }
  );
  
  const orgMap = orgs.reduce((acc, org) => {
    acc[org._id] = org;
    return acc;
  }, {});

  return data.map((row) => {
    const p = mapProject(row);
    if (orgMap[row.org_id]) {
      p.client = orgMap[row.org_id];
      p.clientName = orgMap[row.org_id].name;
    }
    p.proposalsCount = row.proposals_count?.[0]?.count || 0;
    return p;
  });
}

export async function getProjectsByOrg(orgId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("projects")
    .select("*, proposals_count:project_proposals(count)")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  return (data || []).map((row) => {
    const p = mapProject(row);
    p.proposalsCount = row.proposals_count?.[0]?.count || 0;
    return p;
  });
}

export async function getProjectById(id) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("projects")
    .select("*, proposals_count:project_proposals(count)")
    .eq("id", id)
    .single();
    
  if (error || !data) return null;
  
  const p = mapProject(data);
  p.proposalsCount = data.proposals_count?.[0]?.count || 0;
  
  if (p.organization?._id) {
    p.client = await clientRead.fetch(
      `*[_type == "organization" && _id == $orgId][0]{ _id, name, logo, rating, projectsCount }`,
      { orgId: p.organization._id }
    );
    p.clientName = p.client?.name;
  }
  
  return p;
}

export async function getProjectFilters() {
  const supabase = getSupabaseServer();
  // Fetch just the columns we need to build filters
  const { data, error } = await supabase
    .from("projects")
    .select("technologies, industry, project_type, status")
    .eq("status", "open");
    
  if (error) return { technologies: [], industries: [], projectTypes: [], statuses: [] };
  
  const techs = new Set();
  const industries = new Set();
  const types = new Set();
  const statuses = new Set();
  
  data.forEach((p) => {
    if (p.technologies) p.technologies.forEach((t) => techs.add(t));
    if (p.industry) industries.add(p.industry);
    if (p.project_type) types.add(p.project_type);
    if (p.status) statuses.add(p.status);
  });
  
  return {
    technologies: [...techs],
    industries: [...industries],
    projectTypes: [...types],
    statuses: [...statuses],
  };
}

export async function createProject(doc) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      org_id: doc.organization?._ref || doc.org_id,
      title: doc.title,
      short_description: doc.shortDescription || "",
      description: doc.description || "",
      project_type: doc.projectType,
      industry: doc.industry,
      location: doc.location || null,
      category: doc.category || null,
      status: doc.status || "open",
      technologies: doc.technologies || [],
      budget_min: doc.budgetMin || null,
      budget_max: doc.budgetMax || null,
      currency: doc.currency || "USD",
      duration: doc.duration,
      experience_level: doc.experienceLevel,
      team_size: doc.teamSize,
      requirements: doc.requirements || [],
      deliverables: doc.deliverables || [],
      featured: doc.featured || false,
      published_at: doc.status === "open" ? new Date().toISOString() : null,
    })
    .select()
    .single();
    
  if (error) throw error;
  return mapProject(data);
}

export async function updateProject(id, doc) {
  const supabase = getSupabaseServer();
  
  const updateData = {};
  if (doc.title !== undefined) updateData.title = doc.title;
  if (doc.shortDescription !== undefined) updateData.short_description = doc.shortDescription;
  if (doc.description !== undefined) updateData.description = doc.description;
  if (doc.projectType !== undefined) updateData.project_type = doc.projectType;
  if (doc.industry !== undefined) updateData.industry = doc.industry;
  if (doc.location !== undefined) updateData.location = doc.location;
  if (doc.category !== undefined) updateData.category = doc.category;
  if (doc.status !== undefined) updateData.status = doc.status;
  if (doc.technologies !== undefined) updateData.technologies = doc.technologies;
  if (doc.budgetMin !== undefined) updateData.budget_min = doc.budgetMin;
  if (doc.budgetMax !== undefined) updateData.budget_max = doc.budgetMax;
  if (doc.currency !== undefined) updateData.currency = doc.currency;
  if (doc.duration !== undefined) updateData.duration = doc.duration;
  if (doc.experienceLevel !== undefined) updateData.experience_level = doc.experienceLevel;
  if (doc.teamSize !== undefined) updateData.team_size = doc.teamSize;
  if (doc.requirements !== undefined) updateData.requirements = doc.requirements;
  if (doc.deliverables !== undefined) updateData.deliverables = doc.deliverables;
  if (doc.featured !== undefined) updateData.featured = doc.featured;
  
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();
    
  if (error) throw error;
  return mapProject(data);
}

export async function getFreelancerProposalsWithProjects(freelancerId) {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
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
        currency,
        duration,
        published_at
      )
    `)
    .eq("freelancer_id", freelancerId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(row => ({
    id: row.id,
    proposalStatus: row.status,
    proposedBudget: row.proposed_budget,
    createdAt: row.created_at,
    projectId: row.project?.id,
    title: row.project?.title,
    projectStatus: row.project?.status,
    budgetMin: row.project?.budget_min,
    budgetMax: row.project?.budget_max,
    currency: row.project?.currency,
    duration: row.project?.duration,
  }));
}

export async function deleteProject(id) {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
  return true;
}

export async function submitProposal(doc) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("project_proposals")
    .insert({
      project_id: doc.projectId,
      freelancer_id: doc.freelancerId,
      cover_letter: doc.coverLetter || "",
      proposed_budget: doc.proposedBudget || null,
      status: "pending",
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function checkProposalExists(projectId, freelancerId) {
  const supabase = getSupabaseServer();
  const { count, error } = await supabase
    .from("project_proposals")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId)
    .eq("freelancer_id", freelancerId);
    
  if (error) throw error;
  return count > 0;
}
