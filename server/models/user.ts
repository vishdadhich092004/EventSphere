import mongoose, { Schema } from "mongoose";
import { UserType } from "../shared/types";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "organiser"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserType>("User", userSchema);

export default User;
