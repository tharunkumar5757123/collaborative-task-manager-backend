import { Schema, model, Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "In Progress" | "Review" | "Completed";
  creatorId: Types.ObjectId;
  assignedToId?: Types.ObjectId;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Review", "Completed"],
      default: "To Do",
    },
    creatorId: { type: Types.ObjectId, ref: "User", required: true },
    assignedToId: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const TaskModel = model<ITask>("Task", TaskSchema);
