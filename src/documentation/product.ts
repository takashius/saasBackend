const create = {
  post: {
    tags: ["Products"],
    summary: "Create product",
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
        description: "Name of product",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "description",
        in: "body",
        description: "Description of product",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "price",
        in: "body",
        description: "Price of product",
        required: true,
        schema: {
          type: "number",
          format: "float",
        },
      },
      {
        name: "category",
        in: "body",
        description: "Category of product",
        required: true,
        schema: {
          type: "string",
          format: "uuid",
        },
      },
      {
        name: "discount",
        in: "body",
        description: "Discount of product",
        required: false,
        schema: {
          type: "number",
          format: "float",
        },
      },
      {
        name: "image",
        in: "body",
        description: "Image of product",
        required: false,
        schema: {
          type: "string",
          format: "binary",
        },
      },
    ],
    responses: {
      201: {
        description: "Product created successfully",
        schema: {
          $ref: "#/definitions/CreatedProduct",
        },
      },
    },
  },
};

const update = {
  patch: {
    tags: ["Products"],
    summary: "Update Product",

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
        description: "Name of product",
        required: false,
        schema: {
          type: "string",
        },
      },
      {
        name: "description",
        in: "body",
        description: "Description of product",
        required: false,
        schema: {
          type: "string",
        },
      },
      {
        name: "price",
        in: "body",
        description: "Price of product",
        required: false,
        schema: {
          type: "number",
          format: "float",
        },
      },
      {
        name: "category",
        in: "body",
        description: "Category of product",
        required: false,
        schema: {
          type: "string",
          format: "uuid",
        },
      },
      {
        name: "discount",
        in: "body",
        description: "Discount of product",
        required: false,
        schema: {
          type: "number",
          format: "float",
        },
      },
      {
        name: "image",
        in: "body",
        description: "Image of product",
        required: false,
        schema: {
          type: "string",
          format: "binary",
        },
      },
    ],
    responses: {
      200: {
        description: "Product updated successfully",
        schema: {
          $ref: "#/definitions/CreatedProduct",
        },
      },
    },
  },
};

const productByID = {
  get: {
    tags: ["Products"],
    summary: "Product by ID",
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
        description: "ID of the product",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "Product retrieved successfully",
        schema: {
          $ref: "#/definitions/Product",
        },
      },
    },
  },
};

const list = {
  get: {
    tags: ["Products"],
    summary: "Products list paginated",
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
        schema: { type: "number" },
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
        description: "Products list retrieved successfully",
        schema: {
          $ref: "#/definitions/ListProduct",
        },
      },
    },
  },
};

const simple = {
  get: {
    tags: ["Products"],
    summary: "Products simple list",
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
        description: "Simple list of products retrieved successfully",
        schema: {
          $ref: "#/definitions/ListSimple",
        },
      },
    },
  },
};

const deleted = {
  delete: {
    tags: ["Products"],
    summary: "Delete Product",
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
        description: "ID of the product to delete",
        required: true,
        schema: {
          type: "string",
          format: "uuid",
        },
      },
    ],
    responses: {
      200: {
        description: "Product deleted successfully",
        schema: {
          type: "string",
        },
      },
    },
  },
};

const definitions = {
  Product: {
    required: ["id", "name"],
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
      price: {
        type: "number",
      },
      category: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
            },
          },
        },
      },
      discount: {
        type: "number",
      },
      image: {
        type: "string",
        format: "binary",
      },
      user: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
            },
            lastName: {
              type: "string",
            },
          },
        },
      },
      company: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
            },
          },
        },
      },
      createdAt: { type: "string", example: "14/10/2024 18:26" },
      updatedAt: { type: "string", example: "14/10/2024 18:26" },
      comments: {
        type: "array",
        items: {
          type: "object",
          properties: {
            user: {
              type: "string",
              format: "uuid",
            },
            rating: {
              type: "number",
              minimum: 1,
              maximum: 5,
            },
            comment: {
              type: "string",
            },
            date: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
      history: {
        type: "array",
        items: {
          type: "object",
          properties: {
            date: {
              type: "string",
              format: "date-time",
            },
            changes: {
              type: "object",
            },
          },
        },
      },
      finalPrice: {
        type: "number",
        example: 50,
      },
    },
  },
  ProductForList: {
    required: ["id", "name"],
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
      price: {
        type: "number",
      },
      category: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
            },
          },
        },
      },
      discount: {
        type: "number",
      },
      image: {
        type: "string",
      },
      finalPrice: {
        type: "number",
        example: 50,
      },
      createdAt: { type: "string", example: "14/10/2024 18:26" },
      updatedAt: { type: "string", example: "14/10/2024 18:26" },
    },
  },
  CreatedProduct: {
    properties: {
      _id: { type: "string", format: "uuid" },
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number", example: 50 },
      category: { type: "string", format: "uuid" },
      discount: { type: "number" },
      image: { type: "string" },
      finalPrice: { type: "number", example: 50 },
      createdAt: { type: "string", example: "14/10/2024 18:26" },
      updatedAt: { type: "string", example: "14/10/2024 18:26" },
    },
  },
  ListProduct: {
    properties: {
      results: {
        type: "array",
        items: { $ref: "#/definitions/ProductForList" },
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
  productByID,
  deleted,
  definitions,
};
