import {
  getCategory as _getCategory,
  getSimple,
  getPublic,
  getPaginate,
  addCategory as _addCategory,
  updateCategory as _updateCategory,
  deleteCategory as _deleteCategory,
} from "./store";

export async function getCategory(categoryId: string) {
  try {
    const result = await _getCategory(categoryId);
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

export async function getCategories(
  filter: string,
  page: number,
  simple: boolean
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
      result = await getPaginate(filter, page);
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

export async function getPublicCategories() {
  try {
    const result = await getPublic();
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

export async function addCategory(category: any, file: any) {
  try {
    return await _addCategory(category, file);
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function updateCategory(category: any, file: any) {
  try {
    if (!category._id) {
      return {
        status: 400,
        message: "No category ID received",
      };
    }
    const result = await _updateCategory(category, file);
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

export async function deleteCategory(id: string) {
  try {
    return await _deleteCategory(id);
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}
