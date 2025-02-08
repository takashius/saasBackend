import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "A valid user is required to create a post."],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Posts = model("Posts", postSchema);
export default Posts;
