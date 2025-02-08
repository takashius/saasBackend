const create = {
  post: {
    tags: ["Plan"],
    summary: "Create plan",
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
        description: "Plan name",
        required: true,
        schema: { type: "number" },
      },
      {
        name: "cost",
        in: "body",
        description: "Plan cost",
        required: true,
        schema: { type: "string" },
      },
      {
        name: "features",
        in: "body",
        description: "Plan features",
        required: false,
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              value: { type: "any" },
            },
          },
        },
      },
    ],
    responses: {
      200: {
        description: "OK",
        schema: {
          $ref: "#/definitions/CreatedPlan",
        },
      },
      400: {
        description: "Invalid input",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};
const update = {
  patch: {
    tags: ["Plan"],
    summary: "Update plan",
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
        description: "Category ID",
        required: true,
        schema: { type: "string", format: "uuid" },
      },
      {
        name: "name",
        in: "body",
        description: "Plan name",
        required: false,
        schema: { type: "string" },
      },
      {
        name: "cost",
        in: "body",
        description: "Plan cost",
        required: false,
        schema: { type: "number" },
      },
      {
        name: "features",
        in: "body",
        description: "Plan features",
        required: false,
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              value: { type: "any" },
            },
          },
        },
      },
    ],
    responses: {
      200: {
        description: "OK",
        schema: {
          $ref: "#/definitions/CreatedPlan",
        },
      },
      404: {
        description: "Plan not found",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};
const planByID = {
  get: {
    tags: ["Plan"],
    summary: "Get plan by ID",
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
          $ref: "#/definitions/CreatedPlan",
        },
      },
      404: {
        description: "Plan not found",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};
const list = {
  get: {
    tags: ["Plan"],
    summary: "Plan list paginated",
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
          $ref: "#/definitions/ListPlan",
        },
      },
    },
  },
};
const simple = {
  get: {
    tags: ["Plan"],
    summary: "Plan simple list",
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
    tags: ["Plan"],
    summary: "Delete plan",
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
        description: "Plan ID",
        required: true,
        schema: { type: "string" },
      },
    ],
    responses: {
      200: {
        description: "OK",
        schema: {
          type: "string",
        },
      },
      404: {
        description: "Plan not found",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};

const definitions = {
  Plan: {
    required: ["id", "name", "cost", "features"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        uniqueItems: true,
      },
      name: {
        type: "string",
      },
      cost: {
        type: "string",
      },
      features: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            value: { type: "any" },
          },
        },
      },
    },
  },
  CreatedPlan: {
    properties: {
      _id: { type: "string", format: "uuid" },
      name: { type: "string" },
      cost: { type: "string" },
      features: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            value: { type: "any" },
          },
        },
      },
    },
  },
  ListPlan: {
    properties: {
      results: {
        type: "array",
        items: { $ref: "#/definitions/CreatedPlan" },
      },
      totalPlan: { type: "number", example: "1" },
      totalPages: { type: "number", example: "1" },
      currentPage: { type: "number", example: "1" },
      next: { type: "number", example: "null" },
    },
  },
};

export default {
  create,
  update,
  list,
  simple,
  planByID,
  deleted,
  definitions,
};
