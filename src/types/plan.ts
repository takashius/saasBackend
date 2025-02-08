import { ObjectId, Schema, Document } from "mongoose";

export interface FeaturesPlan {
  name: string;
  value: any;
}

export interface PlanResponse {
  _id?: ObjectId;
  name: string;
  cost: number;
  features: [FeaturesPlan];
}

export interface IPlan extends Document {
  name: string;
  cost: number;
  features: Array<{ name: string; value: any }>;
  created: {
    user: Schema.Types.ObjectId;
    date: Date;
  };
  active: boolean;
}
