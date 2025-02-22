import * as express from "express";
import {
  getRole,
  getRoles,
  addRole,
  updateRole,
  deleteRole,
  createRoleGroup,
  addRolesToRoleGroup,
  removeRolesFromRoleGroup,
  listRoleGroups,
  getRoleGroupById,
} from "./controller";
import auth from "../../middleware/auth";
import controllerError from "../../middleware/controllerError";
const router = express.Router();
const moduleName = "role";

router.get("/simple", auth(moduleName), function (req, res) {
  getRoles(null, null, true)
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

router.get("/roleGroup", auth(moduleName), function (req, res) {
  listRoleGroups()
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

router.get("/list/:page?/:pattern?", auth(moduleName), function (req, res) {
  getRoles(req.params.pattern, parseInt(req.params.page), false)
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

router.get("/roleGroup/:id", auth(moduleName), function (req, res) {
  getRoleGroupById(req.params.id)
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
  getRole(req.params.id)
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

router.post("/", auth(moduleName), function (req, res) {
  addRole(req.body)
    .then((role) => {
      switch (role.status) {
        case 201:
          res.status(201).send(role.message);
          break;
        default:
          controllerError(role.detail, req, res);
          break;
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

router.post("/roleGroup", auth(moduleName), function (req, res) {
  createRoleGroup(req.body.roleParent)
    .then((role) => {
      switch (role.status) {
        case 201:
          res.status(201).send(role.message);
          break;
        default:
          controllerError(role.detail, req, res);
          break;
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

router.patch("/", auth(moduleName), function (req, res) {
  updateRole(req.body)
    .then((role) => {
      switch (role.status) {
        case 200:
          res.status(200).send(role.message);
          break;
        case 400:
          res.status(role.status).send(role.message);
          break;
        default:
          controllerError(role.detail, req, res);
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

router.patch("/roleGroup", auth(moduleName), function (req, res) {
  addRolesToRoleGroup(req.body.roleParent, req.body.roles)
    .then((role) => {
      switch (role.status) {
        case 201:
          res.status(201).send(role.message);
          break;
        default:
          controllerError(role.detail, req, res);
          break;
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

router.delete("/:id", auth(moduleName), function (req, res) {
  deleteRole(req.params.id)
    .then((resp) => {
      switch (resp.status) {
        case 200:
          res.status(200).send(`Role ${req.params.id} eliminado`);
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

router.delete("/roleGroup", auth(moduleName), function (req, res) {
  removeRolesFromRoleGroup(req.body.roleParent, req.body.roles)
    .then((role) => {
      switch (role.status) {
        case 201:
          res.status(201).send(role.message);
          break;
        default:
          controllerError(role.detail, req, res);
          break;
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

export default router;
