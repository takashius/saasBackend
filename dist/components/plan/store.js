"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlan = getPlan;
exports.getSimple = getSimple;
exports.getPublic = getPublic;
exports.getPaginate = getPaginate;
exports.addPlan = addPlan;
exports.updatePlan = updatePlan;
exports.deletePlan = deletePlan;
const model_1 = __importDefault(require("./model"));
async function getPlan(id) {
    try {
        let query = { active: true };
        if (id) {
            query._id = id;
        }
        const result = await model_1.default.findOne(query);
        if (!result) {
            return {
                status: 404,
                message: "No plan found",
            };
        }
        return {
            status: 200,
            message: result,
        };
    }
    catch (e) {
        console.log("[ERROR] -> getPlan", e);
        return {
            status: 400,
            message: "Results error",
            detail: e,
        };
    }
}
async function getSimple() {
    try {
        let query = { active: true };
        let select = "id name";
        const result = await model_1.default.find(query).select(select).sort({ name: "asc" });
        return {
            status: 200,
            message: result,
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
async function getPublic() {
    try {
        let query = { active: true };
        let select = "id name cost";
        const result = await model_1.default.find(query).select(select).sort({ name: "asc" });
        return {
            status: 200,
            message: result,
        };
    }
    catch (e) {
        console.log("[ERROR] -> getPublic", e);
        return {
            status: 400,
            message: "Results error",
            detail: e,
        };
    }
}
async function getPaginate(filter, page) {
    try {
        const limit = 10;
        let query = { active: true };
        let select = "";
        if (filter) {
            query.$or = [
                { name: { $regex: filter, $options: "i" } },
                { cost: { $regex: filter, $options: "i" } },
            ];
        }
        select = "id name cost";
        const result = await model_1.default.find(query)
            .select(select)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({
            name: "asc",
        });
        const totalPlanes = await model_1.default.countDocuments(query);
        const totalPages = Math.ceil(totalPlanes / limit);
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
                results: result,
                totalPlanes,
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
async function addPlan(plan, user, companyId) {
    try {
        const data = new model_1.default({
            name: plan.name,
            cost: plan.cost,
            features: plan.features,
            created: {
                user: user,
            },
            company: companyId,
        });
        await data.save();
        return {
            status: 201,
            message: data,
        };
    }
    catch (e) {
        return {
            status: 500,
            message: "Category registration error",
            detail: e,
        };
    }
}
async function updatePlan(plan) {
    try {
        const foundItem = await model_1.default.findOne({ _id: plan._id });
        if (!foundItem) {
            throw new Error("No plan found");
        }
        if (plan.name) {
            foundItem.name = plan.name;
        }
        if (plan.cost) {
            foundItem.cost = plan.cost;
        }
        if (plan.features) {
            foundItem.features = plan.features;
        }
        await foundItem.save();
        const { _id, name, cost, features } = foundItem;
        const planUpdated = { _id, name, cost, features };
        return { status: 200, message: planUpdated };
    }
    catch (e) {
        return {
            status: 500,
            message: "Unexpected store error",
            detail: e,
        };
    }
}
async function deletePlan(id) {
    try {
        const foundItem = await model_1.default.findOne({
            _id: id,
        });
        if (!foundItem) {
            throw new Error("No Plan found");
        }
        foundItem.active = false;
        foundItem.save();
        return { status: 200, message: "Plan deleted" };
    }
    catch (e) {
        console.log("[ERROR] -> deletePlan", e);
        return {
            status: 400,
            message: "An error occurred while deleting the plan",
            detail: e,
        };
    }
}
