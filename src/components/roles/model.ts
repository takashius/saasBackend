import { Schema, model } from "mongoose";

const roleGroupSchema = new Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },
  roles: [
    {
      type: Schema.ObjectId,
      ref: "Role",
    },
  ],
});

const RoleGroup = model("RoleGroup", roleGroupSchema);
export default RoleGroup;
