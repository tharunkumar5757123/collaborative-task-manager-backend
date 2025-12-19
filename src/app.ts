import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import notificationRoutes from "./routes/notification.routes";

const app = express();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://6944ee6621eeb000084980d4--friendly-sprite-b8bfc2.netlify.app",
];

// ✅ CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true, // allow cookies
  })
);

// Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// Root
app.get("/", (_, res) => res.send("Task Manager API Running"));

export default app;
