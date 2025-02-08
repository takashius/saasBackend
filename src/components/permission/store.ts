import Permission from "./model";
import { StoreResponse } from "../../types/general";

export async function getPermission(id: string): Promise<StoreResponse> {
  try {
    let query: any = {};
    if (id) {
      query = { _id: id };
    }

    const result = await Permission.findOne(query);
    if (!result) {
      return {
        status: 404,
        message: "No permission found",
      };
    }
    return {
      status: 200,
      message: result,
    };
  } catch (e) {
    console.log("[ERROR] -> getPermission", e);
    return {
      status: 400,
      message: "Results error",
      detail: e,
    };
  }
}

export async function getPermissions(
  searchParams: any
): Promise<StoreResponse> {
  try {
    const searchValue = searchParams ? searchParams.toLowerCase() : "";
    const query = {
      $or: [
        { title: { $regex: searchValue, $options: "i" } },
        { route: { $regex: searchValue, $options: "i" } },
        { module: { $regex: searchValue, $options: "i" } },
        { method: { $regex: searchValue, $options: "i" } },
      ],
    };

    const result = await Permission.find(query);

    const groupedByModule = result.reduce((acc, permission) => {
      const moduleName = permission.module;
      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }
      acc[moduleName].push(permission);
      return acc;
    }, {});

    const permissions = Object.keys(groupedByModule).map((moduleName) => ({
      module: {
        name: moduleName,
        permissions: groupedByModule[moduleName],
      },
    }));

    return {
      status: 200,
      message: permissions,
    };
  } catch (e) {
    console.log("[ERROR] -> getPermissions", e);
    return {
      status: 400,
      message: "Results error",
      detail: e,
    };
  }
}

export async function addPermission(data: any): Promise<StoreResponse> {
  try {
    const companyData = {
      title: data.title,
      route: data.route,
      module: data.module,
      method: data.method,
      roles: data.roles,
    };

    const permission = new Permission(companyData);
    const result = await permission.save();
    return {
      status: 201,
      message: result,
    };
  } catch (e) {
    console.log("[ERROR] -> addPermission", e);
    return {
      status: 400,
      message: "An error occurred while creating the permission",
      detail: e,
    };
  }
}

export async function updatePermission(
  id: string,
  updateData: any
): Promise<StoreResponse> {
  try {
    const permission = await Permission.findById(id);
    if (!permission) {
      return {
        status: 404,
        message: "Permission not found",
      };
    }

    Object.keys(updateData).forEach((key) => {
      permission[key] = updateData[key];
    });

    await permission.save();

    return {
      status: 200,
      message: "Permission updated successfully",
    };
  } catch (e) {
    console.log("[ERROR] -> updatePermission", e);
    return {
      status: 400,
      message: "Update error",
      detail: e,
    };
  }
}

export async function deletePermission(id: string): Promise<StoreResponse> {
  try {
    const foundItem = await Permission.findOne({
      _id: id,
    });
    if (!foundItem) {
      return {
        status: 404,
        message: "No permission found",
      };
    }
    await foundItem.deleteOne();

    return { status: 200, message: "Permission deleted" };
  } catch (e) {
    console.log("[ERROR] -> deletePermission", e);
    return {
      status: 400,
      message: "An error occurred while deleting the Permission",
      detail: e,
    };
  }
}
