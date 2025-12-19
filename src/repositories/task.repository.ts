import { TaskModel, ITask } from "../models/task.model";

export class TaskRepository {
  async create(data: Partial<ITask>): Promise<ITask> {
    return TaskModel.create(data);
  }

  async find(filters: any): Promise<ITask[]> {
    return TaskModel.find(filters).lean(); // <-- plain JS objects
  }

  async findById(id: string): Promise<ITask | null> {
    return TaskModel.findById(id).lean();
  }

  async update(id: string, data: Partial<ITask>): Promise<ITask | null> {
    return TaskModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id: string): Promise<void> {
    await TaskModel.findByIdAndDelete(id);
  }
}
