"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roleGroupSchema = new mongoose_1.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
    },
    roles: [
        {
            type: mongoose_1.Schema.ObjectId,
            ref: "Role",
        },
    ],
});
const RoleGroup = (0, mongoose_1.model)("RoleGroup", roleGroupSchema);
exports.default = RoleGroup;
