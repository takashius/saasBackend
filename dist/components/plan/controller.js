"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlan = getPlan;
exports.getPlanes = getPlanes;
exports.getPublicPlanes = getPublicPlanes;
exports.addPlan = addPlan;
exports.updatePlan = updatePlan;
exports.deletePlan = deletePlan;
const store_1 = require("./store");
async function getPlan(planId) {
    try {
        if (!planId) {
            return {
                status: 400,
                message: "No plan ID received",
            };
        }
        const result = await (0, store_1.getPlan)(planId);
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
async function getPlanes(filter, page, simple) {
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
            result = await (0, store_1.getPaginate)(filter, page);
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
async function getPublicPlanes() {
    try {
        const result = await (0, store_1.getPublic)();
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
async function addPlan(plan, user, company) {
    try {
        return await (0, store_1.addPlan)(plan, user, company);
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
async function updatePlan(plan) {
    try {
        if (!plan._id) {
            return {
                status: 400,
                message: "No plan ID received",
            };
        }
        const result = await (0, store_1.updatePlan)(plan);
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
async function deletePlan(id) {
    try {
        return await (0, store_1.deletePlan)(id);
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
