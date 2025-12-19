import { Request, Response } from "express";
import { Types } from "mongoose";
import { TaskService } from "../services/task.service";
import { io } from "../server";
import Notification from "../models/notification.model";

const service = new TaskService();

/* ================= CREATE TASK ================= */
export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const {
      title,
      description,
      dueDate,
      priority,
      assignedToId,
      status,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (assignedToId && !Types.ObjectId.isValid(assignedToId)) {
      return res.status(400).json({ message: "Invalid assignedToId" });
    }

    const payload: any = {
      title,
      description: description || undefined,
      priority,
      status: status || "To Do",
      assignedToId: assignedToId || undefined,
    };

    if (dueDate) {
      payload.dueDate = new Date(dueDate);
    }

    const task = await service.createTask(userId, payload);

    io.emit("taskCreated", task);

    if (task.assignedToId) {
      const notification = await Notification.create({
        user: task.assignedToId.toString(),
        message: `You were assigned to task "${task.title}"`,
      });

      io.to(task.assignedToId.toString()).emit(
        "notification:new",
        notification
      );
    }

    res.status(201).json(task);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/* ================= UPDATE TASK ================= */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const dto = req.body;
    const taskId = req.params.id;

    const oldTask = await service.getTaskById(taskId);
    if (!oldTask) return res.status(404).json({ message: "Task not found" });

    const updatedTask = await service.updateTask(taskId, dto);

    io.emit("taskUpdated", updatedTask);

    if (
      dto.assignedToId &&
      oldTask.assignedToId?.toString() !== dto.assignedToId &&
      updatedTask?.assignedToId
    ) {
      const notification = await Notification.create({
        user: updatedTask.assignedToId.toString(),
        message: `You were assigned to task "${updatedTask.title}"`,
      });

      io.to(updatedTask.assignedToId.toString()).emit(
        "notification:new",
        notification
      );
    }

    res.json(updatedTask);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE TASK ================= */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    await service.deleteTask(taskId);

    io.emit("taskDeleted", { id: taskId });
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET TASKS ================= */
export const getTasks = async (req: Request, res: Response) => {
  try {
    const filters: any = {};

    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.assignedToId) {
      filters.assignedToId = new Types.ObjectId(
        req.query.assignedToId as string
      );
    }

    const tasks = await service.getTasks(filters);
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
