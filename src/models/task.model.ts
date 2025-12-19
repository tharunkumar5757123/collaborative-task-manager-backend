import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "In Progress" | "Review" | "Completed";
  creatorId: Types.ObjectId;        // ✅ use Types.ObjectId
  assignedToId?: Types.ObjectId;
  dueDate?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
    status: { type: String, enum: ["To Do", "In Progress", "Review", "Completed"], default: "To Do" },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ✅ use Schema.Types.ObjectId
    assignedToId: { type: Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

const TaskModel: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);

export default TaskModel;
