"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanies = getCompanies;
exports.getCompany = getCompany;
exports.addCompany = addCompany;
exports.updateCompany = updateCompany;
exports.configCompany = configCompany;
exports.uploadImage = uploadImage;
exports.deleteCompany = deleteCompany;
const store_1 = require("./store");
async function getCompanies() {
    try {
        const result = await (0, store_1.getCompanies)();
        return result;
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
async function getCompany(id) {
    try {
        if (!id) {
            return {
                status: 400,
                message: "Company ID is required",
            };
        }
        const result = await (0, store_1.getCompany)(id);
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
async function addCompany(company, user) {
    try {
        const fullCompany = await (0, store_1.addCompany)(company, user);
        return fullCompany;
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
async function updateCompany(company) {
    try {
        if (!company.id) {
            return {
                status: 400,
                message: "No company ID received",
            };
        }
        const result = await (0, store_1.updateCompany)(company);
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
async function configCompany(company, userCompany, file) {
    try {
        if (!company.id) {
            return {
                status: 400,
                message: "No company ID received",
            };
        }
        if (!userCompany.equals(company.id)) {
            return {
                status: 401,
                message: "You do not have access to the company you are trying to edit",
            };
        }
        const result = await (0, store_1.configCompany)(company, file);
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
async function uploadImage(company, imageType, file) {
    try {
        const result = await (0, store_1.uploadImage)(company, imageType, file);
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
async function deleteCompany(id) {
    try {
        const result = await (0, store_1.deleteCompany)(id);
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
