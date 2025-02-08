import { ObjectId } from "mongoose";

export interface RoleResponse {
  _id?: ObjectId;
  name: string;
  description: string;
  image?: string;
}
