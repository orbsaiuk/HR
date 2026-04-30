import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const projectsApi = {
  /**
   * Get all projects for the projects page
   */
  async getProjects(params = {}) {
    const query = new URLSearchParams();
    if (params.projectType) query.set("projectType", params.projectType);
    if (params.industry) query.set("industry", params.industry);
    if (params.technology) query.set("technology", params.technology);
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);

    const qs = query.toString();
    const url = `${API_ENDPOINTS.PROJECTS}${qs ? `?${qs}` : ""}`;
    return apiClient.get(url);
  },

  /**
   * Get a single project by ID
   */
  async getById(id) {
    return apiClient.get(API_ENDPOINTS.PROJECT_BY_ID(id));
  },

  /**
   * Get filter options (technologies, industries, etc.)
   */
  async getFilters() {
    return apiClient.get(API_ENDPOINTS.PROJECT_FILTERS);
  },

  // --- Company Endpoints ---

  async getCompanyProjects() {
    return apiClient.get(API_ENDPOINTS.COMPANY_PROJECTS);
  },
  async createCompanyProject(payload) {
    return apiClient.post(API_ENDPOINTS.COMPANY_PROJECTS, payload);
  },
  async updateCompanyProject(id, payload) {
    return apiClient.put(API_ENDPOINTS.COMPANY_PROJECT_BY_ID(id), payload);
  },
  async deleteCompanyProject(id) {
    return apiClient.delete(API_ENDPOINTS.COMPANY_PROJECT_BY_ID(id));
  },

  // --- Freelancer Endpoints ---

  async getFreelancerProjects() {
    return apiClient.get(API_ENDPOINTS.FREELANCER_PROJECTS);
  },
};
