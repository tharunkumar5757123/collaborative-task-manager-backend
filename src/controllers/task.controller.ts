import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { io } from "../server";
import Notification from "../models/notification.model";

const service = new TaskService();

// CREATE TASK
export const createTask = async (req: Request, res: Response) => {
  try {
    const dto = req.body;
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const task = await service.createTask(userId, dto);

    io.emit("taskCreated", task);

    // Notify assigned user
    if (task.assignedToId) {
      const notification = await Notification.create({
        user: task.assignedToId,
        message: `You were assigned to task "${task.title}"`,
      });
      io.to(task.assignedToId.toString()).emit("notification:new", notification);
    }

    res.status(201).json(task);
  } catch (err: any) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// UPDATE TASK
export const updateTask = async (req: Request, res: Response) => {
  try {
    const dto = req.body;
    const taskId = req.params.id;

    const oldTask = await service.getTaskById(taskId);
    const updatedTask = await service.updateTask(taskId, dto);

    io.emit("taskUpdated", updatedTask);

    // Notify if assignment changed
    if (dto.assignedToId && oldTask.assignedToId?.toString() !== dto.assignedToId) {
      const notification = await Notification.create({
        user: updatedTask.assignedToId,
        message: `You were assigned to task "${updatedTask.title}"`,
      });
      io.to(updatedTask.assignedToId.toString()).emit("notification:new", notification);
    }

    res.json(updatedTask);
  } catch (err: any) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// DELETE TASK
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    await service.deleteTask(taskId);

    io.emit("taskDeleted", { id: taskId });
    res.status(204).send();
  } catch (err: any) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// GET TASKS
export const getTasks = async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.assignedToId) filters.assignedToId = req.query.assignedToId;

    const tasks = await service.getTasks(filters);
    res.json(tasks);
  } catch (err: any) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
