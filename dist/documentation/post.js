"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create = {
    post: {
        tags: ["Posts"],
        summary: "Create post",
        parameters: [
            {
                name: "Authorization",
                in: "header",
                description: "Authorization Bearer Token",
                required: true,
                schema: {
                    type: "string",
                },
            },
            {
                name: "title",
                in: "body",
                description: "Post title",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "resume",
                in: "body",
                description: "Post resume",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "content",
                in: "body",
                description: "Post content",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "image",
                in: "body",
                description: "Post image",
                required: false,
                schema: { type: "file" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    $ref: "#/definitions/CreatedPost",
                },
            },
        },
    },
};
const update = {
    patch: {
        tags: ["Posts"],
        summary: "Update post",
        parameters: [
            {
                name: "Authorization",
                in: "header",
                description: "Authorization Bearer Token",
                required: true,
                schema: {
                    type: "string",
                },
            },
            {
                name: "id",
                in: "body",
                description: "Post ID",
                required: true,
                schema: { type: "string", format: "uuid" },
            },
            {
                name: "title",
                in: "body",
                description: "Post title",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "resume",
                in: "body",
                description: "Post short description",
                required: false,
                schema: { type: "string" },
            },
            {
                name: "content",
                in: "body",
                description: "Post content",
                required: false,
                schema: { type: "string" },
            },
            {
                name: "image",
                in: "body",
                description: "Post image",
                required: false,
                schema: { type: "file" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    $ref: "#/definitions/CreatedPost",
                },
            },
        },
    },
};
const postByID = {
    get: {
        tags: ["Posts"],
        summary: "Post by ID",
        parameters: [
            {
                name: "Authorization",
                in: "header",
                description: "Authorization Bearer Token",
                required: true,
                schema: {
                    type: "string",
                },
            },
            {
                name: "id",
                in: "path",
                description: "id to search",
                required: true,
                schema: {
                    type: "string",
                },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    $ref: "#/definitions/CreatedPost",
                },
            },
        },
    },
};
const list = {
    get: {
        tags: ["Posts"],
        summary: "Posts list paginated",
        parameters: [
            {
                name: "Authorization",
                in: "header",
                description: "Authorization Bearer Token",
                required: true,
                schema: {
                    type: "string",
                },
            },
            {
                name: "page",
                in: "path",
                description: "Page number",
                required: false,
                schema: { type: "string" },
            },
            {
                name: "pattern",
                in: "path",
                description: "Pattern search",
                required: false,
                schema: { type: "string" },
            },
        ],
        responses: {
            200: {
                description: "Post list retrieved successfully",
                schema: {
                    $ref: "#/definitions/ListPost",
                },
            },
        },
    },
};
const simple = {
    get: {
        tags: ["Posts"],
        summary: "Posts simple list",
        parameters: [
            {
                name: "Authorization",
                in: "header",
                description: "Authorization Bearer Token",
                required: true,
                schema: {
                    type: "string",
                },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    $ref: "#/definitions/ListSimple",
                },
            },
        },
    },
};
const deleted = {
    delete: {
        tags: ["Posts"],
        summary: "Delete Post",
        parameters: [
            {
                name: "Authorization",
                in: "header",
                description: "Authorization Bearer Token",
                required: true,
                schema: {
                    type: "string",
                },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    type: "string",
                },
            },
        },
    },
};
const definitions = {
    Posts: {
        required: ["id", "title", "resume", "content", "image"],
        properties: {
            id: {
                type: "string",
                format: "uuid",
                uniqueItems: true,
            },
            title: {
                type: "string",
            },
            resume: {
                type: "string",
            },
            content: {
                type: "string",
            },
            image: {
                type: "string",
            },
            createdAt: { type: "string", example: "14/10/2024 18:26" },
            updatedAt: { type: "string", example: "14/10/2024 18:26" },
        },
    },
    CreatedPost: {
        properties: {
            _id: { type: "string", format: "uuid" },
            title: { type: "string" },
            resume: { type: "string" },
            content: { type: "string" },
            image: { type: "string" },
            createdAt: { type: "string", example: "14/10/2024 18:26" },
            updatedAt: { type: "string", example: "14/10/2024 18:26" },
        },
    },
    ListPost: {
        properties: {
            results: {
                type: "array",
                items: { $ref: "#/definitions/CreatedPost" },
            },
            totalPosts: { type: "number", example: "1" },
            totalPages: { type: "number", example: "1" },
            currentPage: { type: "number", example: "1" },
            next: { type: "number", example: "null" },
        },
    },
};
exports.default = {
    create,
    update,
    list,
    simple,
    postByID,
    deleted,
    definitions,
};
