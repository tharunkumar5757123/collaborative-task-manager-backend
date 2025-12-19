import { Types } from "mongoose";
import { TaskModel, ITask } from "../models/task.model";

export class TaskService {
  async createTask(userId: string, data: Partial<ITask>): Promise<ITask> {
    return TaskModel.create({
      ...data,
      creatorId: new Types.ObjectId(userId),
    });
  }

  async getTasks(filters: any): Promise<ITask[]> {
    return TaskModel.find(filters).sort({ createdAt: -1 });
  }

  async getTaskById(id: string): Promise<ITask | null> {
    return TaskModel.findById(id);
  }

  async updateTask(id: string, data: Partial<ITask>): Promise<ITask | null> {
    return TaskModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTask(id: string): Promise<void> {
    await TaskModel.findByIdAndDelete(id);
  }
}
