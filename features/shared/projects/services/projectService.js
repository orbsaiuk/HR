import {
  getProjects as repoGetProjects,
  getProjectsByOrg as repoGetProjectsByOrg,
  getProjectById as repoGetProjectById,
  getProjectFilters as repoGetProjectFilters,
  createProject as repoCreateProject,
  updateProject as repoUpdateProject,
  deleteProject as repoDeleteProject,
  submitProposal as repoSubmitProposal,
  checkProposalExists as repoCheckProposalExists,
  getFreelancerProposalsWithProjects as repoGetFreelancerProposalsWithProjects,
} from "../repositories/projectRepository";

export async function getProjects(filters = {}) {
  return repoGetProjects(filters);
}

export async function getCompanyProjects(orgId) {
  return repoGetProjectsByOrg(orgId);
}

export async function getFreelancerProjects(freelancerId) {
  return repoGetFreelancerProposalsWithProjects(freelancerId);
}

export async function getProjectById(id) {
  return repoGetProjectById(id);
}

export async function getProjectFilters() {
  return repoGetProjectFilters();
}

export async function createProject(doc) {
  return repoCreateProject(doc);
}

export async function submitProjectProposal(doc) {
  const existing = await repoCheckProposalExists(doc.projectId, doc.freelancerId);
  if (existing) {
    throw new Error("You have already submitted a proposal for this project");
  }
  return repoSubmitProposal(doc);
}

export async function updateProject(id, doc) {
  return repoUpdateProject(id, doc);
}

export async function deleteProject(id) {
  return repoDeleteProject(id);
}

export const projectService = {
  getProjects,
  getCompanyProjects,
  getProjectById,
  getProjectFilters,
  createProject,
  updateProject,
  deleteProject,
  submitProjectProposal,
};
