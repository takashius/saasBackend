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
const saveFile_1 = require("../../middleware/saveFile");
const controllerError_1 = __importDefault(require("../../middleware/controllerError"));
const router = express.Router();
router.get("/simple", (0, auth_1.default)(), function (req, res) {
    (0, controller_1.getCategories)(null, null, true)
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
router.get("/public", function (req, res) {
    (0, controller_1.getPublicCategories)()
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
router.get("/list/:page?/:pattern?", (0, auth_1.default)(), function (req, res) {
    (0, controller_1.getCategories)(req.params.pattern, parseInt(req.params.page), false)
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
router.get("/:id", (0, auth_1.default)(), function (req, res) {
    (0, controller_1.getCategory)(req.params.id)
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
router.post("/", (0, auth_1.default)(), saveFile_1.upload.single("image"), function (req, res) {
    (0, controller_1.addCategory)(req.body, req.file)
        .then((category) => {
        switch (category.status) {
            case 201:
                res.status(201).send(category.message);
                break;
            default:
                (0, controllerError_1.default)(category.detail, req, res);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.patch("/", (0, auth_1.default)(), saveFile_1.upload.single("image"), function (req, res) {
    (0, controller_1.updateCategory)(req.body, req.file)
        .then((category) => {
        switch (category.status) {
            case 200:
                res.status(200).send(category.message);
                break;
            case 400:
                res.status(category.status).send(category.message);
                break;
            default:
                (0, controllerError_1.default)(category.detail, req, res);
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.delete("/:id", (0, auth_1.default)(), function (req, res) {
    (0, controller_1.deleteCategory)(req.params.id)
        .then((resp) => {
        switch (resp.status) {
            case 200:
                res.status(200).send(`Categoria ${req.params.id} eliminada`);
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
