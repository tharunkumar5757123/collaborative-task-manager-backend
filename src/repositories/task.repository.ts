import { TaskModel, ITask } from "../models/task.model";

export class TaskRepository {
  async create(data: Partial<ITask>): Promise<ITask> {
    const task = new TaskModel(data);
    return task.save();
  }

  async update(taskId: string, data: Partial<ITask>): Promise<ITask | null> {
    return TaskModel.findByIdAndUpdate(taskId, data, { new: true }).exec();
  }

  async delete(taskId: string): Promise<void> {
    await TaskModel.findByIdAndDelete(taskId).exec();
  }

  async find(filters: any): Promise<ITask[]> {
    return TaskModel.find(filters).exec();
  }

  async findById(taskId: string): Promise<ITask | null> {
    return TaskModel.findById(taskId).exec();
  }
}
