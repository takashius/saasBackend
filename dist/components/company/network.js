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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const controller_1 = require("./controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const controllerError_1 = __importDefault(require("../../middleware/controllerError"));
const router = express.Router();
const saveFile_1 = require("../../middleware/saveFile");
const cloudinary_1 = require("cloudinary");
const commons_1 = __importDefault(require("../../config/commons"));
const moduleName = "company";
router.get("/", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.getCompanies)()
        .then((list) => {
        switch (list.status) {
            case 200:
                res.status(200).send(list.message);
                break;
            default:
                res.status(list.status).send(list.message);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.get("/myCompany", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.getCompany)(req.user.company.toString())
        .then((data) => {
        switch (data.status) {
            case 200:
                res.status(200).send(data.message);
                break;
            default:
                res.status(data.status).send(data.message);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.get("/:id", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.getCompany)(req.params.id)
        .then((data) => {
        switch (data.status) {
            case 200:
                res.status(200).send(data.message);
                break;
            default:
                res.status(data.status).send(data.message);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.post("/", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.addCompany)(req.body, req.user._id)
        .then((data) => {
        switch (data.status) {
            case 201:
                res.status(201).send(data.message);
                break;
            default:
                console.log("DATA", JSON.stringify(data, null, 2));
                (0, controllerError_1.default)(data.detail, req, res);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.post("/upload", saveFile_1.upload.single("image"), (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.uploadImage)(req.user.company.toString(), req.body.imageType, req.file)
        .then((data) => {
        switch (data.status) {
            case 200:
                res.status(200).send(data.message);
                break;
            case 400:
            case 401:
                res.status(data.status).send(data.message);
                break;
            default:
                (0, controllerError_1.default)(data.detail, req, res);
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.patch("/", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.updateCompany)(req.body)
        .then((data) => {
        switch (data.status) {
            case 200:
                res.status(200).send(data.message);
                break;
            case 400:
                res.status(data.status).send(data.message);
                break;
            default:
                (0, controllerError_1.default)(data.detail, req, res);
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.patch("/config", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.configCompany)(req.body, req.user.company, req.file)
        .then((data) => {
        switch (data.status) {
            case 200:
                res.status(200).send(data.message);
                break;
            case 400:
            case 401:
                res.status(data.status).send(data.message);
                break;
            default:
                (0, controllerError_1.default)(data.detail, req, res);
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.delete("/removeImage", (0, auth_1.default)(moduleName), function (req, res) {
    const url = req.body.url.split("/");
    const image = url[url.length - 1].split(".");
    cloudinary_1.v2.uploader
        .destroy(commons_1.default.cloudinary.FOLDER_NAME + "/" + image[0])
        .then((result) => res.json(result))
        .catch((error) => res.json(error));
});
router.delete("/:id", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.deleteCompany)(req.params.id)
        .then((resp) => {
        switch (resp.status) {
            case 200:
                res.status(200).send(`Company ${req.params.id} eliminado`);
                break;
            case 400:
                res.status(resp.status).send(resp.message);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
exports.default = router;
