import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";
import socketHandler from "./socket/socket.js";

dotenv.config();

const server = http.createServer(app);

// socket setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// socket logic
socketHandler(io);

// DB connect
connectDB();

const PORT = process.env.PORT || 5007;

server.listen(PORT, () => {
  console.log(`Chat Service running on port ${PORT}`);
});