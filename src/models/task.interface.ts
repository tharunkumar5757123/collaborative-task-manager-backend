import { Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate: Date;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "In Progress" | "Review" | "Completed";
  creatorId: Types.ObjectId;
  assignedToId: Types.ObjectId;
}
