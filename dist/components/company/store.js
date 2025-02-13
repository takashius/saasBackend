"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompany = getCompany;
exports.getCompanies = getCompanies;
exports.addCompany = addCompany;
exports.updateCompany = updateCompany;
exports.configCompany = configCompany;
exports.uploadImage = uploadImage;
exports.deleteCompany = deleteCompany;
exports.incrementCorrelative = incrementCorrelative;
exports.getManageCorrelatives = getManageCorrelatives;
const model_1 = __importDefault(require("./model"));
const model_2 = __importDefault(require("../plan/model"));
const saveFile_1 = require("../../middleware/saveFile");
async function getCompany(id) {
    try {
        let query = { active: true };
        if (id) {
            query = { _id: id };
        }
        const result = await model_1.default.findOne(query).populate({
            path: "created.user",
            select: ["name", "lastName"],
            model: "User",
        });
        return {
            status: 200,
            message: result,
        };
    }
    catch (e) {
        console.log("[ERROR] -> getCompany", e);
        return {
            status: 400,
            message: "Results error",
            detail: e,
        };
    }
}
async function getCompanies() {
    try {
        const query = { active: true };
        const result = await model_1.default.find(query).populate({
            path: "created.user",
            select: ["name", "lastName"],
            model: "User",
        });
        return {
            status: 200,
            message: result,
        };
    }
    catch (e) {
        console.log("[ERROR] -> getCompanies", e);
        return {
            status: 400,
            message: "Results error",
            detail: e,
        };
    }
}
async function addCompany(data, user) {
    try {
        const companyData = {
            name: data.name,
            description: data.description,
            email: data.email,
            phone: data.phone,
            rif: data.rif,
            address: data.address,
            logo: data.logo,
            logoAlpha: data.logoAlpha,
            created: {
                user: user,
            },
        };
        const company = new model_1.default(companyData);
        const plan = await model_2.default.findOne({ name: "Free" });
        if (!plan) {
            throw new Error("Plan not found");
        }
        const registrationDate = new Date();
        const expiryDate = new Date(registrationDate);
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        if (expiryDate.getDate() !== registrationDate.getDate()) {
            expiryDate.setDate(0);
        }
        company.currentPlan = {
            plan: plan._id,
            registrationDate,
            expiryDate,
        };
        const result = await company.save();
        return {
            status: 201,
            message: result,
        };
    }
    catch (e) {
        console.log("[ERROR] -> addCompany", e);
        return {
            status: 400,
            message: "An error occurred while creating the company",
            detail: e,
        };
    }
}
async function updateCompany(data) {
    try {
        const foundCompany = await model_1.default.findOne({
            _id: data.id,
        });
        if (!foundCompany) {
            throw new Error("No Company found");
        }
        if (data.name) {
            foundCompany.name = data.name;
        }
        if (data.description) {
            foundCompany.description = data.description;
        }
        if (data.email) {
            foundCompany.email = data.email;
        }
        if (data.phone) {
            foundCompany.phone = data.phone;
        }
        if (data.rif) {
            foundCompany.rif = data.rif;
        }
        if (data.address) {
            foundCompany.address = data.address;
        }
        if (data.logo) {
            foundCompany.logo = data.logo;
        }
        if (data.logoAlpha) {
            foundCompany.logoAlpha = data.logoAlpha;
        }
        await foundCompany.save();
        return {
            status: 200,
            message: "Company updated successfully",
        };
    }
    catch (e) {
        console.log("[ERROR] -> updateCompany", e);
        return {
            status: 400,
            message: "An error occurred while updating the company",
            detail: e,
        };
    }
}
async function configCompany(data, file) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21;
    try {
        const foundCompany = await model_1.default.findOne({
            _id: data.id,
        });
        if (!foundCompany) {
            throw new Error("No Company found");
        }
        if (data.iva) {
            foundCompany.iva = data.iva;
        }
        if (data.address) {
            foundCompany.address = data.address;
        }
        if (data.description) {
            foundCompany.description = data.description;
        }
        if (data.phone) {
            foundCompany.phone = data.phone;
        }
        if (data.rif) {
            foundCompany.rif = data.rif;
        }
        if (data.imageType) {
            switch (data.imageType) {
                case "logo":
                    (0, saveFile_1.removeImage)(foundCompany.logo);
                    foundCompany.logo = file.path;
                    break;
                case "logoAlpha":
                    (0, saveFile_1.removeImage)(foundCompany.logoAlpha);
                    foundCompany.logoAlpha = file.path;
                    break;
                case "banner":
                    (0, saveFile_1.removeImage)(foundCompany.banner);
                    foundCompany.banner = file.path;
                    break;
            }
        }
        if (data.currencySymbol) {
            foundCompany.currencySymbol = data.currencySymbol;
        }
        if (foundCompany.configMail) {
            if (foundCompany.configMail.colors) {
                if ((_b = (_a = data.configMail) === null || _a === void 0 ? void 0 : _a.colors) === null || _b === void 0 ? void 0 : _b.primary) {
                    foundCompany.configMail.colors.primary =
                        (_d = (_c = data.configMail) === null || _c === void 0 ? void 0 : _c.colors) === null || _d === void 0 ? void 0 : _d.primary;
                }
                if ((_f = (_e = data.configMail) === null || _e === void 0 ? void 0 : _e.colors) === null || _f === void 0 ? void 0 : _f.secondary) {
                    foundCompany.configMail.colors.secondary =
                        (_h = (_g = data.configMail) === null || _g === void 0 ? void 0 : _g.colors) === null || _h === void 0 ? void 0 : _h.secondary;
                }
                if ((_k = (_j = data.configMail) === null || _j === void 0 ? void 0 : _j.colors) === null || _k === void 0 ? void 0 : _k.background) {
                    foundCompany.configMail.colors.background =
                        (_m = (_l = data.configMail) === null || _l === void 0 ? void 0 : _l.colors) === null || _m === void 0 ? void 0 : _m.background;
                }
                if ((_p = (_o = data.configMail) === null || _o === void 0 ? void 0 : _o.colors) === null || _p === void 0 ? void 0 : _p.title) {
                    foundCompany.configMail.colors.title = (_r = (_q = data.configMail) === null || _q === void 0 ? void 0 : _q.colors) === null || _r === void 0 ? void 0 : _r.title;
                }
                if ((_s = data.configMail) === null || _s === void 0 ? void 0 : _s.textBody) {
                    foundCompany.configMail.textBody = (_t = data.configMail) === null || _t === void 0 ? void 0 : _t.textBody;
                }
            }
        }
        if (foundCompany.configPdf) {
            if (foundCompany.configPdf.logo) {
                if ((_v = (_u = data.pdf) === null || _u === void 0 ? void 0 : _u.logo) === null || _v === void 0 ? void 0 : _v.x) {
                    foundCompany.configPdf.logo.x = (_x = (_w = data.pdf) === null || _w === void 0 ? void 0 : _w.logo) === null || _x === void 0 ? void 0 : _x.x;
                }
                if ((_z = (_y = data.pdf) === null || _y === void 0 ? void 0 : _y.logo) === null || _z === void 0 ? void 0 : _z.y) {
                    foundCompany.configPdf.logo.y = (_1 = (_0 = data.pdf) === null || _0 === void 0 ? void 0 : _0.logo) === null || _1 === void 0 ? void 0 : _1.y;
                }
                if ((_3 = (_2 = data.pdf) === null || _2 === void 0 ? void 0 : _2.logo) === null || _3 === void 0 ? void 0 : _3.width) {
                    foundCompany.configPdf.logo.width = (_5 = (_4 = data.pdf) === null || _4 === void 0 ? void 0 : _4.logo) === null || _5 === void 0 ? void 0 : _5.width;
                }
            }
            if (foundCompany.configPdf.logoAlpha) {
                if ((_7 = (_6 = data.pdf) === null || _6 === void 0 ? void 0 : _6.logoAlpha) === null || _7 === void 0 ? void 0 : _7.x) {
                    foundCompany.configPdf.logoAlpha.x = (_9 = (_8 = data.pdf) === null || _8 === void 0 ? void 0 : _8.logoAlpha) === null || _9 === void 0 ? void 0 : _9.x;
                }
                if ((_11 = (_10 = data.pdf) === null || _10 === void 0 ? void 0 : _10.logoAlpha) === null || _11 === void 0 ? void 0 : _11.y) {
                    foundCompany.configPdf.logoAlpha.y = (_13 = (_12 = data.pdf) === null || _12 === void 0 ? void 0 : _12.logoAlpha) === null || _13 === void 0 ? void 0 : _13.y;
                }
                if ((_15 = (_14 = data.pdf) === null || _14 === void 0 ? void 0 : _14.logoAlpha) === null || _15 === void 0 ? void 0 : _15.width) {
                    foundCompany.configPdf.logoAlpha.width = (_17 = (_16 = data.pdf) === null || _16 === void 0 ? void 0 : _16.logoAlpha) === null || _17 === void 0 ? void 0 : _17.width;
                }
            }
        }
        if (foundCompany.correlatives) {
            if (((_18 = data.correlatives) === null || _18 === void 0 ? void 0 : _18.manageInvoiceCorrelative) !== undefined) {
                foundCompany.correlatives.manageInvoiceCorrelative =
                    (_19 = data.correlatives) === null || _19 === void 0 ? void 0 : _19.manageInvoiceCorrelative;
            }
            if ((_20 = data.correlatives) === null || _20 === void 0 ? void 0 : _20.invoice) {
                foundCompany.correlatives.invoice = (_21 = data.correlatives) === null || _21 === void 0 ? void 0 : _21.invoice;
            }
        }
        await foundCompany.save();
        return {
            status: 200,
            message: "Config updated successfully",
        };
    }
    catch (e) {
        console.log("[ERROR] -> configCompany", e);
        return {
            status: 400,
            message: "An error occurred while updating the company",
            detail: e,
        };
    }
}
async function uploadImage(id, imageType, file) {
    try {
        const foundCompany = await model_1.default.findOne({
            _id: id,
        });
        if (!foundCompany) {
            throw new Error("No Company found");
        }
        switch (imageType) {
            case "logo":
                (0, saveFile_1.removeImage)(foundCompany.logo);
                foundCompany.logo = file.path;
                break;
            case "logoAlpha":
                (0, saveFile_1.removeImage)(foundCompany.logoAlpha);
                foundCompany.logoAlpha = file.path;
                break;
            case "banner":
                (0, saveFile_1.removeImage)(foundCompany.banner);
                foundCompany.banner = file.path;
                break;
        }
        await foundCompany.save();
        return {
            status: 200,
            message: file,
        };
    }
    catch (e) {
        console.log("[ERROR] -> uploadImage", e);
        return {
            status: 400,
            message: "An error occurred while updating the company",
            detail: e,
        };
    }
}
async function deleteCompany(id) {
    try {
        const foundCompany = await model_1.default.findOne({
            _id: id,
        });
        if (!foundCompany) {
            throw new Error("No Company found");
        }
        foundCompany.active = false;
        foundCompany.save();
        return { status: 200, message: "Company deleted" };
    }
    catch (e) {
        console.log("[ERROR] -> deleteCompany", e);
        return {
            status: 400,
            message: "An error occurred while deleting the company",
            detail: e,
        };
    }
}
async function incrementCorrelative(company) {
    var _a;
    try {
        const foundCompany = await model_1.default.findOne(company);
        if (!foundCompany) {
            throw new Error("No Company found");
        }
        let newNumber = 1;
        if ((_a = foundCompany.correlatives) === null || _a === void 0 ? void 0 : _a.invoice) {
            newNumber = foundCompany.correlatives.invoice + 1;
        }
        if (foundCompany.correlatives)
            foundCompany.correlatives.invoice = newNumber;
        await foundCompany.save();
        return newNumber;
    }
    catch (e) {
        console.log(e);
        return 0;
    }
}
async function getManageCorrelatives(company) {
    try {
        const foundCompany = await model_1.default.findOne(company);
        if (!foundCompany) {
            throw new Error("No Company found");
        }
        return (foundCompany.correlatives &&
            foundCompany.correlatives.manageInvoiceCorrelative);
    }
    catch (error) {
        console.log(error);
        return true;
    }
}
