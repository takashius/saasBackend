const create = {
  post: {
    tags: ["Categories"],
    summary: "Create category",
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
        description: "Category name",
        required: true,
        schema: { type: "string" },
      },
      {
        name: "description",
        in: "body",
        description: "Category description",
        required: true,
        schema: { type: "string" },
      },
      {
        name: "image",
        in: "body",
        description: "Category image",
        required: false,
        schema: { type: "file" },
      },
    ],
    responses: {
      200: {
        description: "OK",
        schema: {
          $ref: "#/definitions/CreatedCategory",
        },
      },
    },
  },
};
const update = {
  patch: {
    tags: ["Categories"],
    summary: "Update category",
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
        description: "Category name",
        required: true,
        schema: { type: "string" },
      },
      {
        name: "description",
        in: "body",
        description: "Category description",
        required: true,
        schema: { type: "string" },
      },
      {
        name: "image",
        in: "body",
        description: "Category image",
        required: false,
        schema: { type: "file" },
      },
    ],
    responses: {
      200: {
        description: "OK",
        schema: {
          $ref: "#/definitions/CreatedCategory",
        },
      },
    },
  },
};
const categoryByID = {
  get: {
    tags: ["Categories"],
    summary: "Category by ID",
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
          $ref: "#/definitions/CreatedCategory",
        },
      },
    },
  },
};
const list = {
  get: {
    tags: ["Categories"],
    summary: "Category list paginated",
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
          $ref: "#/definitions/ListCategory",
        },
      },
    },
  },
};
const simple = {
  get: {
    tags: ["Categories"],
    summary: "Category simple list",
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
    tags: ["Categories"],
    summary: "Delete Category",
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
  Categories: {
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
      image: {
        type: "string",
      },
    },
  },
  CreatedCategory: {
    properties: {
      _id: { type: "string", format: "uuid" },
      name: { type: "string" },
      description: { type: "string" },
      image: { type: "string" },
    },
  },
  ListCategory: {
    properties: {
      results: {
        type: "array",
        items: { $ref: "#/definitions/CreatedCategory" },
      },
      totalPosts: { type: "number", example: "1" },
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
  categoryByID,
  deleted,
  definitions,
};
