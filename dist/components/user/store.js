"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = getUser;
exports.getUsers = getUsers;
exports.getSimple = getSimple;
exports.getPaginate = getPaginate;
exports.addUser = addUser;
exports.registerUserPublic = registerUserPublic;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.logoutAll = logoutAll;
exports.changePassword = changePassword;
exports.addCompany = addCompany;
exports.removeCompany = removeCompany;
exports.selectCompany = selectCompany;
exports.recoveryStepOne = recoveryStepOne;
exports.recoveryStepTwo = recoveryStepTwo;
exports.uploadImage = uploadImage;
exports.getRoles = getRoles;
exports.updateUserRoles = updateUserRoles;
const model_1 = require("./model");
const model_2 = __importDefault(require("../company/model"));
const commons_1 = __importDefault(require("../../config/commons"));
const saveFile_1 = require("../../middleware/saveFile");
const userParser_1 = require("../../utils/userParser");
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const model_3 = __importDefault(require("../roles/model"));
async function findUser(companyId = null, userId = null) {
    try {
        let filter = {
            active: true,
        };
        if (companyId) {
            filter = {
                active: true,
                "companies.company": companyId,
            };
        }
        let response = null;
        if (userId !== null) {
            filter._id = userId;
            const user = await model_1.User.findOne(filter)
                .select("name lastName photo banner bio address phone date email token companies role")
                .populate({
                path: "companies.company",
                model: "Company",
            })
                .populate("role");
            if (user) {
                response = (0, userParser_1.toUserResponse)(user);
            }
        }
        else {
            const users = await model_1.User.find(filter)
                .select("name lastName photo phone date email")
                .populate("role");
            response = users.map((user) => (0, userParser_1.toUserResponse)(user));
        }
        if (!response) {
            return null;
        }
        return response;
    }
    catch (e) {
        console.log("findUser error", e);
        return null;
    }
}
async function getUser(userId) {
    try {
        const list = await findUser(null, userId);
        if (list) {
            return {
                status: 200,
                message: list,
            };
        }
        else {
            return {
                status: 400,
                message: "User not found",
            };
        }
    }
    catch (e) {
        console.log("getUser Store", e);
        return {
            status: 500,
            message: "Unexpected error",
            detail: e,
        };
    }
}
async function getUsers(companyId) {
    try {
        const list = await findUser(companyId);
        return {
            status: 200,
            message: list,
        };
    }
    catch (e) {
        return {
            status: 500,
            message: "Unexpected error",
            detail: e,
        };
    }
}
async function getSimple() {
    try {
        let query = { active: true };
        let select = "_id name lastName";
        const data = [];
        const result = await model_1.User.find(query).select(select).sort({ name: "asc" });
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
    }
    catch (e) {
        console.log("[ERROR] -> getSimple", e);
        return {
            status: 400,
            message: "Results error",
            detail: e,
        };
    }
}
async function getPaginate(filter, page, companyId) {
    try {
        const limit = 10;
        let query = { active: true };
        const data = [];
        let select = "";
        if (companyId) {
            query = { "companies.company": companyId, active: true };
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
        const result = await model_1.User.find(query)
            .select(select)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({
            name: "asc",
        });
        result.map((item) => {
            data.push({
                _id: item._id,
                fullName: `${item.name} ${item.lastName}`,
                name: item.name,
                lastName: item.lastName,
                phone: item.phone,
                email: item.email,
                photo: item.photo,
                date: (0, moment_1.default)(item.date).format("DD/MM/YYYY HH:mm"),
            });
        });
        const totalUSers = await model_1.User.countDocuments(query);
        const totalPages = Math.ceil(totalUSers / limit);
        const next = () => {
            if (totalPages > page) {
                return page + 1;
            }
            else {
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
    }
    catch (e) {
        console.log("[ERROR] -> getPaginate", e);
        return {
            status: 400,
            message: "Results error",
            detail: e,
        };
    }
}
async function addUser(user, company, file) {
    try {
        if (file)
            user.photo = file.path;
        const myUser = new model_1.User(user);
        const { _id, name, lastName, photo, email, date } = myUser;
        myUser.companies.push({
            company: company._id,
            selected: true,
        });
        const role = await model_1.Role.findOne({ name: "PROV_USER" });
        myUser.role.push(role._id);
        await myUser.save();
        user = { _id, name, lastName, photo, email, date };
        return { status: 201, message: user };
    }
    catch (e) {
        return {
            status: 500,
            message: "User registration error",
            detail: e,
        };
    }
}
async function registerUserPublic(request) {
    try {
        const { name, email, password, companyName, docId } = request;
        const myUser = new model_1.User({ name, email, password });
        const adminUser = await model_1.User.findById(commons_1.default.userAdmin);
        const companyData = {
            name: companyName,
            email: email,
            rif: docId,
            created: {
                user: myUser._id.toString(),
            },
        };
        const myCompany = new model_2.default(companyData);
        try {
            await myCompany.save();
        }
        catch (e) {
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
        const provAdminRole = await model_1.Role.findOne({ name: "PROV_ADMIN" });
        const roleGroup = await model_3.default.findOne({
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
    }
    catch (e) {
        return {
            status: 500,
            message: "User registration error",
            detail: e,
        };
    }
}
async function updateUser(user, file) {
    try {
        const foundUser = await model_1.User.findOne({
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
                (0, saveFile_1.removeImage)(foundUser.photo);
            }
            foundUser.photo = file.path;
        }
        await foundUser.save();
        const { _id, name, lastName, photo, email, date, active } = foundUser;
        user = { _id, name, lastName, photo, email, date, active };
        return { status: 200, message: user };
    }
    catch (e) {
        return {
            status: 500,
            message: "Unexpected store error",
            detail: e,
        };
    }
}
async function deleteUser(id) {
    try {
        const foundUser = await model_1.User.findOne({
            _id: id,
        });
        if (!foundUser) {
            throw new Error("No user found");
        }
        foundUser.active = false;
        foundUser.save();
        return { status: 200, message: "User deleted" };
    }
    catch (e) {
        return {
            status: 500,
            message: "Unexpected store error",
            detail: e,
        };
    }
}
async function loginUser(mail, pass) {
    try {
        const user = await model_1.User.findByCredentials(mail, pass);
        const { _id, name, lastName, photo, email, date } = user;
        const token = await user.generateAuthToken();
        const response = { _id, name, lastName, photo, email, date, token };
        return { status: 200, message: response };
    }
    catch (error) {
        console.log("ERROR STORE LOGIN", error);
        return { status: 401, message: "User or password incorrect" };
    }
}
async function logoutUser(id, tokenUser) {
    const foundUser = await model_1.User.findOne({
        _id: id,
    });
    if (!foundUser) {
        throw new Error("No user found");
    }
    foundUser.tokens = foundUser.tokens.filter((token) => {
        return token.token != tokenUser;
    });
    await foundUser.save();
}
async function logoutAll(id) {
    const foundUser = await model_1.User.findOne({
        _id: id,
    });
    if (!foundUser) {
        throw new Error("No user found");
    }
    foundUser.tokens.splice(0, foundUser.tokens.length);
    await foundUser.save();
}
async function changePassword(user, newPass) {
    try {
        const foundUser = await model_1.User.findOne({
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
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected error",
            detail: e,
        };
    }
}
async function addCompany(userId, company) {
    try {
        const foundUser = await model_1.User.findOne({
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
        const found = foundUser.companies.filter((item) => item.company == company);
        if ((found === null || found === void 0 ? void 0 : found.length) > 0) {
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
    }
    catch (e) {
        console.log(e);
        return {
            status: 400,
            message: "Error adding company",
            detail: e,
        };
    }
}
async function removeCompany(userId, company) {
    try {
        const foundUser = await model_1.User.findOne({
            _id: userId,
            active: true,
        });
        if (!foundUser) {
            throw new Error("No user found");
        }
        foundUser.companies = foundUser.companies.filter((item) => {
            return item.company != company;
        });
        if (foundUser.companies.length === 0) {
            return {
                status: 400,
                message: "You cannot delete the only company associated with the user",
            };
        }
        foundUser.companies = foundUser.companies.map((item) => {
            item.selected = false;
            return item;
        });
        foundUser.companies[0].selected = true;
        await foundUser.save();
        return {
            status: 200,
            message: "Company successfully removed",
        };
    }
    catch (e) {
        console.log(e);
        return {
            status: 400,
            message: "Error removing company",
            detail: e,
        };
    }
}
async function selectCompany(userId, company) {
    try {
        const foundUser = await model_1.User.findOne({
            _id: userId,
            active: true,
        });
        if (!foundUser) {
            throw new Error("No user found");
        }
        const companyInUser = foundUser.companies.find((x) => x.company == company);
        if (!companyInUser) {
            return {
                status: 400,
                message: "The user does not have that company associated",
            };
        }
        foundUser.companies = foundUser.companies.map((item) => {
            if (item.company == company) {
                item.selected = true;
            }
            else {
                item.selected = false;
            }
            return item;
        });
        await foundUser.save();
        return {
            status: 200,
            message: "Company successfully selected",
        };
    }
    catch (e) {
        console.log(e);
        return {
            status: 400,
            message: "Error selecting company",
            detail: e,
        };
    }
}
async function recoveryStepOne(email, code) {
    try {
        const foundUser = await model_1.User.findOne({ email, active: true });
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
    }
    catch (e) {
        console.log("ERROR -> recoveryStepOne ", e);
        return {
            status: false,
            text: "No existe el correo registrado en nuestra base de datos",
        };
    }
}
async function recoveryStepTwo(email, code, newPass) {
    try {
        const foundUser = await model_1.User.findOne({
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
    }
    catch (e) {
        console.log("ERROR -> recoveryStepOne ", e);
        return {
            status: false,
            text: "Codigo incorrecto",
        };
    }
}
async function uploadImage(id, file, type) {
    try {
        const foundUser = await model_1.User.findOne({
            _id: id,
        });
        if (!foundUser) {
            throw new Error("No user found");
        }
        if (type === "photo") {
            if (foundUser.photo) {
                (0, saveFile_1.removeImage)(foundUser.photo);
            }
            foundUser.photo = file.path;
        }
        if (type === "banner") {
            if (foundUser.banner) {
                (0, saveFile_1.removeImage)(foundUser.banner);
            }
            foundUser.banner = file.path;
        }
        await foundUser.save();
        return {
            status: 200,
            message: file,
        };
    }
    catch (e) {
        console.log("[ERROR] -> user -> uploadImage", e);
        return {
            status: 400,
            message: "An error occurred while updating the user image",
            detail: e,
        };
    }
}
async function getRoles() {
    try {
        const list = await model_1.Role.find();
        return {
            status: 200,
            message: list,
        };
    }
    catch (e) {
        return {
            status: 500,
            message: "Unexpected error",
            detail: e,
        };
    }
}
async function updateUserRoles(userId, newRoles) {
    try {
        const user = await model_1.User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const objectIdRoles = newRoles.map((role) => new mongoose_1.default.Types.ObjectId(role));
        user.role = objectIdRoles;
        await user.save();
        return { status: 200, message: "User roles updated successfully" };
    }
    catch (error) {
        return {
            status: 500,
            message: "Unexpected store error",
            detail: error,
        };
    }
}
