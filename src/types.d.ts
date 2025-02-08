import { ObjectId } from "mongoose";
import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: ObjectId | string;
        name: string;
        lastName: string;
        email: string;
        phone: string;
        company: ObjectId | string;
      };
      token?: string;
      file?: Multer.File;
    }
  }
}
