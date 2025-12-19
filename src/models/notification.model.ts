import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface INotification extends Document {
  user: Types.ObjectId;
  message: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification: Model<INotification> = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
export default Notification;
