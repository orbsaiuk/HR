/**
 * Public forms API service
 */

import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const publicFormsApi = {
    async getById(id) {
        const response = await fetch(`/api/forms/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch form');
        }
        return response.json();
    },

    async submit(id, answers, files = {}) {
        const formData = new FormData();
        formData.append('answers', JSON.stringify(answers));

        // Append files
        Object.entries(files).forEach(([key, file]) => {
            if (file) {
                formData.append(`file_${key}`, file);
            }
        });

        const response = await fetch(`/api/forms/${id}/submit`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to submit form');
        }

        return response.json();
    },
};
