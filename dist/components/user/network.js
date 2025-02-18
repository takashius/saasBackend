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
const moduleName = "user";
router.get("/simple", (0, auth_1.default)(), function (req, res) {
    (0, controller_1.getUsers)(null, null, true)
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
router.get("/roles", (0, auth_1.default)(), function (req, res) {
    (0, controller_1.getRoles)(req.user)
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
    (0, controller_1.getUsers)(req.params.pattern, parseInt(req.params.page), false, req.user)
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
router.get("/account", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.getUser)(req.user._id.toString())
        .then((userList) => {
        switch (userList.status) {
            case 200:
                res.status(200).send(userList.message);
                break;
            default:
                res.status(userList.status).send(userList.message);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected network Error");
    });
});
router.get("/recovery/:email", function (req, res) {
    (0, controller_1.recoveryStepOne)(req.params.email)
        .then((result) => {
        switch (result.status) {
            case 200:
                res.status(200).send(result.message);
                break;
            default:
                res.status(result.status).send(result.message);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected network Error");
    });
});
router.get("/:id", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.getUser)(req.params.id)
        .then((userList) => {
        switch (userList.status) {
            case 200:
                res.status(200).send(userList.message);
                break;
            default:
                res.status(userList.status).send(userList.message);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.post("/", (0, auth_1.default)(moduleName), saveFile_1.upload.single("photo"), function (req, res) {
    (0, controller_1.addUser)(req.body, req.user.company, req.file)
        .then((user) => {
        switch (user.status) {
            case 201:
                res.status(201).send(user.message);
                break;
            default:
                (0, controllerError_1.default)(user.detail, req, res);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.post("/register", function (req, res) {
    (0, controller_1.registerUserPublic)(req.body)
        .then((user) => {
        switch (user.status) {
            case 201:
                res.status(201).send(user.message);
                break;
            case 400:
                res.status(user.status).send(user.message);
                break;
            default:
                (0, controllerError_1.default)(user.detail, req, res);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.post("/recovery", function (req, res) {
    (0, controller_1.recoveryStepTwo)(req.body)
        .then((user) => {
        switch (user.status) {
            case 200:
                res.status(200).send(user.message);
                break;
            case 400:
                res.status(400).send(user.message);
                break;
            default:
                (0, controllerError_1.default)(user.detail, req, res);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.post("/upload", saveFile_1.upload.single("image"), (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.uploadImage)(req.user, req.file, "photo")
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
router.post("/uploadBanner", saveFile_1.upload.single("image"), (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.uploadImage)(req.user, req.file, "banner")
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
router.delete("/del_company", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.removeCompany)(req.body.user, req.body.company)
        .then((resp) => {
        switch (resp.status) {
            case 200:
                res.status(200).send(`Company removed`);
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
router.delete("/:id", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.deleteUser)(req.params.id)
        .then((resp) => {
        switch (resp.status) {
            case 200:
                res.status(200).send(`Usuario ${req.params.id} eliminado`);
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
router.patch("/", (0, auth_1.default)(moduleName), saveFile_1.upload.single("photo"), function (req, res) {
    (0, controller_1.updateUser)(req.body, req.file)
        .then((user) => {
        switch (user.status) {
            case 200:
                res.status(200).send(user.message);
                break;
            case 400:
                res.status(user.status).send(user.message);
                break;
            default:
                (0, controllerError_1.default)(user.detail, req, res);
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.patch("/profile", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.updateProfile)(req.user._id.toString(), req.body)
        .then((user) => {
        switch (user.status) {
            case 200:
                res.status(200).send(user.message);
                break;
            case 400:
                res.status(user.status).send(user.message);
                break;
            default:
                (0, controllerError_1.default)(user.detail, req, res);
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.patch("/updateRoles", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.updateUserRoles)(req.user._id.toString(), req.body.roles)
        .then((user) => {
        switch (user.status) {
            case 200:
                res.status(200).send(user.message);
                break;
            case 400:
                res.status(user.status).send(user.message);
                break;
            default:
                (0, controllerError_1.default)(user.detail, req, res);
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.patch("/select_company", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.selectCompany)(req.body.user, req.body.company)
        .then((user) => {
        switch (user.status) {
            case 200:
                res.status(200).send(user.message);
                break;
            case 400:
                res.status(user.status).send(user.message);
                break;
            default:
                (0, controllerError_1.default)(user.detail, req, res);
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.post("/login", async (req, res) => {
    (0, controller_1.loginUser)(req.body)
        .then((user) => {
        switch (user.status) {
            case 200:
                res.status(200).send(user.message);
                break;
            default:
                res.status(user.status).send(user.message);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.post("/logout", (0, auth_1.default)(moduleName), async (req, res) => {
    (0, controller_1.logoutUser)(req.user._id.toString(), req.token)
        .then((user) => {
        res.status(200).send("Logout successful");
    })
        .catch((e) => {
        res.status(400).send("Invalid user data");
    });
});
router.post("/logoutall", (0, auth_1.default)(moduleName), async (req, res) => {
    (0, controller_1.logoutAll)(req.user._id.toString())
        .then((user) => {
        res.status(200).send("Logout successful");
    })
        .catch((e) => {
        res.status(400).send("Invalid user data");
    });
});
router.post("/change_password", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.changePassword)(req.user, req.body.password)
        .then((resp) => {
        switch (resp.status) {
            case 200:
                res.status(resp.status).send(resp.message);
                break;
            case 400:
                res.status(resp.status).send(resp.message);
                break;
            default:
                (0, controllerError_1.default)(resp.detail, req, res);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
router.post("/add_company", (0, auth_1.default)(moduleName), function (req, res) {
    (0, controller_1.addCompany)(req.body.user, req.body.company)
        .then((resp) => {
        switch (resp.status) {
            case 200:
                res.status(resp.status).send(resp.message);
                break;
            case 400:
                res.status(resp.status).send(resp.message);
                break;
            default:
                (0, controllerError_1.default)(resp.detail, req, res);
                break;
        }
    })
        .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
    });
});
exports.default = router;
