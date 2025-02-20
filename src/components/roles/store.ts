import { Role } from "../user/model";
import { RoleResponse } from "../../types/role";
import { StoreResponse } from "../../types/general";
import RoleGroup from "./model";

export async function getRole(id: string) {
  try {
    let query: any = {};
    if (id) {
      query = { _id: id };
    }

    const result = await Role.findOne(query);
    if (!result) {
      return {
        status: 400,
        message: "Role not found",
        detail: {
          name: "custom",
          message: "Role not found",
        },
      };
    }
    return {
      status: 200,
      message: result,
    };
  } catch (e) {
    console.log("[ERROR] -> getRole", e);
    return {
      status: 400,
      message: "Results error",
      detail: e,
    };
  }
}

export async function getSimple() {
  try {
    let query: any = {};
    let select = "id name";

    const result = await Role.find(query).select(select).sort({ name: "asc" });

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

export async function getPaginate(
  filter: string,
  page: number
): Promise<StoreResponse> {
  try {
    const limit = 10;
    let query: any = {};
    let select = "";
    if (filter) {
      query.$or = [
        { name: { $regex: filter, $options: "i" } },
        { description: { $regex: filter, $options: "i" } },
      ];
    }
    select = "id name description";

    const result = await Role.find(query)
      .select(select)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({
        name: "asc",
      });
    const totalRoles = await Role.countDocuments(query);
    const totalPages = Math.ceil(totalRoles / limit);
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
        totalRoles,
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

export async function addRole(role: RoleResponse): Promise<StoreResponse> {
  try {
    const data = new Role({ name: role.name, description: role.description });
    await data.save();
    return { status: 201, message: data };
  } catch (e) {
    return {
      status: 500,
      message: "Role registration error",
      detail: e,
    };
  }
}

export async function updateRole(role: RoleResponse): Promise<StoreResponse> {
  try {
    const foundRole = await Role.findOne({ _id: role._id });
    if (!foundRole) {
      return {
        status: 400,
        message: "Role not found",
        detail: {
          name: "custom",
          message: "Role not found",
        },
      };
    }
    if (role.name) {
      foundRole.name = role.name;
    }
    if (role.description) {
      foundRole.description = role.description;
    }

    await foundRole.save();
    const { name, description } = foundRole;
    const rol = { name, description };
    return { status: 200, message: rol };
  } catch (e) {
    return {
      status: 500,
      message: "Unexpected store error",
      detail: e,
    };
  }
}

export async function deleteRole(id: string): Promise<StoreResponse> {
  try {
    const foundRole = await Role.findOne({ _id: id });

    if (!foundRole) {
      return {
        status: 400,
        message: "Role not found",
        detail: {
          name: "custom",
          message: "Role not found",
        },
      };
    }

    await foundRole.deleteOne({ _id: id });

    return { status: 200, message: "Role deleted" };
  } catch (e) {
    return {
      status: 500,
      message: "Unexpected store error",
      detail: e,
    };
  }
}

export async function createRoleGroup(roleParent: string) {
  try {
    const parentRole = await Role.findOne({ name: roleParent });
    if (!parentRole) {
      return {
        status: 400,
        message: "No parent role found",
        detail: {
          name: "custom",
          message: "roleParent: No parent role found",
        },
      };
    }
    const relatedRoles = await Role.find({
      name: {
        $in: [
          "ROLE_USER_SIMPLE",
          "ROLE_USER_UPLOAD",
          "ROLE_USER_UPLOADBANNER",
          "ROLE_USER_PROFILE",
          "ROLE_USER_ACCOUNT",
          "ROLE_USER_CHANGE_PASSWORD",
          "ROLE_COMPANY_MYCOMPANY",
          "ROLE_ROLE_SIMPLE",
          "ROLE_ROLE_LIST",
          "ROLE_USER_ROLES",
          "ROLE_USER_UPLOADUSERIMAGE",
        ],
      },
    });

    const newRoleGroup = new RoleGroup({
      roleName: parentRole.name,
      roles: relatedRoles.map((role) => role._id),
    });

    await newRoleGroup.save();
    return { status: 201, message: newRoleGroup };
  } catch (e) {
    return {
      status: 500,
      message: "RoleGroup registration error",
      detail: e,
    };
  }
}

export async function addRolesToRoleGroup(
  roleGroupName: string,
  newRoleNames: string[]
) {
  try {
    const roleGroup = await RoleGroup.findOne({
      roleName: roleGroupName,
    }).populate("roles");
    if (!roleGroup) {
      return {
        status: 400,
        message: "RoleGroup not found",
        detail: {
          name: "custom",
          message: "RoleGroup not found",
        },
      };
    }

    const newRoles = await Role.find({ name: { $in: newRoleNames } });

    const existingRoleIds = roleGroup.roles.map((role) => role._id.toString());
    const rolesToAdd = newRoles.filter(
      (role) => !existingRoleIds.includes(role._id.toString())
    );

    roleGroup.roles.push(...rolesToAdd.map((role) => role._id));

    await roleGroup.save();
    return { status: 200, message: roleGroup };
  } catch (e) {
    return {
      status: 500,
      message: "Error adding roles to RoleGroup",
      detail: e,
    };
  }
}

export async function removeRolesFromRoleGroup(
  roleGroupName: string,
  roleNamesToRemove: string[]
) {
  try {
    const roleGroup = await RoleGroup.findOne({
      roleName: roleGroupName,
    }).populate("roles");
    if (!roleGroup) {
      return {
        status: 400,
        message: "RoleGroup not found",
        detail: {
          name: "custom",
          message: "RoleGroup not found",
        },
      };
    }

    const rolesToRemove = await Role.find({ name: { $in: roleNamesToRemove } });
    const roleIdsToRemove = rolesToRemove.map((role) => role._id.toString());

    roleGroup.roles = roleGroup.roles.filter(
      (role) => !roleIdsToRemove.includes(role._id.toString())
    );

    await roleGroup.save();
    return { status: 200, message: rolesToRemove.map((role) => role.name) };
  } catch (e) {
    return {
      status: 500,
      message: "Error removing roles from RoleGroup",
      detail: e,
    };
  }
}

export async function listRoleGroups() {
  try {
    const roleGroups = await RoleGroup.find({}, "roleName");
    return {
      status: 200,
      message: roleGroups,
    };
  } catch (error) {
    return { status: 500, message: "Unexpected store error", detail: error };
  }
}

export async function getRoleGroupById(id: string) {
  try {
    const roleGroup = await RoleGroup.findById(id).populate("roles", "name");
    if (!roleGroup) {
      return {
        status: 400,
        message: "RoleGroup not found",
        detail: {
          name: "custom",
          message: "RoleGroup not found",
        },
      };
    }
    return { status: 200, message: roleGroup };
  } catch (error) {
    return { status: 500, message: "Unexpected store error", detail: error };
  }
}
