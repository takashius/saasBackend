import { User, Role } from "./model";
import Company from "../company/model";
import Plan from "../plan/model";
import config from "../../config/commons";
import { removeImage } from "../../middleware/saveFile";
import { UserResponse, CompanyResponse, RequestUser } from "../../types/users";
import { StoreResponse } from "../../types/general";
import { toUserResponse } from "../../utils/userParser";
import mongoose, { ObjectId } from "mongoose";
import moment from "moment";
import RoleGroup from "../roles/model";

async function findUser(
  companyId: string | null = null,
  userId: string | null = null
): Promise<UserResponse | UserResponse[] | null> {
  try {
    let filter: any = {
      active: true,
    };
    if (companyId) {
      filter = {
        active: true,
        "companies.company": companyId,
      };
    }

    let response: UserResponse | UserResponse[] | null = null;

    if (userId !== null) {
      filter._id = userId;
      const user = await User.findOne(filter)
        .select(
          "name lastName photo banner bio address phone date email token companies role"
        )
        .populate({
          path: "companies.company",
          model: "Company",
        })
        .populate("role");
      if (user) {
        response = toUserResponse(user);
      }
    } else {
      const users = await User.find(filter)
        .select("name lastName photo phone date email")
        .populate("role");
      response = users.map((user) => toUserResponse(user));
    }
    if (!response) {
      return null;
    }
    return response;
  } catch (e) {
    console.log("findUser error", e);
    return null;
  }
}

export async function getUser(userId: string): Promise<StoreResponse> {
  try {
    const list = await findUser(null, userId);

    if (list) {
      return {
        status: 200,
        message: list,
      };
    } else {
      return {
        status: 400,
        message: "User not found",
      };
    }
  } catch (e) {
    console.log("getUser Store", e);
    return {
      status: 500,
      message: "Unexpected error",
      detail: e,
    };
  }
}

export async function getUsers(companyId: string): Promise<StoreResponse> {
  try {
    const list = await findUser(companyId);
    return {
      status: 200,
      message: list,
    };
  } catch (e) {
    return {
      status: 500,
      message: "Unexpected error",
      detail: e,
    };
  }
}

export async function getSimple() {
  try {
    let query: any = { active: true };
    let select = "_id name lastName";
    const data = [];

    const result = await User.find(query).select(select).sort({ name: "asc" });

    result.map((item) => {
      data.push({
        _id: item._id,
        name: `${item.name} ${item.lastName}`,
      });
    });

    return {
      status: 200,
      message: data,
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
  page: number,
  companyId?: string
): Promise<StoreResponse> {
  try {
    const limit = 10;
    let query: any = { active: true };
    const data = [];
    let select = "";

    if (companyId) {
      query = {
        "companies.company": companyId,
        active: true,
      };
    }

    if (filter) {
      query.$or = [
        { name: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
        { phone: { $regex: filter, $options: "i" } },
        { email: { $regex: filter, $options: "i" } },
      ];
    }
    select = "id name lastName phone email photo date";

    const result = await User.find(query)
      .populate({
        path: "role",
        match: companyId ? { name: { $ne: "SUPER_ADMIN" } } : {},
      })
      .select(select)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({
        name: "asc",
      });

    const filteredResult = result.filter(
      (item) => !companyId || (item.role && item.role.length > 0)
    );

    filteredResult.map((item) => {
      data.push({
        _id: item._id,
        fullName: `${item.name} ${item.lastName}`,
        name: item.name,
        lastName: item.lastName,
        phone: item.phone,
        email: item.email,
        photo: item.photo,
        date: moment(item.date).format("DD/MM/YYYY HH:mm"),
      });
    });

    const totalUSers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUSers / limit);
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
        results: data,
        totalUSers,
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

export async function addUser(
  user: any,
  company: any,
  file: any
): Promise<StoreResponse> {
  try {
    if (file) user.photo = file.path;
    const myUser = new User(user);
    const { _id, name, lastName, photo, email, date } = myUser;
    myUser.companies.push({
      company: company._id,
      selected: true,
    });
    const role = await Role.findOne({ name: "PROV_USER" });
    myUser.role.push(role._id);
    await myUser.save();
    user = { _id, name, lastName, photo, email, date };
    return { status: 201, message: user };
  } catch (e) {
    return {
      status: 500,
      message: "User registration error",
      detail: e,
    };
  }
}

export async function registerUserPublic(
  request: RequestUser
): Promise<StoreResponse> {
  try {
    const { name, email, password, companyName, docId } = request;
    const myUser = new User({ name, email, password });
    const plan = await Plan.findOne({ name: "Free" });
    const adminUser = await User.findById(config.userAdmin);
    const companyData: CompanyResponse = {
      name: companyName,
      email: email,
      rif: docId,
      created: {
        user: myUser._id.toString(),
      },
      currentPlan: {
        plan: plan._id,
      },
    };
    const myCompany = new Company(companyData);

    try {
      await myCompany.save();
    } catch (e) {
      return {
        status: 500,
        message: "User registration error",
        detail: e,
      };
    }
    const token = await myUser.generateAuthToken();
    myUser.companies.push({
      company: myCompany._id.toString(),
      selected: true,
    });

    const provAdminRole = await Role.findOne({ name: "PROV_ADMIN" });
    const roleGroup = await RoleGroup.findOne({
      roleName: "PROV_ADMIN",
    }).populate("roles");

    myUser.role.push(provAdminRole._id);
    roleGroup.roles.forEach((role) => {
      myUser.role.push(role._id);
    });

    await myUser.save();
    if (adminUser) {
      adminUser.companies.push({
        company: myCompany._id.toString(),
        selected: true,
      });
      await adminUser.save();
    }
    const response = {
      _id: myUser._id,
      name,
      clave: password,
      docId,
      password,
      email,
      date: myUser.date,
      token,
      company: companyName,
    };
    return { status: 201, message: response };
  } catch (e) {
    return {
      status: 500,
      message: "User registration error",
      detail: e,
    };
  }
}

export async function updateUser(user: any, file: any): Promise<StoreResponse> {
  try {
    const foundUser = await User.findOne({
      _id: user._id,
    });
    if (!foundUser) {
      throw new Error("No user found");
    }
    if (user.name) {
      foundUser.name = user.name;
    }
    if (user.lastName) {
      foundUser.lastName = user.lastName;
    }
    if (user.phone) {
      foundUser.phone = user.phone;
    }
    if (user.bio) {
      foundUser.bio = user.bio;
    }
    if (user.address) {
      foundUser.address = user.address;
    }
    if (user.password) {
      foundUser.password = user.password;
    }
    if (user.role) {
      foundUser.role = user.role;
    }

    if (file) {
      if (foundUser.photo) {
        removeImage(foundUser.photo);
      }
      foundUser.photo = file.path;
    }

    await foundUser.save();
    const { _id, name, lastName, photo, email, date, active } = foundUser;
    user = { _id, name, lastName, photo, email, date, active };
    return { status: 200, message: user };
  } catch (e) {
    return {
      status: 500,
      message: "Unexpected store error",
      detail: e,
    };
  }
}

export async function deleteUser(id: string): Promise<StoreResponse> {
  try {
    const foundUser = await User.findOne({
      _id: id,
    });

    if (!foundUser) {
      throw new Error("No user found");
    }
    foundUser.active = false;
    foundUser.save();

    return { status: 200, message: "User deleted" };
  } catch (e) {
    return {
      status: 500,
      message: "Unexpected store error",
      detail: e,
    };
  }
}

export async function loginUser(
  mail: string,
  pass: string
): Promise<StoreResponse> {
  try {
    const user = await User.findByCredentials(mail, pass);
    const { _id, name, lastName, photo, email, date, role } = user;
    const token = await user.generateAuthToken();
    const response = { _id, name, lastName, photo, email, date, role, token };
    return { status: 200, message: response };
  } catch (error) {
    console.log("ERROR STORE LOGIN", error);
    return { status: 401, message: "User or password incorrect" };
  }
}

export async function logoutUser(id: string, tokenUser: string): Promise<void> {
  const foundUser = await User.findOne({
    _id: id,
  });
  if (!foundUser) {
    throw new Error("No user found");
  }
  foundUser.tokens = foundUser.tokens.filter((token: any) => {
    return token.token != tokenUser;
  });
  await foundUser.save();
}

export async function logoutAll(id: string) {
  const foundUser = await User.findOne({
    _id: id,
  });
  if (!foundUser) {
    throw new Error("No user found");
  }
  foundUser.tokens.splice(0, foundUser.tokens.length);
  await foundUser.save();
}

export async function changePassword(
  user: any,
  newPass: string
): Promise<StoreResponse> {
  try {
    const foundUser = await User.findOne({
      email: user.email,
      active: true,
    });
    if (!foundUser) {
      throw new Error("No user found");
    }
    foundUser.password = newPass;
    let error = false;
    await foundUser.save().catch(function (err) {
      error = err;
    });
    if (error) {
      return {
        status: 500,
        message: "Unexpected error",
        detail: error,
      };
    }
    return {
      status: 200,
      message: "Password changed successfully",
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

export async function addCompany(
  userId: string,
  company: string
): Promise<StoreResponse> {
  try {
    const foundUser = await User.findOne({
      _id: userId,
      active: true,
    });
    if (!foundUser) {
      throw new Error("No user found");
    }

    let selected = false;
    if (foundUser.companies.length === 0) {
      selected = true;
    }
    const found = foundUser.companies.filter(
      (item: any) => item.company == company
    );

    if (found?.length > 0) {
      return {
        status: 400,
        message: "The company is already associated with this user",
      };
    }
    foundUser.companies.push({ company: company, selected });
    await foundUser.save();

    return {
      status: 200,
      message: "Company successfully added",
    };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      message: "Error adding company",
      detail: e,
    };
  }
}

export async function removeCompany(
  userId: string,
  company: string
): Promise<StoreResponse> {
  try {
    const foundUser = await User.findOne({
      _id: userId,
      active: true,
    });

    if (!foundUser) {
      throw new Error("No user found");
    }

    foundUser.companies = foundUser.companies.filter((item: any) => {
      return item.company != company;
    });

    if (foundUser.companies.length === 0) {
      return {
        status: 400,
        message: "You cannot delete the only company associated with the user",
      };
    }
    foundUser.companies = foundUser.companies.map((item: any) => {
      item.selected = false;
      return item;
    });
    foundUser.companies[0].selected = true;
    await foundUser.save();

    return {
      status: 200,
      message: "Company successfully removed",
    };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      message: "Error removing company",
      detail: e,
    };
  }
}

export async function selectCompany(
  userId: ObjectId,
  company: string
): Promise<StoreResponse> {
  try {
    const foundUser = await User.findOne({
      _id: userId,
      active: true,
    });

    if (!foundUser) {
      throw new Error("No user found");
    }

    const companyInUser = foundUser.companies.find(
      (x: any) => x.company == company
    );
    if (!companyInUser) {
      return {
        status: 400,
        message: "The user does not have that company associated",
      };
    }

    foundUser.companies = foundUser.companies.map((item: any) => {
      if (item.company == company) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      return item;
    });

    await foundUser.save();

    return {
      status: 200,
      message: "Company successfully selected",
    };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      message: "Error selecting company",
      detail: e,
    };
  }
}

export async function recoveryStepOne(
  email: string,
  code: number
): Promise<{ status: boolean; user?: UserResponse; text?: string }> {
  try {
    const foundUser = await User.findOne({ email, active: true });
    if (!foundUser) {
      return { status: false };
    }

    if (!foundUser) {
      throw new Error("No user found");
    }
    foundUser.recovery = foundUser.recovery.concat({ code: `${code}` });
    await foundUser.save();
    return {
      status: true,
      user: foundUser,
    };
  } catch (e) {
    console.log("ERROR -> recoveryStepOne ", e);
    return {
      status: false,
      text: "No existe el correo registrado en nuestra base de datos",
    };
  }
}

export async function recoveryStepTwo(
  email: string,
  code: string,
  newPass: string
): Promise<{ status: boolean; user?: UserResponse; text?: string }> {
  try {
    const foundUser = await User.findOne({
      email,
      "recovery.code": code,
      active: true,
    });
    if (!foundUser) {
      return { status: false };
    }
    foundUser.password = newPass;
    foundUser.recovery.splice(0, foundUser.recovery.length);
    await foundUser.save();
    return {
      status: true,
      user: foundUser,
    };
  } catch (e) {
    console.log("ERROR -> recoveryStepOne ", e);
    return {
      status: false,
      text: "Codigo incorrecto",
    };
  }
}

export async function uploadImage(
  id: string,
  file: any,
  type: string
): Promise<StoreResponse> {
  try {
    const foundUser = await User.findOne({
      _id: id,
    });

    if (!foundUser) {
      throw new Error("No user found");
    }

    if (type === "photo") {
      if (foundUser.photo) {
        removeImage(foundUser.photo);
      }
      foundUser.photo = file.path;
    }
    if (type === "banner") {
      if (foundUser.banner) {
        removeImage(foundUser.banner);
      }
      foundUser.banner = file.path;
    }
    await foundUser.save();
    return {
      status: 200,
      message: file,
    };
  } catch (e) {
    console.log("[ERROR] -> user -> uploadImage", e);
    return {
      status: 400,
      message: "An error occurred while updating the user image",
      detail: e,
    };
  }
}

export async function getRoles(): Promise<StoreResponse> {
  try {
    const list = await Role.find();
    return {
      status: 200,
      message: list,
    };
  } catch (e) {
    return {
      status: 500,
      message: "Unexpected error",
      detail: e,
    };
  }
}

export async function updateUserRoles(
  userId: string,
  newRoles: string[]
): Promise<StoreResponse> {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const objectIdRoles = newRoles.map(
      (role) => new mongoose.Types.ObjectId(role)
    );

    user.role = objectIdRoles;

    await user.save();
    return { status: 200, message: "User roles updated successfully" };
  } catch (error) {
    return {
      status: 500,
      message: "Unexpected store error",
      detail: error,
    };
  }
}
