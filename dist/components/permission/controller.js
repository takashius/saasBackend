"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermission = getPermission;
exports.getPermissions = getPermissions;
exports.addPermission = addPermission;
exports.updatePermission = updatePermission;
exports.deletePermission = deletePermission;
const store_1 = require("./store");
async function getPermission(permissionId) {
    try {
        if (!permissionId) {
            return {
                status: 400,
                message: "No permission ID received",
            };
        }
        const result = await (0, store_1.getPermission)(permissionId);
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
async function getPermissions(searchParams) {
    try {
        const result = await (0, store_1.getPermissions)(searchParams);
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
async function addPermission(permission) {
    try {
        return await (0, store_1.addPermission)(permission);
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
async function updatePermission(permission) {
    try {
        if (!permission._id) {
            return {
                status: 400,
                message: "No permission ID received",
            };
        }
        const result = await (0, store_1.updatePermission)(permission._id, permission);
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
async function deletePermission(id) {
    try {
        if (!id) {
            return {
                status: 400,
                message: "No permission ID received",
            };
        }
        return await (0, store_1.deletePermission)(id);
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
