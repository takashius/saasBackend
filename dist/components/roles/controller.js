"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRole = getRole;
exports.getRoles = getRoles;
exports.addRole = addRole;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
exports.createRoleGroup = createRoleGroup;
exports.listRoleGroups = listRoleGroups;
exports.getRoleGroupById = getRoleGroupById;
exports.addRolesToRoleGroup = addRolesToRoleGroup;
exports.removeRolesFromRoleGroup = removeRolesFromRoleGroup;
const store_1 = require("./store");
async function getRole(roleId) {
    try {
        const result = await (0, store_1.getRole)(roleId);
        return result;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected error",
            detail: e,
        };
    }
}
async function getRoles(filter, page, simple) {
    try {
        if (!page || page < 1) {
            page = 1;
        }
        if (filter === "" || filter === undefined || !filter) {
            filter = null;
        }
        let newArray = [];
        let result = null;
        if (simple) {
            result = await (0, store_1.getSimple)();
            result.message.map((item) => {
                newArray.push({
                    id: item._id,
                    name: item.name,
                });
            });
        }
        else {
            result = await (0, store_1.getPaginate)(filter, page);
        }
        return {
            status: result.status,
            message: simple ? newArray : result.message,
        };
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected error",
            detail: e,
        };
    }
}
async function addRole(role) {
    try {
        return await (0, store_1.addRole)(role);
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function updateRole(role) {
    try {
        if (!role._id) {
            return {
                status: 400,
                message: "No role ID received",
            };
        }
        const result = await (0, store_1.updateRole)(role);
        return result;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function deleteRole(id) {
    try {
        return await (0, store_1.deleteRole)(id);
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function createRoleGroup(roleParent) {
    try {
        if (!roleParent) {
            return {
                status: 400,
                message: "Role parent is required",
                detail: {
                    name: "custom",
                    message: "roleParent: Role parent is required",
                },
            };
        }
        return await (0, store_1.createRoleGroup)(roleParent);
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function listRoleGroups() {
    try {
        return await (0, store_1.listRoleGroups)();
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function getRoleGroupById(id) {
    try {
        if (!id) {
            return {
                status: 400,
                message: "RoleGroup id is required",
                detail: {
                    name: "custom",
                    message: "id: RoleGroup id is required",
                },
            };
        }
        return await (0, store_1.getRoleGroupById)(id);
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function addRolesToRoleGroup(roleParent, roles) {
    try {
        if (!roleParent) {
            return {
                status: 400,
                message: "Role parent is required",
                detail: {
                    name: "custom",
                    message: "roleParent: Role parent is required",
                },
            };
        }
        if (!roles || roles.length === 0) {
            return {
                status: 400,
                message: "Roles are required",
                detail: {
                    name: "custom",
                    message: "roles: Roles are required",
                },
            };
        }
        return await (0, store_1.addRolesToRoleGroup)(roleParent, roles);
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function removeRolesFromRoleGroup(roleParent, roles) {
    try {
        if (!roleParent) {
            return {
                status: 400,
                message: "Role parent is required",
                detail: {
                    name: "custom",
                    message: "roleParent: Role parent is required",
                },
            };
        }
        if (!roles || roles.length === 0) {
            return {
                status: 400,
                message: "Roles are required",
                detail: {
                    name: "custom",
                    message: "roles: Roles are required",
                },
            };
        }
        return await (0, store_1.removeRolesFromRoleGroup)(roleParent, roles);
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
