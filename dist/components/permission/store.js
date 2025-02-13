"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermission = getPermission;
exports.getPermissions = getPermissions;
exports.addPermission = addPermission;
exports.updatePermission = updatePermission;
exports.deletePermission = deletePermission;
const model_1 = __importDefault(require("./model"));
async function getPermission(id) {
    try {
        let query = {};
        if (id) {
            query = { _id: id };
        }
        const result = await model_1.default.findOne(query);
        if (!result) {
            return {
                status: 404,
                message: "No permission found",
            };
        }
        return {
            status: 200,
            message: result,
        };
    }
    catch (e) {
        console.log("[ERROR] -> getPermission", e);
        return {
            status: 400,
            message: "Results error",
            detail: e,
        };
    }
}
async function getPermissions(searchParams) {
    try {
        const searchValue = searchParams ? searchParams.toLowerCase() : "";
        const query = {
            $or: [
                { title: { $regex: searchValue, $options: "i" } },
                { route: { $regex: searchValue, $options: "i" } },
                { module: { $regex: searchValue, $options: "i" } },
                { method: { $regex: searchValue, $options: "i" } },
            ],
        };
        const result = await model_1.default.find(query);
        const groupedByModule = result.reduce((acc, permission) => {
            const moduleName = permission.module;
            if (!acc[moduleName]) {
                acc[moduleName] = [];
            }
            acc[moduleName].push(permission);
            return acc;
        }, {});
        const permissions = Object.keys(groupedByModule).map((moduleName) => ({
            module: {
                name: moduleName,
                permissions: groupedByModule[moduleName],
            },
        }));
        return {
            status: 200,
            message: permissions,
        };
    }
    catch (e) {
        console.log("[ERROR] -> getPermissions", e);
        return {
            status: 400,
            message: "Results error",
            detail: e,
        };
    }
}
async function addPermission(data) {
    try {
        const companyData = {
            title: data.title,
            route: data.route,
            module: data.module,
            method: data.method,
            roles: data.roles,
        };
        const permission = new model_1.default(companyData);
        const result = await permission.save();
        return {
            status: 201,
            message: result,
        };
    }
    catch (e) {
        console.log("[ERROR] -> addPermission", e);
        return {
            status: 400,
            message: "An error occurred while creating the permission",
            detail: e,
        };
    }
}
async function updatePermission(id, updateData) {
    try {
        const permission = await model_1.default.findById(id);
        if (!permission) {
            return {
                status: 404,
                message: "Permission not found",
            };
        }
        Object.keys(updateData).forEach((key) => {
            permission[key] = updateData[key];
        });
        await permission.save();
        return {
            status: 200,
            message: "Permission updated successfully",
        };
    }
    catch (e) {
        console.log("[ERROR] -> updatePermission", e);
        return {
            status: 400,
            message: "Update error",
            detail: e,
        };
    }
}
async function deletePermission(id) {
    try {
        const foundItem = await model_1.default.findOne({
            _id: id,
        });
        if (!foundItem) {
            return {
                status: 404,
                message: "No permission found",
            };
        }
        await foundItem.deleteOne();
        return { status: 200, message: "Permission deleted" };
    }
    catch (e) {
        console.log("[ERROR] -> deletePermission", e);
        return {
            status: 400,
            message: "An error occurred while deleting the Permission",
            detail: e,
        };
    }
}
