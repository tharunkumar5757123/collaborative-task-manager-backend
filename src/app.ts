import express from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";
// import authRoutes from "../repositories/routes/auth.routes";
// import taskRoutes from "./src/repositories/routes/task.routes";
// import notificationRoutes from "./src/repositories/routes/notification.routes";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import notificationRoutes from "./routes/notification.routes";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/notifications", notificationRoutes);

app.get("/", (_, res) => res.send("Task Manager API Running"));

export default app;
