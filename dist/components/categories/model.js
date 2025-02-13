"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categoriesSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
});
const Categories = (0, mongoose_1.model)("Categories", categoriesSchema);
exports.default = Categories;
