"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPost = getPost;
exports.getPosts = getPosts;
exports.addPost = addPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
const store_1 = require("./store");
async function getPost(postId) {
    try {
        const result = await (0, store_1.getPost)(postId);
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
async function getPosts(filter, page, simple) {
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
                    name: item.title,
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
async function addPost(post, file, user) {
    try {
        return await (0, store_1.addPost)(post, file, user);
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
async function updatePost(post, file) {
    try {
        if (!post._id) {
            return {
                status: 400,
                message: "No post ID received",
            };
        }
        const result = await (0, store_1.updatePost)(post, file);
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
async function deletePost(id) {
    try {
        return await (0, store_1.deletePost)(id);
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
