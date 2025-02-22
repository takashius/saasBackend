import * as express from "express";
import {
  getPermission,
  getPermissions,
  addPermission,
  updatePermission,
  deletePermission,
} from "./controller";
import auth from "../../middleware/auth";
import controllerError from "../../middleware/controllerError";
const router = express.Router();
const moduleName = "permission";

router.get("/list/:pattern?", auth(moduleName), function (req, res) {
  getPermissions(req.params.pattern)
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

router.get("/:id", auth(moduleName), function (req, res) {
  getPermission(req.params.id)
    .then((permission) => {
      switch (permission.status) {
        case 200:
          res.status(200).send(permission.message);
          break;
        default:
          res.status(permission.status).send(permission.message);
          break;
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

router.post("/", auth(moduleName), function (req, res) {
  addPermission(req.body)
    .then((permission) => {
      switch (permission.status) {
        case 201:
          res.status(201).send(permission.message);
          break;
        default:
          controllerError(permission.detail, req, res);
          break;
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

router.patch("/", auth(moduleName), function (req, res) {
  updatePermission(req.body)
    .then((permission) => {
      switch (permission.status) {
        case 200:
          res.status(200).send(permission.message);
          break;
        case 400:
          res.status(permission.status).send(permission.message);
          break;
        default:
          controllerError(permission.detail, req, res);
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

router.delete("/:id", auth(moduleName), function (req, res) {
  deletePermission(req.params.id)
    .then((resp) => {
      switch (resp.status) {
        case 200:
          res.status(200).send(`Permiso ${req.params.id} eliminado`);
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

export default router;
