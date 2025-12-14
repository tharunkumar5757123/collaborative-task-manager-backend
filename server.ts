import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import { socketHandler } from "./sockets";

dotenv.config();
connectDB();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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
server.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
export default server;