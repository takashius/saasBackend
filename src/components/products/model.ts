import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
    },
    category: {
      type: Schema.ObjectId,
      ref: "Categories",
      required: [true, "A valid category is required."],
      index: true,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    image: {
      type: String,
      trim: true,
    },
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "A valid user is required to create a product."],
    },
    company: {
      type: Schema.ObjectId,
      ref: "Company",
      required: [true, "A valid company is required to create a product."],
    },
    comments: [
      {
        user: {
          type: Schema.ObjectId,
          ref: "User",
          required: [true, "A valid user is required to comment."],
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          trim: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    history: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        changes: {
          type: Map,
          of: String,
        },
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("finalPrice").get(function () {
  return this.price - this.price * (this.discount / 100);
});

const Products = model("Products", productSchema);
export default Products;
