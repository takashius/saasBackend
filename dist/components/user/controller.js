"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.updateProfile = updateProfile;
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
exports.registerUserPublic = registerUserPublic;
exports.uploadImage = uploadImage;
exports.updateUserRoles = updateUserRoles;
exports.getRoles = getRoles;
const store_1 = require("./store");
const commons_1 = __importDefault(require("../../config/commons"));
const mailer_1 = require("../../middleware/mailer");
const store_2 = require("../company/store");
const validator = __importStar(require("email-validator"));
async function getUsers(filter, page, simple, user) {
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
            result = await (0, store_1.getSimple)();
            result.message.map((item) => {
                newArray.push({
                    id: item._id,
                    name: item.name,
                });
            });
        }
        else {
            if (user) {
                const roles = user.role;
                if (roles.includes("SUPER_ADMIN")) {
                    result = await (0, store_1.getPaginate)(filter, page);
                }
                else {
                    result = await (0, store_1.getPaginate)(filter, page, user.company);
                }
            }
            else {
                result = await (0, store_1.getPaginate)(filter, page, user.company);
            }
        }
        return {
            status: result.status,
            message: simple ? newArray : result.message,
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
async function getUser(id) {
    try {
        if (!id) {
            return {
                status: 400,
                message: "User ID is required",
            };
        }
        const result = await (0, store_1.getUser)(id);
        const newResult = {
            status: result.status,
            message: {
                _id: result.message._id,
                name: result.message.name,
                lastName: result.message.lastName,
                email: result.message.email,
                date: result.message.date,
                companies: result.message.companies,
                phone: result.message.phone,
                photo: result.message.photo,
                banner: result.message.banner,
                bio: result.message.bio,
                address: result.message.address,
                role: result.message.role,
            },
        };
        if (result.status === 200 && result.message.photo) {
            const photoUrl = result.message.banner
                ? result.message.banner
                : result.message.photo;
            const c_fill = "c_fill,g_auto,h_250,w_970/";
            const gradient = "b_rgb:ffffff,e_gradient_fade,y_-0.50";
            const bannerUrl = photoUrl.replace("https://res.cloudinary.com/erdesarrollo/image/upload", `https://res.cloudinary.com/erdesarrollo/image/upload/${c_fill}`);
            newResult.message.banner = bannerUrl;
        }
        return newResult;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function addUser(user, company, file) {
    try {
        const fullUser = await (0, store_1.addUser)(user, company, file);
        return fullUser;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function updateUser(user, file) {
    try {
        if (!user._id) {
            return {
                status: 400,
                message: "No user ID received",
            };
        }
        const result = await (0, store_1.updateUser)(user, file);
        return result;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function updateProfile(id, user) {
    try {
        user.id = id;
        const result = await (0, store_1.updateUser)(user, null);
        return result;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function deleteUser(id) {
    try {
        const result = await (0, store_1.deleteUser)(id);
        return result;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function loginUser(user) {
    try {
        const { email, password } = user;
        const result = await (0, store_1.loginUser)(email, password);
        return result;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function logoutUser(id, token) {
    try {
        const result = await (0, store_1.logoutUser)(id, token);
        return result;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function logoutAll(id) {
    try {
        const result = await (0, store_1.logoutAll)(id);
        return result;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function changePassword(user, newPass) {
    try {
        if (!user || !newPass) {
            return {
                status: 400,
                message: "User or Password not received",
            };
        }
        return (0, store_1.changePassword)(user, newPass);
    }
    catch (e) {
        return {
            status: 500,
            message: "Unexpected error",
            detail: e,
        };
    }
}
async function addCompany(user, company) {
    try {
        const fullUser = await (0, store_1.addCompany)(user, company);
        return fullUser;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function removeCompany(user, company) {
    try {
        const fullUser = await (0, store_1.removeCompany)(user, company);
        return fullUser;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function selectCompany(user, company) {
    try {
        const fullUser = await (0, store_1.selectCompany)(user, company);
        return fullUser;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function recoveryStepOne(mail) {
    var _a, _b, _c;
    try {
        const min = 100000;
        const max = 999999;
        const code = Math.floor(Math.random() * (max - min + 1) + min);
        const foundUser = await (0, store_1.recoveryStepOne)(mail, code);
        if (!foundUser.status) {
            return {
                status: 400,
                message: "Correo no encontrado",
            };
        }
        const configCrud = await (0, store_2.getCompany)(commons_1.default.companyDefault);
        const configCompany = configCrud.message;
        const message = `
    <p>Ha solicitado restaurar su clave de acceso, copia el siguiente código en la pantalla de la aplicación para reestablecer su contraseña.</br>
    Si usted no solicitó este correo solo debe ignorarlo.</p>
    <p>
      Sus código es el siguiente: </br>
      <center>
        <h1 style="color: #153643; font-family: Arial, sans-serif; font-size: 42px;">${code}</h1>
      </center>
    </p>
    `;
        (0, mailer_1.mailer)(configCompany, mail, `${(_a = foundUser.user) === null || _a === void 0 ? void 0 : _a.name} ${((_b = foundUser.user) === null || _b === void 0 ? void 0 : _b.lastName) ? (_c = foundUser.user) === null || _c === void 0 ? void 0 : _c.lastName : ""}`, "Recuperar contraseña", "Recuperación de clave", message, 2);
        return {
            status: 200,
            message: "Email sent with the generated code",
        };
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function recoveryStepTwo(data) {
    var _a, _b;
    try {
        const foundUser = await (0, store_1.recoveryStepTwo)(data.email, data.code, data.newPass);
        if (!foundUser.status) {
            return {
                status: 400,
                message: "Codigo incorrecto",
            };
        }
        const configCrud = await (0, store_2.getCompany)(commons_1.default.companyDefault);
        const configCompany = configCrud.message;
        const message = `
    <p>Se ha cambiado su contraseña exitosamente.</p>
    `;
        (0, mailer_1.mailer)(configCompany, data.email, `${(_a = foundUser.user) === null || _a === void 0 ? void 0 : _a.name} ${(_b = foundUser.user) === null || _b === void 0 ? void 0 : _b.lastName}`, "Cambio de clave exitoso", "Cambio de clave", message, 2);
        return {
            status: 200,
            message: "Your password has been changed successfully",
        };
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function registerUserPublic(data) {
    try {
        if (!data.email) {
            return { status: 400, message: { email: "Email is required" } };
        }
        const isValid = validator.validate(data.email);
        if (!isValid) {
            return { status: 400, message: { email: "Email is not valid" } };
        }
        if (data.password.length < 8) {
            return {
                status: 400,
                message: {
                    password: "Your password must contain at least 8 characters",
                },
            };
        }
        const user = await (0, store_1.registerUserPublic)(data);
        const userData = user.message;
        const configCrud = await (0, store_2.getCompany)(commons_1.default.companyDefault);
        const configCompany = configCrud.message;
        const message = `
    <p>Se ha registrado de forma exitosa en el sistema, a continuacion sus datos registrados en nuesta App.</p>
    <p>
      <ul>
        <li><strong>Nombre:</strong> ${userData.name}</li>
        <li><strong>Empresa:</strong> ${userData.company}</li>
        <li><strong>Rif:</strong> ${userData.docId}</li>
        <li><strong>Correo:</strong> ${userData.email}</li>
        <li><strong>Clave:</strong> ${userData.clave}</li>
      </ul>
    </p>
    `;
        if (user.status !== 201) {
            return user;
        }
        (0, mailer_1.mailer)(configCompany, userData.email, `${userData.name}`, "Registro Exitoso", "Nuevo registro en el sistema", message, 2);
        return {
            status: 201,
            message: {
                _id: userData._id,
                name: userData.name,
                lastName: userData.lastName,
                email: userData.email,
                date: userData.date,
                token: userData.token,
            },
        };
    }
    catch (e) {
        console.log("Controller -> registerUserPublic", e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function uploadImage(user, file, type) {
    try {
        const result = await (0, store_1.uploadImage)(user, file, type);
        return result;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function updateUserRoles(user, roles) {
    try {
        const fullUser = await (0, store_1.updateUserRoles)(user, roles);
        return fullUser;
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected controller error",
            detail: e,
        };
    }
}
async function getRoles() {
    try {
        const result = await (0, store_1.getRoles)();
        return {
            status: result.status,
            message: result.message,
        };
    }
    catch (e) {
        console.log(e);
        return {
            status: 500,
            message: "Unexpected Controller error",
            detail: e,
        };
    }
}
