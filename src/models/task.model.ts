// src/models/task.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "In Progress" | "Review" | "Completed";
  creatorId: string;
  assignedToId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
    status: { type: String, enum: ["To Do", "In Progress", "Review", "Completed"], default: "To Do" },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedToId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const TaskModel: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);

export default TaskModel;
