import multer from "multer";
import config from "../config/commons";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

interface CloudinaryStorageParams {
  folder: string;
  allowedFormats: any;
  public_id: (req: Express.Request, file: Express.Multer.File) => string;
}

cloudinary.config({
  cloud_name: config.cloudinary.CLOUD_NAME,
  api_key: config.cloudinary.CLOUDINARY_KEY,
  api_secret: config.cloudinary.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: config.cloudinary.FOLDER_NAME,
    allowedFormats: ["jpeg", "png", "jpg", "gif"],
    public_id: (req, file) => file.filename,
  } as CloudinaryStorageParams,
});

const upload = multer({ storage });

const removeImage = (urlImage: string) => {
  if (urlImage) {
    const url = urlImage.split("/");
    const image = url[url.length - 1].split(".");
    cloudinary.uploader
      .destroy(config.cloudinary.FOLDER_NAME + "/" + image[0])
      .then(() => true)
      .catch(() => false);
  }
};

export { upload, removeImage };
