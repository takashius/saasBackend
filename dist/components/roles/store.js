"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRole = getRole;
exports.getSimple = getSimple;
exports.getPaginate = getPaginate;
exports.addRole = addRole;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
const model_1 = require("../user/model");
async function getRole(id) {
    try {
        let query = {};
        if (id) {
            query = { _id: id };
        }
        const result = await model_1.Role.findOne(query);
        return {
            status: 200,
            message: result,
        };
    }
    catch (e) {
        console.log("[ERROR] -> getRole", e);
        return {
            status: 400,
            message: "Results error",
            detail: e,
        };
    }
}
async function getSimple() {
    try {
        let query = {};
        let select = "id name";
        const result = await model_1.Role.find(query).select(select).sort({ name: "asc" });
        return {
            status: 200,
            message: result,
        };
    }
    catch (e) {
        console.log("[ERROR] -> getSimple", e);
        return {
            status: 400,
            message: "Results error",
            detail: e,
        };
    }
}
async function getPaginate(filter, page) {
    try {
        const limit = 10;
        let query = {};
        let select = "";
        if (filter) {
            query.$or = [
                { name: { $regex: filter, $options: "i" } },
                { description: { $regex: filter, $options: "i" } },
            ];
        }
        select = "id name description";
        const result = await model_1.Role.find(query)
            .select(select)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({
            name: "asc",
        });
        const totalRoles = await model_1.Role.countDocuments(query);
        const totalPages = Math.ceil(totalRoles / limit);
        const next = () => {
            if (totalPages > page) {
                return page + 1;
            }
            else {
                return null;
            }
        };
        return {
            status: 200,
            message: {
                results: result,
                totalRoles,
                totalPages,
                currentPage: page,
                next: next(),
            },
        };
    }
    catch (e) {
        console.log("[ERROR] -> getPaginate", e);
        return {
            status: 400,
            message: "Results error",
            detail: e,
        };
    }
}
async function addRole(role) {
    try {
        const data = new model_1.Role({ name: role.name, description: role.description });
        await data.save();
        return { status: 201, message: data };
    }
    catch (e) {
        return {
            status: 500,
            message: "Role registration error",
            detail: e,
        };
    }
}
async function updateRole(role) {
    try {
        const foundRole = await model_1.Role.findOne({ _id: role._id });
        if (!foundRole) {
            throw new Error("No role found");
        }
        if (role.name) {
            foundRole.name = role.name;
        }
        if (role.description) {
            foundRole.description = role.description;
        }
        await foundRole.save();
        const { name, description } = foundRole;
        const rol = { name, description };
        return { status: 200, message: rol };
    }
    catch (e) {
        return {
            status: 500,
            message: "Unexpected store error",
            detail: e,
        };
    }
}
async function deleteRole(id) {
    try {
        const foundRole = await model_1.Role.findOne({ _id: id });
        if (!foundRole) {
            throw new Error("No role found");
        }
        foundRole.deleteOne({ _id: id });
        return { status: 200, message: "Role deleted" };
    }
    catch (e) {
        return {
            status: 500,
            message: "Unexpected store error",
            detail: e,
        };
    }
}
