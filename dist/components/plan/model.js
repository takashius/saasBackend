"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const planSchema = new mongoose_1.Schema({
    name: {
        type: String,
        unique: true,
    },
    cost: {
        type: Number,
    },
    features: [
        {
            name: {
                type: String,
                trim: true,
            },
            value: String,
        },
    ],
    created: {
        user: {
            type: mongoose_1.Schema.ObjectId,
            ref: "User",
            required: [true, "A valid user is required to create a plan."],
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    active: {
        type: Boolean,
        default: true,
    },
});
const Plan = (0, mongoose_1.model)("Plan", planSchema);
exports.default = Plan;
