import { TaskRepository } from "../repositories/task.repository";
import { ITask } from "../models/task.model";

export class TaskService {
  constructor(private repo = new TaskRepository()) {}

  async createTask(userId: string, dto: Partial<ITask>): Promise<ITask> {
    if (new Date(dto.dueDate!) < new Date()) {
      throw new Error("Due date cannot be in the past");
    }
    return this.repo.create({ ...dto, creatorId: userId });
  }

  async updateTask(taskId: string, dto: Partial<ITask>): Promise<ITask | null> {
    return this.repo.update(taskId, dto);
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.repo.delete(taskId);
  }

  async getTasks(filters: any): Promise<ITask[]> {
    return this.repo.find(filters);
  }

  async getTaskById(id: string): Promise<ITask | null> {
    return this.repo.findById(id);
  }
}
