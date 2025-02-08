import mongoose, { Schema, Document } from "mongoose";

interface IPermission extends Document {
  title: string;
  route: string;
  module: string;
  method: string;
  roles: string[];
}

const permissionSchema = new Schema<IPermission>({
  title: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  module: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      required: true,
    },
  ],
});

const Permission = mongoose.model<IPermission>("Permission", permissionSchema);
export default Permission;
