import { Types } from "mongoose";
import { TaskModel } from "../models/task.model";

export class TaskService {
  async createTask(userId: string, data: any) {
    return TaskModel.create({
      ...data,
      creatorId: new Types.ObjectId(userId),
    });
  }

  async getTasks(filters: any) {
    return TaskModel.find(filters).sort({ createdAt: -1 });
  }

  async getTaskById(id: string) {
    return TaskModel.findById(id);
  }

  async updateTask(id: string, data: any) {
    return TaskModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTask(id: string) {
    return TaskModel.findByIdAndDelete(id);
  }
}
