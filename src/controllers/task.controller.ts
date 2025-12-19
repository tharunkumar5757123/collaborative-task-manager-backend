import { Response } from "express";
import TaskModel, { ITask } from "../models/task.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import {io} from "../server";

// CREATE TASK
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
      creatorId: userId,
      assignedToId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    const task = await TaskModel.create(taskData);
    io.emit("taskCreated", task);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET TASKS
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await TaskModel.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE TASK
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const updatedTask = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    io.emit("taskUpdated", updatedTask);
    res.json(updatedTask);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE TASK
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    await TaskModel.findByIdAndDelete(req.params.id);
    io.emit("taskDeleted", { id: req.params.id });
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
