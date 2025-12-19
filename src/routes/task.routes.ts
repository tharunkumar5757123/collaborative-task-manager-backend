import { Router } from "express";
import { createTask, updateTask, deleteTask, getTasks } from "../controllers/task.controller";
import { authMiddleware, authorizeTaskOwner } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createTask);
router.get("/", getTasks);
router.patch("/:id", authorizeTaskOwner, updateTask); // only owner can update
router.delete("/:id", authorizeTaskOwner, deleteTask); // only owner can delete

export default router;
