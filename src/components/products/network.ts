import * as express from "express";
import {
  getProduct,
  getProducts,
  addProduct,
  updateProduct,
  getFeaturedProduct,
  getProductsByCategory,
  deleteProduct,
} from "./controller";
import auth from "../../middleware/auth";
import { upload } from "../../middleware/saveFile";
import controllerError from "../../middleware/controllerError";
const router = express.Router();

router.get("/simple", auth("products"), function (req, res) {
  getProducts(null, null, true)
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

router.get("/featured", function (req, res) {
  getFeaturedProduct()
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
  "/list/:page?/:pattern?",
  auth("products"),
  function (req: any, res) {
    getProducts(req.params.pattern, parseInt(req.params.page), false, req.user)
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

router.get("/:id", function (req, res) {
  getProduct(req.params.id)
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

router.get("/category/:id", function (req, res) {
  getProductsByCategory(req.params.id)
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
  auth("products"),
  upload.single("image"),
  function (req: any, res) {
    addProduct(req.body, req.file, req.user, req.user.company)
      .then((post) => {
        switch (post.status) {
          case 201:
            res.status(201).send(post.message);
            break;
          default:
            controllerError(post.detail, req, res);
            break;
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
      });
  }
);

router.patch(
  "/",
  auth("products"),
  upload.single("image"),
  function (req, res) {
    updateProduct(req.body, req.file)
      .then((post) => {
        switch (post.status) {
          case 200:
            res.status(200).send(post.message);
            break;
          case 400:
            res.status(post.status).send(post.message);
            break;
          default:
            controllerError(post.detail, req, res);
        }
      })
      .catch((e) => {
        console.log(e);
        res.status(500).send("Unexpected Error");
      });
  }
);

router.delete("/:id", auth("products"), function (req, res) {
  deleteProduct(req.params.id)
    .then((resp) => {
      switch (resp.status) {
        case 200:
          res.status(200).send(`Producto ${req.params.id} eliminado`);
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
