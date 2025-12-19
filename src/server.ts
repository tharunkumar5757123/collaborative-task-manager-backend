import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";

dotenv.config();
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Create and export Socket.IO instance
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://6944ee6621eeb000084980d4--friendly-sprite-b8bfc2.netlify.app",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});

// Socket connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
