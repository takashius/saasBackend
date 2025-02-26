"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.User = void 0;
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const commons_1 = __importDefault(require("../../config/commons"));
const mongoose_1 = require("mongoose");
const roleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
});
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please enter your first name."],
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    photo: {
        type: String,
        trim: true,
    },
    banner: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "Enter an email address."],
        validate: [validator_1.default.isEmail, "Enter a valid email address."],
        unique: true,
    },
    role: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Role",
        },
    ],
    bio: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Missing password."],
        minLength: [7, "Your password must contain at least 8 characters"],
    },
    recovery: [
        {
            code: String,
        },
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    companies: [
        {
            company: {
                type: mongoose_1.Schema.ObjectId,
                ref: "Company",
                required: [true, "A valid company is required."],
            },
            selected: {
                type: Boolean,
                default: false,
            },
        },
    ],
    active: {
        type: Boolean,
        default: true,
    },
});
userSchema.pre("save", async function (next) {
    // Hash the password before saving the user model
    const user = this;
    if (user.isModified("password")) {
        user.password = await (0, bcryptjs_1.hash)(user.password, 8);
    }
    next();
});
userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this;
    const objToken = {
        _id: user._id,
        date: new Date(),
    };
    const token = (0, jsonwebtoken_1.sign)(objToken, commons_1.default.JWT_KEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};
userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    if (!validator_1.default.isEmail(email)) {
        throw new Error("Invalid login credentials");
    }
    const user = await User.findOne({ email, active: true })
        .select("-__v")
        .populate("role");
    if (!user) {
        throw new Error("Invalid login credentials");
    }
    const isPasswordMatch = await (0, bcryptjs_1.compare)(password, user.password);
    if (!isPasswordMatch) {
        throw new Error("Invalid login credentials");
    }
    return user;
};
const Role = (0, mongoose_1.model)("Role", roleSchema);
exports.Role = Role;
const User = (0, mongoose_1.model)("User", userSchema);
exports.User = User;
