import mongoose from "mongoose";
import validator from "validator";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import config from "../../config/commons";
import { Schema, model } from "mongoose";
import { IUser, IUserModel } from "../../types/users";

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please enter your first name."],
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  photo: {
    type: String,
    trim: true,
  },
  banner: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "Enter an email address."],
    validate: [validator.isEmail, "Enter a valid email address."],
    unique: true,
  },
  role: [
    {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  bio: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Missing password."],
    minLength: [7, "Your password must contain at least 8 characters"],
  },
  recovery: [
    {
      code: String,
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  companies: [
    {
      company: {
        type: Schema.ObjectId,
        ref: "Company",
        required: [true, "A valid company is required."],
      },
      selected: {
        type: Boolean,
        default: false,
      },
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const objToken = {
    _id: user._id,
    date: new Date(),
  };
  const token = sign(objToken, config.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  if (!validator.isEmail(email)) {
    throw new Error("Invalid login credentials");
  }
  const user = await User.findOne({ email, active: true })
    .select("-__v")
    .populate("role");

  if (!user) {
    throw new Error("Invalid login credentials");
  }
  const isPasswordMatch = await compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid login credentials");
  }
  return user;
};

const Role = model("Role", roleSchema);
const User = model<IUser, IUserModel>("User", userSchema);
export { User, Role };
