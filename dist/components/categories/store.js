"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategory = getCategory;
exports.getSimple = getSimple;
exports.getPublic = getPublic;
exports.getPaginate = getPaginate;
exports.addCategory = addCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const model_1 = __importDefault(require("./model"));
const saveFile_1 = require("../../middleware/saveFile");
async function getCategory(id) {
    try {
        let query = { active: true };
        if (id) {
            query._id = id;
        }
        const result = await model_1.default.findOne(query);
        if (!result) {
            return {
                status: 404,
                message: "No Category found",
            };
        }
        return {
            status: 200,
            message: result,
        };
    }
    catch (e) {
        console.log("[ERROR] -> getCategory", e);
        return {
            status: 400,
            message: "Results error",
            detail: e,
        };
    }
}
async function getSimple() {
    try {
        let query = { active: true };
        let select = "id name";
        const result = await model_1.default.find(query)
            .select(select)
            .sort({ name: "asc" });
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
async function getPublic() {
    try {
        let query = { active: true };
        let select = "id name image";
        const result = await model_1.default.find(query)
            .select(select)
            .sort({ name: "asc" });
        return {
            status: 200,
            message: result,
        };
    }
    catch (e) {
        console.log("[ERROR] -> getPublic", e);
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
        let query = { active: true };
        let select = "";
        if (filter) {
            query.$or = [
                { name: { $regex: filter, $options: "i" } },
                { description: { $regex: filter, $options: "i" } },
            ];
        }
        select = "id name description image";
        const result = await model_1.default.find(query)
            .select(select)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({
            name: "asc",
        });
        const totalCategories = await model_1.default.countDocuments(query);
        const totalPages = Math.ceil(totalCategories / limit);
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
                totalCategories,
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
async function addCategory(category, file) {
    try {
        const data = new model_1.default({
            name: category.name,
            description: category.description,
            image: (file === null || file === void 0 ? void 0 : file.path) ? file.path : "",
        });
        await data.save();
        return {
            status: 201,
            message: {
                _id: data.id,
                name: data.name,
                description: data.description,
                image: data.image,
            },
        };
    }
    catch (e) {
        return {
            status: 500,
            message: "Category registration error",
            detail: e,
        };
    }
}
async function updateCategory(category, file) {
    try {
        const foundCategory = await model_1.default.findOne({ _id: category._id });
        if (!foundCategory) {
            throw new Error("No category found");
        }
        if (category.name) {
            foundCategory.name = category.name;
        }
        if (category.description) {
            foundCategory.description = category.description;
        }
        if (file) {
            if (foundCategory.image) {
                (0, saveFile_1.removeImage)(foundCategory.image);
            }
            foundCategory.image = file.path;
        }
        await foundCategory.save();
        const { _id, name, description, image } = foundCategory;
        const rol = { _id, name, description, image };
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
async function deleteCategory(id) {
    try {
        const foundCategory = await model_1.default.findOne({
            _id: id,
        });
        if (!foundCategory) {
            throw new Error("No Category found");
        }
        foundCategory.active = false;
        foundCategory.save();
        return { status: 200, message: "Category deleted" };
    }
    catch (e) {
        console.log("[ERROR] -> deleteCategory", e);
        return {
            status: 400,
            message: "An error occurred while deleting the category",
            detail: e,
        };
    }
}
