import TaskModel from "../models/task.model"; // ✅ default import
import { ITask } from "../models/task.model";

export class TaskService {
  async createTask(userId: string, data: Partial<ITask>) {
    return TaskModel.create({
      ...data,
      creatorId: userId,
    });
  }

  async getTasks(filters: Partial<ITask> = {}) {
    return TaskModel.find(filters).sort({ createdAt: -1 });
  }

  async getTaskById(id: string) {
    return TaskModel.findById(id);
  }

  async updateTask(id: string, data: Partial<ITask>) {
    return TaskModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTask(id: string) {
    return TaskModel.findByIdAndDelete(id);
  }
}
