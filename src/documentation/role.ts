const create = {
  post: {
    tags: ["Role"],
    summary: "Create role",
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
        description: "Role name",
        required: true,
        schema: { type: "string" },
      },
      {
        name: "description",
        in: "body",
        description: "Role description",
        required: true,
        schema: { type: "string" },
      },
    ],
    responses: {
      200: {
        description: "OK",
        schema: {
          $ref: "#/definitions/CreatedRole",
        },
      },
    },
  },
};
const update = {
  patch: {
    tags: ["Role"],
    summary: "Update role",
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
        description: "Role ID",
        required: true,
        schema: { type: "string", format: "uuid" },
      },
      {
        name: "name",
        in: "body",
        description: "Role name",
        required: true,
        schema: { type: "string" },
      },
      {
        name: "description",
        in: "body",
        description: "Role description",
        required: true,
        schema: { type: "string" },
      },
    ],
    responses: {
      200: {
        description: "OK",
        schema: {
          $ref: "#/definitions/CreatedRole",
        },
      },
    },
  },
};
const roleByID = {
  get: {
    tags: ["Role"],
    summary: "Role by ID",
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
          $ref: "#/definitions/CreatedRole",
        },
      },
    },
  },
};
const list = {
  get: {
    tags: ["Role"],
    summary: "Role list paginated",
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
        description: "OK",
        schema: {
          $ref: "#/definitions/ListRole",
        },
      },
    },
  },
};
const simple = {
  get: {
    tags: ["Role"],
    summary: "Role simple list",
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
    tags: ["Role"],
    summary: "Delete Role",
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
  Role: {
    required: ["id", "name", "description"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        uniqueItems: true,
      },
      name: {
        type: "string",
      },
      description: {
        type: "string",
      },
    },
  },
  CreatedRole: {
    properties: {
      _id: { type: "string", format: "uuid" },
      name: { type: "string" },
      description: { type: "string" },
    },
  },
  ListRole: {
    type: "array",
    $ref: "#/definitions/CreatedRole",
  },
  FormatSimple: {
    properties: {
      _id: { type: "string", format: "uuid" },
      name: { type: "string" },
    },
  },
  ListSimple: {
    type: "array",
    $ref: "#/definitions/FormatSimple",
  },
};

export default {
  create,
  update,
  list,
  simple,
  roleByID,
  deleted,
  definitions,
};
