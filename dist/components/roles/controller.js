"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRole = getRole;
exports.getRoles = getRoles;
exports.addRole = addRole;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
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
