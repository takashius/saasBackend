import { Schema, model } from "mongoose";
import { IPlan } from "../../types/plan";

const planSchema = new Schema<IPlan>({
  name: {
    type: String,
    unique: true,
  },
  cost: {
    type: Number,
  },
  features: [
    {
      name: {
        type: String,
        trim: true,
      },
      value: String,
    },
  ],
  created: {
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "A valid user is required to create a plan."],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Plan = model<IPlan>("Plan", planSchema);
export default Plan;
