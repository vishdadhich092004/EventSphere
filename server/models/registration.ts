import mongoose, { Schema } from "mongoose";
import { RegistrationType } from "../shared/types";

const registrationSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["registered", "cancelled"],
      default: "registered",
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    cancelledAt: {
      type: Date,
      required: false,
    },
    cancellationReason: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// preventing duplicating registrations
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

const Registration = mongoose.model<RegistrationType>(
  "Registration",
  registrationSchema
);

export default Registration;
