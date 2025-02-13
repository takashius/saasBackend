"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create = {
    post: {
        tags: ["Permissions"],
        summary: "Create permission",
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
                description: "Permission title",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "route",
                in: "body",
                description: "Permission route",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "module",
                in: "body",
                description: "Permission module",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "method",
                in: "body",
                description: "Permission method http",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "roles",
                in: "body",
                description: "roles",
                required: false,
                schema: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    $ref: "#/definitions/CreatedPermission",
                },
            },
        },
    },
};
const update = {
    patch: {
        tags: ["Permissions"],
        summary: "Update permission",
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
                description: "Permission ID",
                required: true,
                schema: { type: "string", format: "uuid" },
            },
            {
                name: "title",
                in: "body",
                description: "Permission title",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "route",
                in: "body",
                description: "Permission route",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "module",
                in: "body",
                description: "Permission module",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "method",
                in: "body",
                description: "Permission method http",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "roles",
                in: "body",
                description: "roles",
                required: false,
                schema: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    $ref: "#/definitions/CreatedPermission",
                },
            },
        },
    },
};
const permissionByID = {
    get: {
        tags: ["Permissions"],
        summary: "Permission by ID",
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
                description: "ID to search",
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
                    $ref: "#/definitions/CreatedPermission",
                },
            },
        },
    },
};
const list = {
    get: {
        tags: ["Permissions"],
        summary: "Permission list",
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
                in: "query",
                description: "Page number",
                required: false,
                schema: { type: "string" },
            },
            {
                name: "pattern",
                in: "query",
                description: "Pattern search",
                required: false,
                schema: { type: "string" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    $ref: "#/definitions/ListPermission",
                },
            },
        },
    },
};
const deleted = {
    delete: {
        tags: ["Permissions"],
        summary: "Delete Permission",
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
    Permissions: {
        required: ["id", "title", "route", "module", "method"],
        properties: {
            id: {
                type: "string",
                format: "uuid",
                uniqueItems: true,
            },
            title: {
                type: "string",
            },
            route: {
                type: "string",
            },
            module: {
                type: "string",
            },
            method: {
                type: "string",
            },
            roles: {
                type: "array",
                items: {
                    type: "object",
                },
            },
        },
    },
    CreatedPermission: {
        properties: {
            _id: { type: "string", format: "uuid" },
            title: { type: "string" },
            route: { type: "string" },
            module: { type: "string" },
            method: { type: "string" },
            roles: {
                type: "array",
                items: {
                    type: "object",
                },
            },
        },
    },
    ListPermission: {
        properties: {
            type: "array",
            items: { $ref: "#/definitions/CreatedPermission" },
        },
    },
};
exports.default = {
    create,
    update,
    list,
    permissionByID,
    deleted,
    definitions,
};
