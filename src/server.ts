import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";

dotenv.config();
connectDB(); // Connect to MongoDB

const server = http.createServer(app);

// Socket.IO setup
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
  console.log("User connected:", socket.id);
  const userId = socket.handshake.auth?.userId;
  if (userId) socket.join(userId);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
