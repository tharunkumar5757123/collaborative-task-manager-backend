import { TaskRepository } from "../repositories/task.repository";

export class TaskService {
  constructor(private repo = new TaskRepository()) {}

  async createTask(userId: string, dto: any) {
    if (new Date(dto.dueDate) < new Date()) {
      throw new Error("Due date cannot be in the past");
    }

    return this.repo.create({
      ...dto,
      creatorId: userId,
    });
  }

  async updateTask(taskId: string, dto: any) {
    return this.repo.update(taskId, dto);
  }

  async deleteTask(taskId: string) {
    return this.repo.delete(taskId);
  }

  async getTasks(filters: any) {
    return this.repo.find(filters);
  }

  async getTaskById(id: string) {
    const task = await this.repo.findById(id);
    if (!task) throw new Error("Task not found");
    return task;
  }
}
