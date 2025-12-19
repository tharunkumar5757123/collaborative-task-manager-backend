import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import notificationRoutes from "./routes/notification.routes";

const app = express();

// ✅ CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://collaborative-task-manager-frontend.onrender.com",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], // include PATCH
    allowedHeaders: ["Content-Type", "Authorization"], // add if sending JWT in headers
    credentials: true, // allow cookies
  })
);

// Handle preflight requests for all routes
app.options("*", cors()); // ensures OPTIONS request responds correctly

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/notifications", notificationRoutes);

app.get("/", (_, res) => res.send("Task Manager API Running"));

export default app;
