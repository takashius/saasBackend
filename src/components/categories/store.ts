import Categories from "./model";
import { RoleResponse } from "../../types/role";
import { StoreResponse } from "../../types/general";
import { removeImage } from "../../middleware/saveFile";

export async function getCategory(id: string) {
  try {
    let query: any = { active: true };
    if (id) {
      query._id = id;
    }

    const result = await Categories.findOne(query);
    if (!result) {
      return {
        status: 404,
        message: "No Category found",
      };
    }

    return {
      status: 200,
      message: result,
    };
  } catch (e) {
    console.log("[ERROR] -> getCategory", e);
    return {
      status: 400,
      message: "Results error",
      detail: e,
    };
  }
}

export async function getSimple() {
  try {
    let query: any = { active: true };
    let select = "id name";

    const result = await Categories.find(query)
      .select(select)
      .sort({ name: "asc" });

    return {
      status: 200,
      message: result,
    };
  } catch (e) {
    console.log("[ERROR] -> getSimple", e);
    return {
      status: 400,
      message: "Results error",
      detail: e,
    };
  }
}

export async function getPublic() {
  try {
    let query: any = { active: true };
    let select = "id name image";

    const result = await Categories.find(query)
      .select(select)
      .sort({ name: "asc" });

    return {
      status: 200,
      message: result,
    };
  } catch (e) {
    console.log("[ERROR] -> getPublic", e);
    return {
      status: 400,
      message: "Results error",
      detail: e,
    };
  }
}

export async function getPaginate(
  filter: string,
  page: number
): Promise<StoreResponse> {
  try {
    const limit = 10;
    let query: any = { active: true };
    let select = "";
    if (filter) {
      query.$or = [
        { name: { $regex: filter, $options: "i" } },
        { description: { $regex: filter, $options: "i" } },
      ];
    }
    select = "id name description image";

    const result = await Categories.find(query)
      .select(select)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({
        name: "asc",
      });
    const totalCategories = await Categories.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / limit);
    const next = () => {
      if (totalPages > page) {
        return page + 1;
      } else {
        return null;
      }
    };

    return {
      status: 200,
      message: {
        results: result,
        totalCategories,
        totalPages,
        currentPage: page,
        next: next(),
      },
    };
  } catch (e) {
    console.log("[ERROR] -> getPaginate", e);
    return {
      status: 400,
      message: "Results error",
      detail: e,
    };
  }
}

export async function addCategory(
  category: RoleResponse,
  file: any
): Promise<StoreResponse> {
  try {
    const data = new Categories({
      name: category.name,
      description: category.description,
      image: file?.path ? file.path : "",
    });
    await data.save();
    return {
      status: 201,
      message: {
        _id: data.id,
        name: data.name,
        description: data.description,
        image: data.image,
      },
    };
  } catch (e) {
    return {
      status: 500,
      message: "Category registration error",
      detail: e,
    };
  }
}

export async function updateCategory(
  category: RoleResponse,
  file: any
): Promise<StoreResponse> {
  try {
    const foundCategory = await Categories.findOne({ _id: category._id });
    if (!foundCategory) {
      throw new Error("No category found");
    }
    if (category.name) {
      foundCategory.name = category.name;
    }
    if (category.description) {
      foundCategory.description = category.description;
    }
    if (file) {
      if (foundCategory.image) {
        removeImage(foundCategory.image);
      }
      foundCategory.image = file.path;
    }

    await foundCategory.save();
    const { _id, name, description, image } = foundCategory;
    const rol = { _id, name, description, image };
    return { status: 200, message: rol };
  } catch (e) {
    return {
      status: 500,
      message: "Unexpected store error",
      detail: e,
    };
  }
}

export async function deleteCategory(id: string): Promise<StoreResponse> {
  try {
    const foundCategory = await Categories.findOne({
      _id: id,
    });
    if (!foundCategory) {
      throw new Error("No Category found");
    }
    foundCategory.active = false;
    foundCategory.save();

    return { status: 200, message: "Category deleted" };
  } catch (e) {
    console.log("[ERROR] -> deleteCategory", e);
    return {
      status: 400,
      message: "An error occurred while deleting the category",
      detail: e,
    };
  }
}
