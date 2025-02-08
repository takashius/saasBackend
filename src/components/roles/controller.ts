import {
  getRole as _getRole,
  getSimple,
  getPaginate,
  addRole as _addRole,
  updateRole as _updateRole,
  deleteRole as _deleteRole,
} from "./store";

export async function getRole(roleId: string) {
  try {
    const result = await _getRole(roleId);
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

export async function getRoles(filter: string, page: number, simple: boolean) {
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

export async function addRole(role: any) {
  try {
    return await _addRole(role);
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function updateRole(role: any) {
  try {
    if (!role._id) {
      return {
        status: 400,
        message: "No role ID received",
      };
    }
    const result = await _updateRole(role);
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

export async function deleteRole(id: string) {
  try {
    return await _deleteRole(id);
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}
