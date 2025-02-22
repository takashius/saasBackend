import * as express from "express";
import {
  getCategory,
  getCategories,
  getPublicCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "./controller";
import auth from "../../middleware/auth";
import { upload } from "../../middleware/saveFile";
import controllerError from "../../middleware/controllerError";
const router = express.Router();
const moduleName = "categories";

router.get("/simple", auth(moduleName), function (req, res) {
  getCategories(null, null, true)
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
  getPublicCategories()
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
  getCategories(req.params.pattern, parseInt(req.params.page), false)
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
  getCategory(req.params.id)
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

router.post("/", auth(moduleName), upload.single("image"), function (req, res) {
  addCategory(req.body, req.file)
    .then((category) => {
      switch (category.status) {
        case 201:
          res.status(201).send(category.message);
          break;
        default:
          controllerError(category.detail, req, res);
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
  upload.single("image"),
  function (req, res) {
    updateCategory(req.body, req.file)
      .then((category) => {
        switch (category.status) {
          case 200:
            res.status(200).send(category.message);
            break;
          case 400:
            res.status(category.status).send(category.message);
            break;
          default:
            controllerError(category.detail, req, res);
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
      });
  }
);

router.delete("/:id", auth(moduleName), function (req, res) {
  deleteCategory(req.params.id)
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

export default router;
