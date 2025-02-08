import {
  getProduct as _getProduct,
  getSimple,
  getPaginate,
  getFeatured,
  getProductByCategory,
  addProduct as _addProduct,
  updateProduct as _updateProduct,
  deleteProduct as _deleteProduct,
} from "./store";

export async function getProduct(productId: string) {
  try {
    const result = await _getProduct(productId);
    return result;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected error",
      detail: e,
    };
  }
}

export async function getFeaturedProduct() {
  try {
    const result = await getFeatured();
    return result;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected error",
      detail: e,
    };
  }
}

export async function getProductsByCategory(category: string) {
  try {
    const result = await getProductByCategory(category);
    return result;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected error",
      detail: e,
    };
  }
}

export async function getProducts(
  filter: string,
  page: number,
  simple: boolean,
  user?: any
) {
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
      result = await getSimple();
      result.message.map((item: any) => {
        newArray.push({
          id: item._id,
          name: item.name,
        });
      });
    } else {
      const roles = user.role;
      if (roles.includes("SUPER_ADMIN")) {
        result = await getPaginate(filter, page, null);
      } else if (roles.includes("PROV_USER")) {
        result = await getPaginate(
          filter,
          page,
          user.company,
          user._id.toString()
        );
      } else {
        result = await getPaginate(filter, page, user.company);
      }
    }
    return {
      status: result.status,
      message: simple ? newArray : result.message,
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected error",
      detail: e,
    };
  }
}

export async function addProduct(
  post: any,
  file: any,
  user: any,
  company: any
) {
  try {
    return await _addProduct(post, file, user, company);
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function updateProduct(product: any, file: any) {
  try {
    if (!product._id) {
      return {
        status: 400,
        message: "No product ID received",
      };
    }
    const result = await _updateProduct(product, file);
    return result;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    return await _deleteProduct(id);
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}
