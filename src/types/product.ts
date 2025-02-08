import { ObjectId } from "mongoose";

export interface ProductResponse {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number;
  discount: number;
  category: any;
  image?: string;
}
