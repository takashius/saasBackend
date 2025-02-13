"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const commons_1 = __importDefault(require("../config/commons"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
cloudinary_1.v2.config({
    cloud_name: commons_1.default.cloudinary.CLOUD_NAME,
    api_key: commons_1.default.cloudinary.CLOUDINARY_KEY,
    api_secret: commons_1.default.cloudinary.CLOUDINARY_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: commons_1.default.cloudinary.FOLDER_NAME,
        allowedFormats: ["jpeg", "png", "jpg", "gif"],
        public_id: (req, file) => file.filename,
    },
});
const upload = (0, multer_1.default)({ storage });
exports.upload = upload;
const removeImage = (urlImage) => {
    if (urlImage) {
        const url = urlImage.split("/");
        const image = url[url.length - 1].split(".");
        cloudinary_1.v2.uploader
            .destroy(commons_1.default.cloudinary.FOLDER_NAME + "/" + image[0])
            .then(() => true)
            .catch(() => false);
    }
};
exports.removeImage = removeImage;
