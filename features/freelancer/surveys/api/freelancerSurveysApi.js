import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const freelancerSurveysApi = {
  getSurveys: async () => {
    return apiClient.get(API_ENDPOINTS.FREELANCER_SURVEYS);
  },
  getSurvey: async (id) => {
    return apiClient.get(API_ENDPOINTS.FREELANCER_SURVEY_BY_ID(id));
  },
  createSurvey: async (data) => {
    return apiClient.post(API_ENDPOINTS.FREELANCER_SURVEYS, data);
  },
  updateSurvey: async (id, data) => {
    return apiClient.put(API_ENDPOINTS.FREELANCER_SURVEY_BY_ID(id), data);
  },
  deleteSurvey: async (id) => {
    return apiClient.delete(API_ENDPOINTS.FREELANCER_SURVEY_BY_ID(id));
  },
  getResponses: async (id) => {
    return apiClient.get(API_ENDPOINTS.FREELANCER_SURVEY_RESPONSES(id));
  },
  getResponseById: async (id, responseId) => {
    return apiClient.get(
      API_ENDPOINTS.FREELANCER_SURVEY_RESPONSE_BY_ID(id, responseId),
    );
  },
};
