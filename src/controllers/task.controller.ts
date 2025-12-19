import { Response } from "express";
import TaskModel, { ITask } from "../models/task.model";
import Notification from "../models/notification.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { io } from "../server";

/* CREATE TASK */
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, dueDate, priority, assignedToId, status } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const taskData: Partial<ITask> = {
      title,
      description,
      priority,
      status: status || "To Do",
      assignedToId,
      creatorId: userId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    const task = await TaskModel.create(taskData);

    io.emit("taskCreated", task);

    // Notify assigned user
    if (assignedToId) {
      const notification = await Notification.create({
        user: assignedToId,
        message: `You were assigned to task "${task.title}"`,
      });
      io.to(assignedToId.toString()).emit("notification:new", notification);
    }

    res.status(201).json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE TASK */
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;

    const oldTask = await TaskModel.findById(taskId);
    if (!oldTask) return res.status(404).json({ message: "Task not found" });

    const updatedTask = await TaskModel.findByIdAndUpdate(taskId, updates, { new: true });

    io.emit("taskUpdated", updatedTask);

    // Notify newly assigned user
    if (updates.assignedToId && oldTask.assignedToId?.toString() !== updates.assignedToId) {
      const notification = await Notification.create({
        user: updates.assignedToId,
        message: `You were assigned to task "${updatedTask?.title}"`,
      });
      io.to(updates.assignedToId.toString()).emit("notification:new", notification);
    }

    res.json(updatedTask);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE TASK */
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = req.params.id;
    await TaskModel.findByIdAndDelete(taskId);

    io.emit("taskDeleted", { id: taskId });
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* GET TASKS */
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const filters: any = {};
    const { status, priority, assignedToId } = req.query;

    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (assignedToId) filters.assignedToId = assignedToId;

    const tasks = await TaskModel.find(filters).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
