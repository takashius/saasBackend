"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account = {
    get: {
        tags: ["Users"],
        summary: "Get user profile",
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
                    $ref: "#/definitions/ResponseUserData",
                },
            },
        },
    },
};
const updateRoles = {
    patch: {
        tags: ["Users"],
        summary: "Actualizar roles de usuario",
        description: "Actualiza los roles de un usuario específico",
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
                name: "roles",
                in: "body",
                description: "Array de IDs de roles",
                required: true,
                schema: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                    example: ["roleId1", "roleId2", "roleId3"],
                },
            },
        ],
        responses: {
            200: {
                description: "Roles actualizados exitosamente",
                content: {
                    "application/json": {
                        schema: {
                            type: "string",
                            example: "User roles updated successfully",
                        },
                    },
                },
            },
            400: {
                description: "Error en la solicitud",
                content: {
                    "application/json": {
                        schema: {
                            type: "string",
                            example: "Invalid role ID",
                        },
                    },
                },
            },
            500: {
                description: "Error inesperado",
                content: {
                    "application/json": {
                        schema: {
                            type: "string",
                            example: "Unexpected Error",
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
};
const login = {
    post: {
        tags: ["Users"],
        summary: "Login user with user and password",
        parameters: [
            {
                name: "email",
                in: "body",
                description: "User email to enter",
                required: true,
                schema: { type: "string", format: "email" },
            },
            {
                name: "password",
                in: "body",
                description: "User password to enter",
                required: true,
                schema: { type: "string" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    $ref: "#/definitions/ResponseUserLoginData",
                },
            },
        },
    },
};
const logout = {
    post: {
        tags: ["Users"],
        summary: "User logout",
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
const create = {
    post: {
        tags: ["Users"],
        summary: "Create User",
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
                name: "name",
                in: "body",
                description: "User name",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "lastName",
                in: "body",
                description: "User last name",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "phone",
                in: "body",
                description: "User phone number",
                required: false,
                schema: { type: "string" },
            },
            {
                name: "email",
                in: "body",
                description: "User email",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "password",
                in: "body",
                description: "User password to enter",
                required: true,
                schema: { type: "string" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    $ref: "#/definitions/ResponseUserLoginData",
                },
            },
        },
    },
};
const register = {
    post: {
        tags: ["Users"],
        summary: "Register User",
        parameters: [
            {
                name: "name",
                in: "body",
                description: "User name",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "email",
                in: "body",
                description: "User email",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "password",
                in: "body",
                description: "User password to enter",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "companyName",
                in: "body",
                description: "Name of company",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "docId",
                in: "body",
                description: "Document ID for Company",
                required: true,
                schema: { type: "string" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    $ref: "#/definitions/ResponseUserLoginData",
                },
            },
        },
    },
};
const update = {
    patch: {
        tags: ["Users"],
        summary: "Update User",
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
                description: "User ID",
                required: true,
                schema: { type: "string", format: "uuid" },
            },
            {
                name: "name",
                in: "body",
                description: "User name",
                required: false,
                schema: { type: "string" },
            },
            {
                name: "lastName",
                in: "body",
                description: "User last name",
                required: false,
                schema: { type: "string" },
            },
            {
                name: "phone",
                in: "body",
                description: "User phone number",
                required: false,
                schema: { type: "string" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    $ref: "#/definitions/ResponseUserData",
                },
            },
        },
    },
};
const upload = {
    post: {
        tags: ["Users"],
        summary: "Upload image",
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
                name: "image",
                in: "body",
                description: "File image",
                required: true,
                schema: { type: "file" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    $ref: "#/definitions/ResponseCloudinary",
                },
            },
        },
    },
};
const recoveryPass1 = {
    get: {
        tags: ["Users"],
        summary: "Recovery Password Step 1",
        parameters: [
            {
                name: "email",
                in: "path",
                description: "Email address",
                required: true,
                schema: { type: "string" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: { type: "string" },
            },
        },
    },
};
const recoveryPass2 = {
    post: {
        tags: ["Users"],
        summary: "Recovery Password Step 2",
        parameters: [
            {
                name: "email",
                in: "body",
                description: "Email address",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "code",
                in: "body",
                description: "Code received in a email",
                required: true,
                schema: { type: "string" },
            },
            {
                name: "newPass",
                in: "body",
                description: "Password to change",
                required: true,
                schema: { type: "string" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: { type: "string" },
            },
        },
    },
};
const list = {
    get: {
        tags: ["Users"],
        summary: "User list",
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
                    $ref: "#/definitions/Users",
                },
            },
        },
    },
};
const userByID = {
    get: {
        tags: ["Users"],
        summary: "User by ID",
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
                    $ref: "#/definitions/ResponseUserData",
                },
            },
        },
    },
};
const changePassword = {
    post: {
        tags: ["Users"],
        summary: "Change password to logged in user",
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
                name: "password",
                in: "body",
                description: "User password",
                required: true,
                schema: { type: "string" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: {
                    type: "string",
                    format: "Password changed successfully",
                },
            },
        },
    },
};
const addCompany = {
    post: {
        tags: ["Users"],
        summary: "Add company to user",
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
                name: "user",
                in: "body",
                description: "Id user",
                required: true,
                schema: { ttype: "string", format: "uuid" },
            },
            {
                name: "company",
                in: "body",
                description: "Id company from user",
                required: true,
                schema: { ttype: "string", format: "uuid" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: { type: "string" },
            },
        },
    },
};
const selectCompany = {
    patch: {
        tags: ["Users"],
        summary: "Select company to user default",
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
                name: "user",
                in: "body",
                description: "Id user",
                required: true,
                schema: { ttype: "string", format: "uuid" },
            },
            {
                name: "company",
                in: "body",
                description: "Id company from user",
                required: true,
                schema: { ttype: "string", format: "uuid" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: { type: "string" },
            },
        },
    },
};
const removeCompany = {
    delete: {
        tags: ["Users"],
        summary: "Remove company from user",
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
                name: "user",
                in: "body",
                description: "Id user",
                required: true,
                schema: { ttype: "string", format: "uuid" },
            },
            {
                name: "company",
                in: "body",
                description: "Id company from user",
                required: true,
                schema: { ttype: "string", format: "uuid" },
            },
        ],
        responses: {
            200: {
                description: "OK",
                schema: { type: "string" },
            },
        },
    },
};
const definitions = {
    User: {
        required: ["_id", "name", "lastName", "email", "photo", "phone", "date"],
        properties: {
            _id: {
                type: "string",
                format: "uuid",
                uniqueItems: true,
            },
            name: {
                type: "string",
            },
            lastName: {
                type: "string",
            },
            email: {
                type: "string",
                format: "email",
            },
            photo: {
                type: "string",
            },
            phone: {
                type: "string",
            },
            date: {
                type: "date",
            },
        },
    },
    Users: {
        type: "array",
        $ref: "#/definitions/User",
    },
    ResponseUserData: {
        properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            date: { type: "string", format: "date" },
        },
    },
    MiniDataUser: {
        properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
        },
    },
    CreatedUser: {
        properties: {
            user: { $ref: "#/definitions/MiniDataUser" },
            date: { type: "string", format: "date" },
        },
    },
    ResponseUserLoginData: {
        properties: {
            _id: { type: "string", format: "uuid" },
            name: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            date: { type: "string", format: "date" },
            token: { type: "string" },
        },
    },
    ResponseCloudinary: {
        properties: {
            fieldname: { type: "string" },
            originalname: { type: "string" },
            encoding: { type: "string" },
            mimetype: { type: "string" },
            path: { type: "string" },
            size: { type: "string" },
            filename: { type: "string" },
        },
    },
};
exports.default = {
    account,
    login,
    logout,
    register,
    create,
    update,
    list,
    userByID,
    changePassword,
    addCompany,
    selectCompany,
    removeCompany,
    upload,
    recoveryPass1,
    recoveryPass2,
    definitions,
    updateRoles,
};
