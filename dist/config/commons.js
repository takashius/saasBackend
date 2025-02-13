"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const key = "AimeGabrielaSophia";
//Gw6fpPUVFp3tJ@e
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}
const monDebug = process.env.MONGO_DEBUG === "true" || false;
const dbUrl = process.env.BD_URL;
const config = {
    dbUrl: dbUrl,
    monDebug: monDebug,
    port: process.env.PORT || 8080,
    host: process.env.HOST || "http://localhost",
    JWT_KEY: process.env.JWT_KEY || key,
    publicRoute: process.env.PUBLIC_ROUTE || "/public",
    staticRoute: process.env.PUBLIC_ROUTE || "/static",
    filesRoute: process.env.FILES_ROUTE || "/files",
    dev: process.env.NODE_ENV !== "production",
    companyDefault: process.env.COMPANY_DEFAULT,
    userAdmin: process.env.USER_ADMIN,
    mailer: {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
        secure: process.env.MAILER_SECURE || false,
    },
    cloudinary: {
        CLOUD_NAME: process.env.CLOUD_NAME,
        CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
        CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
        FOLDER_NAME: process.env.FOLDER_NAME,
    },
};
exports.default = config;
