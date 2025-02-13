"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategory = getCategory;
exports.getCategories = getCategories;
exports.getPublicCategories = getPublicCategories;
exports.addCategory = addCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const store_1 = require("./store");
async function getCategory(categoryId) {
    try {
        const result = await (0, store_1.getCategory)(categoryId);
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
async function getCategories(filter, page, simple) {
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
async function getPublicCategories() {
    try {
        const result = await (0, store_1.getPublic)();
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
async function addCategory(category, file) {
    try {
        return await (0, store_1.addCategory)(category, file);
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
async function updateCategory(category, file) {
    try {
        if (!category._id) {
            return {
                status: 400,
                message: "No category ID received",
            };
        }
        const result = await (0, store_1.updateCategory)(category, file);
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
async function deleteCategory(id) {
    try {
        return await (0, store_1.deleteCategory)(id);
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
