import { Schema, model } from "mongoose";

const categoriesSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Categories = model("Categories", categoriesSchema);
export default Categories;
