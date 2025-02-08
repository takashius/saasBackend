import * as express from "express";
import {
  getCompany,
  getCompanies,
  addCompany,
  updateCompany,
  configCompany,
  deleteCompany,
  uploadImage,
} from "./controller";
import auth from "../../middleware/auth";
import controllerError from "../../middleware/controllerError";
const router = express.Router();
import { upload } from "../../middleware/saveFile";
import { v2 as cloudinary } from "cloudinary";
import config from "../../config/commons";
import { IGetUserAuthInfoRequest } from "../../types/general";

router.get("/", auth(), function (req, res) {
  getCompanies()
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

router.get("/myCompany", auth(), function (req: IGetUserAuthInfoRequest, res) {
  getCompany(req.user.company.toString())
    .then((data) => {
      switch (data.status) {
        case 200:
          res.status(200).send(data.message);
          break;
        default:
          res.status(data.status).send(data.message);
          break;
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

router.get("/:id", auth(), function (req, res) {
  getCompany(req.params.id)
    .then((data) => {
      switch (data.status) {
        case 200:
          res.status(200).send(data.message);
          break;
        default:
          res.status(data.status).send(data.message);
          break;
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("Unexpected Error");
    });
});

router.post("/", auth(), function (req: IGetUserAuthInfoRequest, res) {
  addCompany(req.body, req.user._id)
    .then((data) => {
      switch (data.status) {
        case 201:
          res.status(201).send(data.message);
          break;
        default:
          console.log("DATA", JSON.stringify(data, null, 2));
          controllerError(data.detail, req, res);
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
  auth(),
  function (req: IGetUserAuthInfoRequest, res) {
    uploadImage(req.user.company.toString(), req.body.imageType, req.file)
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

router.patch("/", auth(), function (req, res) {
  updateCompany(req.body)
    .then((data) => {
      switch (data.status) {
        case 200:
          res.status(200).send(data.message);
          break;
        case 400:
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
});

router.patch("/config", auth(), function (req: IGetUserAuthInfoRequest, res) {
  configCompany(req.body, req.user.company, req.file)
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
});

router.delete("/removeImage", auth(), function (req, res) {
  const url = req.body.url.split("/");
  const image = url[url.length - 1].split(".");
  cloudinary.uploader
    .destroy(config.cloudinary.FOLDER_NAME + "/" + image[0])
    .then((result) => res.json(result))
    .catch((error) => res.json(error));
});

router.delete("/:id", auth(), function (req, res) {
  deleteCompany(req.params.id)
    .then((resp) => {
      switch (resp.status) {
        case 200:
          res.status(200).send(`Company ${req.params.id} eliminado`);
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
