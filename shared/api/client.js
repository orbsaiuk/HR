/**
 * Base API client for making HTTP requests
 * Provides consistent error handling and request configuration
 */

/**
 * Create an API error object
 */
export function createApiError(message, status, data) {
    const error = new Error(message);
    error.name = 'ApiError';
    error.status = status;
    error.data = data;
    return error;
}

const defaultOptions = {
    headers: {
        'Content-Type': 'application/json',
    },
};

async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw createApiError(
            error.error || error.message || 'An error occurred',
            response.status,
            error
        );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();
}

export const apiClient = {
    async get(url, options = {}) {
        const response = await fetch(url, {
            ...defaultOptions,
            ...options,
            method: 'GET',
        });
        return handleResponse(response);
    },

    async post(url, data, options = {}) {
        const response = await fetch(url, {
            ...defaultOptions,
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    async put(url, data, options = {}) {
        const response = await fetch(url, {
            ...defaultOptions,
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    async patch(url, data, options = {}) {
        const response = await fetch(url, {
            ...defaultOptions,
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    async delete(url, options = {}) {
        const response = await fetch(url, {
            ...defaultOptions,
            ...options,
            method: 'DELETE',
        });
        return handleResponse(response);
    },
};
