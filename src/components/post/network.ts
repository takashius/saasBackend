import * as express from "express";
import {
  getPost,
  getPosts,
  addPost,
  updatePost,
  deletePost,
} from "./controller";
import auth from "../../middleware/auth";
import { upload } from "../../middleware/saveFile";
import controllerError from "../../middleware/controllerError";
const router = express.Router();

router.get("/simple", auth("post"), function (req, res) {
  getPosts(null, null, true)
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

router.get("/list/:page?/:pattern?", auth("post"), function (req, res) {
  getPosts(req.params.pattern, parseInt(req.params.page), false)
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

router.get("/:id", auth("post"), function (req, res) {
  getPost(req.params.id)
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
  auth("post"),
  upload.single("image"),
  function (req: any, res) {
    console.log(req.user);
    addPost(req.body, req.file, req.user)
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

router.patch("/", auth("post"), upload.single("image"), function (req, res) {
  updatePost(req.body, req.file)
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
});

router.delete("/:id", auth("post"), function (req, res) {
  deletePost(req.params.id)
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

export default router;
