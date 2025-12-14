import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { CreateTaskDto, UpdateTaskDto } from "../dto/task.dto";
import { io } from "../server";
import Notification from "../models/notification.model";

const service = new TaskService();

/**
 * Create Task
 */
export const createTask = async (req: Request, res: Response) => {
  const dto = CreateTaskDto.parse(req.body);

  const task = await service.createTask(
    (req as any).userId,
    dto
  );

  // 🔴 Real-time task event
  io.emit("taskCreated", task);

  // 🔔 Notify assigned user
  await notifyAssignment(task);

  res.status(201).json(task);
};

/**
 * Update Task
 */
export const updateTask = async (req: Request, res: Response) => {
  const dto = UpdateTaskDto.parse(req.body);

  // Get old task before update
  const oldTask = await service.getTaskById(req.params.id);

  const updatedTask = await service.updateTask(req.params.id, dto);

  io.emit("taskUpdated", updatedTask);

  // 🔔 Notify ONLY if assignment changed
  if (
    dto.assignedToId &&
    oldTask.assignedToId?.toString() !== dto.assignedToId
  ) {
    await notifyAssignment(updatedTask);
  }

  res.json(updatedTask);
};

/**
 * Delete Task
 */
export const deleteTask = async (req: Request, res: Response) => {
  await service.deleteTask(req.params.id);

  io.emit("taskDeleted", { id: req.params.id });

  res.status(204).send();
};

/**
 * Get Tasks with Filters
 */
export const getTasks = async (req: Request, res: Response) => {
  const filters: any = {};

  if (req.query.status) filters.status = req.query.status;
  if (req.query.priority) filters.priority = req.query.priority;
  if (req.query.assignedToId)
    filters.assignedToId = req.query.assignedToId;

  const tasks = await service.getTasks(filters);

  res.json(tasks);
};

/**
 * 🔔 Assignment Notification
 */
const notifyAssignment = async (task: any) => {
  if (!task.assignedToId) return;

  const notification = await Notification.create({
    user: task.assignedToId,
    message: `You were assigned to task "${task.title}"`,
  });

  // Emit to user-specific socket room
  io.to(task.assignedToId.toString()).emit(
    "notification:new",
    notification
  );
};
