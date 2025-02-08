import mongoose, { ObjectId, Document, Model } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  lastName: string;
  phone: string;
  photo: string;
  banner: string;
  date: Date;
  email: string;
  role: mongoose.Types.ObjectId[];
  bio: string;
  address: string;
  password: string;
  recovery: Array<{ code: string }>;
  tokens: Array<{ token: string; date: Date }>;
  companies: Array<{ company: ObjectId | string; selected: boolean }>;
  active: boolean;
  generateAuthToken: () => Promise<string>;
}

export interface IUserModel extends Model<IUser> {
  findByCredentials: (email: string, password: string) => Promise<IUser>;
}

export interface RequestUser {
  name: string;
  email: string;
  password: string;
  role: ObjectId;
  companyName: string;
  docId: string;
}

export interface UserResponse {
  _id: ObjectId | string;
  name: string;
  lastName: string;
  phone: string;
  photo: string;
  banner: string;
  date: Date;
  email: string;
  role: mongoose.Types.ObjectId[];
  bio: string;
  address: string;
  password: string;
  companies: Array<{ company: any | string; selected: boolean }>;
  active: boolean;
}

export interface CompanyResponse {
  _id?: string;
  name: string;
  email: string;
  rif: string;
  created: {
    user: string;
  };
}
