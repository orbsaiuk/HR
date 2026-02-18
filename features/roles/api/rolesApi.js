const API_BASE = "/api/roles";

export const rolesApi = {
    /**
     * Get all roles for the organization
     */
    async getAll() {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error("Failed to fetch roles");
        return response.json();
    },

    /**
     * Get a single role by key
     */
    async getByKey(key) {
        const response = await fetch(`${API_BASE}/${key}`);
        if (!response.ok) throw new Error("Failed to fetch role");
        return response.json();
    },

    /**
     * Create a new role
     */
    async create({ name, description, permissions }) {
        const response = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description, permissions }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to create role");
        }
        return response.json();
    },

    /**
     * Update an existing role
     */
    async update(key, updates) {
        const response = await fetch(`${API_BASE}/${key}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to update role");
        }
        return response.json();
    },

    /**
     * Delete a role
     */
    async delete(key) {
        const response = await fetch(`${API_BASE}/${key}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to delete role");
        }
        return response.json();
    },
};
