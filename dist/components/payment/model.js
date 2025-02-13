"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    amount: {
        type: Number,
    },
    plan: {
        type: mongoose_1.Schema.ObjectId,
        ref: "Plan",
        required: [true, "A valid plan is required to create a payment."],
    },
    company: {
        type: mongoose_1.Schema.ObjectId,
        ref: "Company",
        required: [true, "A valid company is required to create a payment."],
    },
    created: {
        user: {
            type: mongoose_1.Schema.ObjectId,
            ref: "User",
            required: [true, "A valid user is required to create a payment."],
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    expiryDate: {
        type: Date,
    },
    active: {
        type: Boolean,
        default: true,
    },
});
const Payment = (0, mongoose_1.model)("Payment", paymentSchema);
exports.default = Payment;
