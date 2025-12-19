import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app";
import mongoose from "mongoose";

dotenv.config();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const server = http.createServer(app);

// Socket.IO
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://collaborative-task-manager-frontend.onrender.com",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;
  if (userId) socket.join(userId);
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
