import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { io } from "../server";
import Notification from "../models/notification.model";
import { ITask } from "../models/task.interface"; // <- import the interface

const service = new TaskService();

// CREATE TASK
export const createTask = async (req: Request, res: Response) => {
  try {
    const dto = req.body;
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Validate due date
    if (new Date(dto.dueDate) < new Date()) {
      return res.status(400).json({ message: "Due date cannot be in the past" });
    }

    // Create task
    const task: ITask = await service.createTask(userId, dto);

    // Real-time socket event
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
    res.status(500).json({ message: "Server error", details: err.message });
  }
};

// UPDATE TASK
export const updateTask = async (req: Request, res: Response) => {
  try {
    const dto = req.body;
    const taskId = req.params.id;

    // Get old task
    const oldTask: ITask = await service.getTaskById(taskId);

    if (!oldTask) return res.status(404).json({ message: "Task not found" });

    const updatedTask: ITask = await service.updateTask(taskId, dto);
    if (!updatedTask) return res.status(404).json({ message: "Task not found after update" });

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
    res.status(500).json({ message: "Server error", details: err.message });
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
    res.status(500).json({ message: "Server error", details: err.message });
  }
};

// GET TASKS
export const getTasks = async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.assignedToId) filters.assignedToId = req.query.assignedToId;

    const tasks: ITask[] = await service.getTasks(filters);

    res.json(tasks);
  } catch (err: any) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error", details: err.message });
  }
};
