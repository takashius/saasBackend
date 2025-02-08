import mongoose, { ObjectId } from "mongoose";
import { Request } from "express";

export interface StoreResponse {
  status: number;
  message: any;
  detail?: any;
}

export interface IGetUserAuthInfoRequest extends Request {
  user?: {
    _id: ObjectId | string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    company: ObjectId | string;
    role: mongoose.Types.ObjectId[];
  };
  token?: string;
  file?: any;
}
