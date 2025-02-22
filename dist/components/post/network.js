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
const moduleName = "post";
router.get("/simple", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.getPosts)(null, null, true)
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
router.get("/list/:page?/:pattern?", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.getPosts)(req.params.pattern, parseInt(req.params.page), false)
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
router.get("/:id", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.getPost)(req.params.id)
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
router.post("/", (0, auth_1.default)(moduleName), saveFile_1.upload.single("image"), function (req, res) {
    console.log(req.user);
    (0, controller_1.addPost)(req.body, req.file, req.user)
        .then((post) => {
        switch (post.status) {
            case 201:
                res.status(201).send(post.message);
                break;
            default:
                (0, controllerError_1.default)(post.detail, req, res);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.patch("/", (0, auth_1.default)(moduleName), saveFile_1.upload.single("image"), function (req, res) {
    (0, controller_1.updatePost)(req.body, req.file)
        .then((post) => {
        switch (post.status) {
            case 200:
                res.status(200).send(post.message);
                break;
            case 400:
                res.status(post.status).send(post.message);
                break;
            default:
                (0, controllerError_1.default)(post.detail, req, res);
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.delete("/:id", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.deletePost)(req.params.id)
        .then((resp) => {
        switch (resp.status) {
            case 200:
                res.status(200).send(`Post ${req.params.id} eliminado`);
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
