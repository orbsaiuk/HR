import { getSupabaseServer } from "@/lib/supabase/server";
import { clientRead } from "@/sanity/client";

export async function getPublicPositions() {
  const supabase = getSupabaseServer();
  const { data: positions, error } = await supabase
    .from("job_positions")
    .select("*, forms(*)")
    .in("status", ["open", "published"])
    .or(`deadline.is.null,deadline.gte.${new Date().toISOString()}`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!positions || positions.length === 0) return [];

  // Fetch organization info from Sanity
  const orgIds = [...new Set(positions.map((p) => p.org_id).filter(Boolean))];
  const orgs = await clientRead.fetch(
    `*[_type == "organization" && _id in $orgIds]{
      _id, name, logo, "slug": slug.current
    }`,
    { orgIds }
  );
  
  const orgMap = orgs.reduce((acc, org) => {
    acc[org._id] = org;
    return acc;
  }, {});

  return positions.map((p) => ({
    _id: p.id,
    title: p.title,
    department: p.department,
    description: p.description,
    location: p.location,
    type: p.type,
    seniority: p.seniority,
    salaryMin: p.salary_min,
    salaryMax: p.salary_max,
    currency: p.currency,
    deadline: p.deadline,
    applicationMethod: p.application_method,
    createdAt: p.created_at,
    organizationName: orgMap[p.org_id]?.name,
    organizationLogo: orgMap[p.org_id]?.logo,
    organizationSlug: orgMap[p.org_id]?.slug,
  }));
}

export async function getPublicPositionById(id) {
  const supabase = getSupabaseServer();
  const { data: p, error } = await supabase
    .from("job_positions")
    .select("*, forms(*)")
    .eq("id", id)
    .in("status", ["open", "published"])
    .or(`deadline.is.null,deadline.gte.${new Date().toISOString()}`)
    .single();

  if (error || !p) return null;

  // Fetch organization info from Sanity
  let org = null;
  if (p.org_id) {
    org = await clientRead.fetch(
      `*[_type == "organization" && _id == $orgId][0]{
        _id, name, logo, "slug": slug.current, size
      }`,
      { orgId: p.org_id }
    );
  }

  return {
    _id: p.id,
    title: p.title,
    department: p.department,
    description: p.description,
    requirements: p.requirements,
    location: p.location,
    type: p.type,
    seniority: p.seniority,
    salaryMin: p.salary_min,
    salaryMax: p.salary_max,
    currency: p.currency,
    deadline: p.deadline,
    applicationMethod: p.application_method,
    createdAt: p.created_at,
    organizationId: org?._id,
    organizationName: org?.name,
    organizationLogo: org?.logo,
    organizationSlug: org?.slug,
    organizationSize: org?.size,
    form: p.forms ? {
      _id: p.forms.id,
      title: p.forms.title,
      fields: p.forms.fields,
      settings: p.forms.settings,
    } : null,
  };
}

export async function getDepartments() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("job_positions")
    .select("department")
    .in("status", ["open", "published"])
    .or(`deadline.is.null,deadline.gte.${new Date().toISOString()}`);
    
  if (error) throw error;
  return [...new Set(data.map(d => d.department).filter(Boolean))];
}

export async function getLocations() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("job_positions")
    .select("location")
    .in("status", ["open", "published"])
    .or(`deadline.is.null,deadline.gte.${new Date().toISOString()}`);
    
  if (error) throw error;
  return [...new Set(data.map(d => d.location).filter(Boolean))];
}
