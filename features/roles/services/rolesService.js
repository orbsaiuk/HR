import { client } from "@/sanity/client";
import { roleQueries } from "@/sanity/queries";
import { DEFAULT_ROLES } from "@/shared/lib/permissions";

export async function getOrganizationRoles(orgId) {
    const result = await client.fetch(roleQueries.getAllRoles, { orgId });
    return result || [];
}

export async function getRoleByKey(orgId, roleKey) {
    const result = await client.fetch(roleQueries.getRoleByKey, { orgId, roleKey });
    return result || null;
}

export async function seedDefaultRoles(orgId) {
    const timestamp = new Date().toISOString();
    const roles = DEFAULT_ROLES.map((role) => ({
        ...role,
        createdAt: timestamp,
    }));
    return client.patch(orgId).set({ roles }).commit();
}

export async function createRole(orgId, { name, description, permissions }) {
    const timestamp = new Date().toISOString();
    const _key = name.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();
    const newRole = {
        _key,
        name,
        description: description || "",
        permissions: permissions || [],
        isSystem: false,
        createdAt: timestamp,
    };
    await client
        .patch(orgId)
        .append("roles", [newRole])
        .commit();
    return newRole;
}

export async function updateRole(orgId, roleKey, updates) {
    const setObj = {};
    if (updates.name !== undefined) {
        setObj[`roles[_key == "${roleKey}"].name`] = updates.name;
    }
    if (updates.description !== undefined) {
        setObj[`roles[_key == "${roleKey}"].description`] = updates.description;
    }
    if (updates.permissions !== undefined) {
        setObj[`roles[_key == "${roleKey}"].permissions`] = updates.permissions;
    }
    if (Object.keys(setObj).length === 0) return null;
    return client.patch(orgId).set(setObj).commit();
}

export async function deleteRole(orgId, roleKey) {
    const role = await getRoleByKey(orgId, roleKey);
    if (!role) throw new Error("Role not found");
    if (role.isSystem) throw new Error("Cannot delete system roles");

    const membersWithRole = await client.fetch(
        roleQueries.countMembersWithRole,
        { orgId, roleKey },
    );
    if (membersWithRole > 0) {
        throw new Error(
            "Cannot delete a role that is assigned to team members. Reassign them first.",
        );
    }

    const invitesWithRole = await client.fetch(
        roleQueries.countInvitesWithRole,
        { orgId, roleKey },
    );
    if (invitesWithRole > 0) {
        throw new Error(
            "Cannot delete a role that is assigned to pending invites. Update them first.",
        );
    }

    return client.patch(orgId).unset([`roles[_key == "${roleKey}"]`]).commit();
}

export async function getRoleMemberCount(orgId, roleKey) {
    return client.fetch(roleQueries.countMembersWithRole, { orgId, roleKey });
}
