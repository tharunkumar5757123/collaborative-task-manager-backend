import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import { socketHandler } from "./sockets";

dotenv.config();
connectDB();

const server = http.createServer(app);

/* =======================
   SOCKET.IO CONFIG
======================= */
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://collaborative-task-manager-frontend.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;

  if (userId) {
    socket.join(userId);
  }

  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
