import {
  getPermission as _getPermission,
  getPermissions as _getPermissions,
  addPermission as _addPermission,
  updatePermission as _updatePermission,
  deletePermission as _deletePermission,
} from "./store";

export async function getPermission(permissionId: string) {
  try {
    if (!permissionId) {
      return {
        status: 400,
        message: "No permission ID received",
      };
    }
    const result = await _getPermission(permissionId);
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

export async function getPermissions(searchParams: any) {
  try {
    const result = await _getPermissions(searchParams);
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

export async function addPermission(permission: any) {
  try {
    return await _addPermission(permission);
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function updatePermission(permission: any) {
  try {
    if (!permission._id) {
      return {
        status: 400,
        message: "No permission ID received",
      };
    }
    const result = await _updatePermission(permission._id, permission);
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

export async function deletePermission(id: string) {
  try {
    if (!id) {
      return {
        status: 400,
        message: "No permission ID received",
      };
    }
    return await _deletePermission(id);
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}
