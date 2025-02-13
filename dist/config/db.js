"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commons_1 = __importDefault(require("./commons"));
(0, mongoose_1.set)("debug", commons_1.default.monDebug);
async function connect(url) {
    try {
        await (0, mongoose_1.connect)(url, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        console.log("[db] Connection successful", url);
    }
    catch (err) {
        console.error(`DB Connection Error: ${err.message}`);
    }
}
exports.default = connect;
