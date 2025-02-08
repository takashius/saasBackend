import { ObjectId } from "mongoose";

export interface PostResponse {
  _id?: ObjectId;
  title: string;
  resume: string;
  content: string;
  image?: string;
}
