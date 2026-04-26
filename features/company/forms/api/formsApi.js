/**
 * Forms API service
 * Handles all form-related API calls
 */

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const formsApi = {
  /**
   * Fetch all forms
   */
  async getAll() {
    return apiClient.get(API_ENDPOINTS.FORMS);
  },

  /**
   * Fetch a single form by ID
   */
  async getById(id) {
    return apiClient.get(API_ENDPOINTS.FORM_BY_ID(id));
  },

  /**
   * Create a new form
   */
  async create(formData) {
    return apiClient.post(API_ENDPOINTS.FORMS, formData);
  },

  /**
   * Update an existing form
   */
  async update(id, formData) {
    return apiClient.put(API_ENDPOINTS.FORM_BY_ID(id), formData);
  },

  /**
   * Delete a form
   */
  async delete(id) {
    return apiClient.delete(API_ENDPOINTS.FORM_BY_ID(id));
  },
};
