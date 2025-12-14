import { Schema, model, Types } from "mongoose";

const TaskSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String },
    dueDate: { type: Date, required: true },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium"
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Review", "Completed"],
      default: "To Do"
    },

    creatorId: { type: Types.ObjectId, ref: "User", required: true },
    assignedToId: { type: Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const TaskModel = model("Task", TaskSchema);
