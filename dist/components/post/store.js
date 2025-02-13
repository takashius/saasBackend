"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPost = getPost;
exports.getSimple = getSimple;
exports.getPaginate = getPaginate;
exports.addPost = addPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
const model_1 = __importDefault(require("./model"));
const moment_1 = __importDefault(require("moment"));
const saveFile_1 = require("../../middleware/saveFile");
async function getPost(id) {
    try {
        let query = { active: true };
        if (id) {
            query = { _id: id };
        }
        const result = await model_1.default.findOne(query);
        return {
            status: 200,
            message: result,
        };
    }
    catch (e) {
        console.log("[ERROR] -> getPost", e);
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
        let select = "id title";
        const result = await model_1.default.find(query).select(select).sort({ name: "asc" });
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
        let query = { active: true };
        let select = "";
        if (filter) {
            query.$or = [
                { title: { $regex: filter, $options: "i" } },
                { resume: { $regex: filter, $options: "i" } },
                { content: { $regex: filter, $options: "i" } },
            ];
        }
        select = "id title resume content image createdAt updatedAt";
        const result = await model_1.default.find(query)
            .select(select)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({
            name: "asc",
        });
        const formattedResult = result.map((post) => {
            const plainPost = post.toObject();
            return {
                ...plainPost,
                createdAt: (0, moment_1.default)(post.createdAt).format("DD/MM/YYYY HH:mm"),
                updatedAt: (0, moment_1.default)(post.updatedAt).format("DD/MM/YYYY HH:mm"),
            };
        });
        const totalPosts = await model_1.default.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / limit);
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
                results: formattedResult,
                totalPosts,
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
async function addPost(post, file, user) {
    try {
        const data = new model_1.default({
            title: post.title,
            resume: post.resume,
            content: post.content,
            image: (file === null || file === void 0 ? void 0 : file.path) ? file.path : "",
            user,
        });
        await data.save();
        return { status: 201, message: dataFormatted(data) };
    }
    catch (e) {
        return {
            status: 500,
            message: "Post registration error",
            detail: e,
        };
    }
}
async function updatePost(post, file) {
    try {
        const foundPost = await model_1.default.findOne({ _id: post._id });
        if (!foundPost) {
            throw new Error("No post found");
        }
        if (post.title) {
            foundPost.title = post.title;
        }
        if (post.resume) {
            foundPost.resume = post.resume;
        }
        if (post.content) {
            foundPost.content = post.content;
        }
        if (file) {
            if (foundPost.image) {
                (0, saveFile_1.removeImage)(foundPost.image);
            }
            foundPost.image = file.path;
        }
        await foundPost.save();
        return { status: 200, message: dataFormatted(foundPost) };
    }
    catch (e) {
        return {
            status: 500,
            message: "Unexpected store error",
            detail: e,
        };
    }
}
async function deletePost(id) {
    try {
        const foundPost = await model_1.default.findOne({
            _id: id,
        });
        if (!foundPost) {
            throw new Error("No Post found");
        }
        foundPost.active = false;
        foundPost.save();
        return { status: 200, message: "Post deleted" };
    }
    catch (e) {
        console.log("[ERROR] -> deletePost", e);
        return {
            status: 400,
            message: "An error occurred while deleting the post",
            detail: e,
        };
    }
}
const dataFormatted = (data) => {
    const formattedCreatedAt = (0, moment_1.default)(data.createdAt).format("DD/MM/YYYY HH:mm");
    const formattedUpdatedAt = (0, moment_1.default)(data.updatedAt).format("DD/MM/YYYY HH:mm");
    const dataFormatted = {
        _id: data._id,
        id: data.id,
        title: data.title,
        resume: data.resume,
        content: data.content,
        image: data.image,
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
    };
    return dataFormatted;
};
