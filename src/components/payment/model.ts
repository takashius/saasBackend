import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  amount: {
    type: Number,
  },
  plan: {
    type: Schema.ObjectId,
    ref: "Plan",
    required: [true, "A valid plan is required to create a payment."],
  },
  company: {
    type: Schema.ObjectId,
    ref: "Company",
    required: [true, "A valid company is required to create a payment."],
  },
  created: {
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "A valid user is required to create a payment."],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  expiryDate: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Payment = model("Payment", paymentSchema);
export default Payment;
