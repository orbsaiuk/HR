import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const freelancerProfileApi = {
  async getProfile() {
    return apiClient.get(API_ENDPOINTS.FREELANCER_PROFILE);
  },

  async updateProfile(data) {
    return apiClient.put(API_ENDPOINTS.FREELANCER_PROFILE, data);
  },

  async uploadPortfolioImage(formData) {
    const response = await fetch(
      API_ENDPOINTS.FREELANCER_PROFILE_PORTFOLIO_IMAGE,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error || error.message || "Portfolio image upload failed",
      );
    }

    return response.json();
  },
};
