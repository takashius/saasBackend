import * as express from "express";
import {
  getUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
  updateProfile,
  loginUser,
  logoutUser,
  logoutAll,
  changePassword,
  addCompany,
  removeCompany,
  selectCompany,
  recoveryStepOne,
  recoveryStepTwo,
  registerUserPublic,
  uploadImage,
  updateUserRoles,
  getRoles,
} from "./controller";
import auth from "../../middleware/auth";
import controllerError from "../../middleware/controllerError";
const router = express.Router();
import { upload } from "../../middleware/saveFile";
import { IGetUserAuthInfoRequest } from "../../types/general";

const moduleName = "user";

router.get("/simple", auth(moduleName), function (req, res) {
  getUsers(null, null, true)
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

router.get(
  "/roles",
  auth(moduleName),
  function (req: IGetUserAuthInfoRequest, res) {
    getRoles(req.user)
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
  }
);

router.get(
  "/list/:page?/:pattern?",
  auth(moduleName),
  function (req: IGetUserAuthInfoRequest, res) {
    getUsers(req.params.pattern, parseInt(req.params.page), false, req.user)
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
  }
);

router.get(
  "/account",
  auth(moduleName),
  function (req: IGetUserAuthInfoRequest, res) {
    getUser(req.user._id.toString())
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
  }
);

router.get("/recovery/:email", function (req, res) {
  recoveryStepOne(req.params.email)
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

router.get("/:id", auth(moduleName), function (req, res) {
  getUser(req.params.id)
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

router.post(
  "/",
  auth(moduleName),
  upload.single("photo"),
  function (req: IGetUserAuthInfoRequest, res) {
    addUser(req.body, req.user.company, req.file)
      .then((user) => {
        switch (user.status) {
          case 201:
            res.status(201).send(user.message);
            break;
          default:
            controllerError(user.detail, req, res);
            break;
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
      });
  }
);

router.post("/register", function (req, res) {
  registerUserPublic(req.body)
    .then((user) => {
      switch (user.status) {
        case 201:
          res.status(201).send(user.message);
          break;
        case 400:
          res.status(user.status).send(user.message);
          break;
        default:
          controllerError(user.detail, req, res);
          break;
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

router.post("/recovery", function (req, res) {
  recoveryStepTwo(req.body)
    .then((user) => {
      switch (user.status) {
        case 200:
          res.status(200).send(user.message);
          break;
        case 400:
          res.status(400).send(user.message);
          break;
        default:
          controllerError(user.detail, req, res);
          break;
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

router.post(
  "/upload",
  upload.single("image"),
  auth(moduleName),
  function (req: IGetUserAuthInfoRequest, res) {
    uploadImage(req.user, req.file, "photo")
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
            controllerError(data.detail, req, res);
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
      });
  }
);

router.post(
  "/uploadBanner",
  upload.single("image"),
  auth(moduleName),
  function (req: IGetUserAuthInfoRequest, res) {
    uploadImage(req.user, req.file, "banner")
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
            controllerError(data.detail, req, res);
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
      });
  }
);

router.post(
  "/uploadUserImage",
  upload.single("image"),
  auth(moduleName),
  function (req: IGetUserAuthInfoRequest, res) {
    uploadImage(req.body.userId, req.file, "photo")
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
            controllerError(data.detail, req, res);
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
      });
  }
);

router.delete("/del_company", auth(moduleName), function (req, res) {
  removeCompany(req.body.user, req.body.company)
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

router.delete("/:id", auth(moduleName), function (req, res) {
  deleteUser(req.params.id)
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

router.patch(
  "/",
  auth(moduleName),
  upload.single("photo"),
  function (req, res) {
    updateUser(req.body, req.file)
      .then((user) => {
        switch (user.status) {
          case 200:
            res.status(200).send(user.message);
            break;
          case 400:
            res.status(user.status).send(user.message);
            break;
          default:
            controllerError(user.detail, req, res);
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
      });
  }
);

router.patch(
  "/profile",
  auth(moduleName),
  function (req: IGetUserAuthInfoRequest, res) {
    updateProfile(req.user._id.toString(), req.body)
      .then((user) => {
        switch (user.status) {
          case 200:
            res.status(200).send(user.message);
            break;
          case 400:
            res.status(user.status).send(user.message);
            break;
          default:
            controllerError(user.detail, req, res);
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
      });
  }
);

router.patch(
  "/updateRoles",
  auth(moduleName),
  function (req: IGetUserAuthInfoRequest, res) {
    updateUserRoles(req.user._id.toString(), req.body.roles)
      .then((user) => {
        switch (user.status) {
          case 200:
            res.status(200).send(user.message);
            break;
          case 400:
            res.status(user.status).send(user.message);
            break;
          default:
            controllerError(user.detail, req, res);
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
      });
  }
);

router.patch(
  "/select_company",
  auth(moduleName),
  function (req: IGetUserAuthInfoRequest, res) {
    selectCompany(req.user._id, req.body.company)
      .then((user) => {
        switch (user.status) {
          case 200:
            res.status(200).send(user.message);
            break;
          case 400:
            res.status(user.status).send(user.message);
            break;
          default:
            controllerError(user.detail, req, res);
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
      });
  }
);

router.post("/login", async (req, res) => {
  loginUser(req.body)
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

router.post(
  "/logout",
  auth(moduleName),
  async (req: IGetUserAuthInfoRequest, res) => {
    logoutUser(req.user._id.toString(), req.token)
      .then((user) => {
        res.status(200).send("Logout successful");
      })
      .catch((e) => {
        res.status(400).send("Invalid user data");
      });
  }
);

router.post(
  "/logoutall",
  auth(moduleName),
  async (req: IGetUserAuthInfoRequest, res) => {
    logoutAll(req.user._id.toString())
      .then((user) => {
        res.status(200).send("Logout successful");
      })
      .catch((e) => {
        res.status(400).send("Invalid user data");
      });
  }
);

router.post(
  "/change_password",
  auth(moduleName),
  function (req: IGetUserAuthInfoRequest, res) {
    changePassword(req.user, req.body.password)
      .then((resp) => {
        switch (resp.status) {
          case 200:
            res.status(resp.status).send(resp.message);
            break;
          case 400:
            res.status(resp.status).send(resp.message);
            break;
          default:
            controllerError(resp.detail, req, res);
            break;
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
      });
  }
);

router.post("/add_company", auth(moduleName), function (req, res) {
  addCompany(req.body.user, req.body.company)
    .then((resp) => {
      switch (resp.status) {
        case 200:
          res.status(resp.status).send(resp.message);
          break;
        case 400:
          res.status(resp.status).send(resp.message);
          break;
        default:
          controllerError(resp.detail, req, res);
          break;
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

export default router;
