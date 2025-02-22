import * as express from "express";
import {
  getPlan,
  getPlanes,
  getPublicPlanes,
  addPlan,
  updatePlan,
  deletePlan,
} from "./controller";
import auth from "../../middleware/auth";
import controllerError from "../../middleware/controllerError";
import { IGetUserAuthInfoRequest } from "../../types/general";
const router = express.Router();
const moduleName = "plan";

router.get("/simple", auth(moduleName), function (req, res) {
  getPlanes(null, null, true)
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
  getPublicPlanes()
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
  getPlanes(req.params.pattern, parseInt(req.params.page), false)
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
  getPlan(req.params.id)
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

router.post(
  "/",
  auth(moduleName),
  function (req: IGetUserAuthInfoRequest, res) {
    addPlan(req.body, req.user, req.user.company)
      .then((plan) => {
        switch (plan.status) {
          case 201:
            res.status(201).send(plan.message);
            break;
          default:
            controllerError(plan.detail, req, res);
            break;
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
      });
  }
);

router.patch("/", auth(moduleName), function (req, res) {
  updatePlan(req.body)
    .then((plan) => {
      switch (plan.status) {
        case 200:
          res.status(200).send(plan.message);
          break;
        case 400:
          res.status(plan.status).send(plan.message);
          break;
        default:
          controllerError(plan.detail, req, res);
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

router.delete("/:id", auth(moduleName), function (req, res) {
  deletePlan(req.params.id)
    .then((resp) => {
      switch (resp.status) {
        case 200:
          res.status(200).send(`Plan ${req.params.id} eliminado`);
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
