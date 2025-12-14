import { Schema, model, Types } from "mongoose";

const notificationSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("Notification", notificationSchema);
