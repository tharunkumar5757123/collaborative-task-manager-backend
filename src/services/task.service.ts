import { Types } from "mongoose";
import { TaskRepository } from "../repositories/task.repository";
import { ITask } from "../models/task.model";

interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate: string | Date;
  priority?: "Low" | "Medium" | "High" | "Urgent";
  status?: "To Do" | "In Progress" | "Review" | "Completed";
  assignedToId: string;
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string | Date;
  priority?: "Low" | "Medium" | "High" | "Urgent";
  status?: "To Do" | "In Progress" | "Review" | "Completed";
  assignedToId?: string;
}

export class TaskService {
  constructor(private repo = new TaskRepository()) {}

  // CREATE TASK
  async createTask(userId: string, dto: CreateTaskDto): Promise<ITask> {
  if (new Date(dto.dueDate) < new Date()) {
    throw new Error("Due date cannot be in the past");
  }

  return this.repo.create({
    ...dto,
    creatorId: new Types.ObjectId(userId),
    assignedToId: new Types.ObjectId(dto.assignedToId),
    dueDate: new Date(dto.dueDate), // ensure Date type
  });
}


async updateTask(taskId: string, dto: UpdateTaskDto): Promise<ITask> {
  const updateData: Partial<ITask> = {};

  // Only assign fields if they exist
  if (dto.title !== undefined) updateData.title = dto.title;
  if (dto.description !== undefined) updateData.description = dto.description;
  if (dto.dueDate !== undefined) updateData.dueDate = new Date(dto.dueDate);
  if (dto.priority !== undefined) updateData.priority = dto.priority;
  if (dto.status !== undefined) updateData.status = dto.status;
  if (dto.assignedToId !== undefined)
    updateData.assignedToId = new Types.ObjectId(dto.assignedToId);

  const task = await this.repo.update(taskId, updateData);
  if (!task) throw new Error("Task not found");

  return task;
}



  // DELETE TASK
  async deleteTask(taskId: string): Promise<void> {
    await this.repo.delete(taskId);
  }

  // GET TASKS
  async getTasks(filters: any): Promise<ITask[]> {
    // Convert string ObjectIds to Types.ObjectId
    if (filters.assignedToId) {
      filters.assignedToId = new Types.ObjectId(filters.assignedToId);
    }
    return this.repo.find(filters);
  }

  // GET TASK BY ID
  async getTaskById(taskId: string): Promise<ITask> {
    const task = await this.repo.findById(taskId);
    if (!task) throw new Error("Task not found");
    return task;
  }
}
