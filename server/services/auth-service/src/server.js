import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

const PORT = process.env.PORT || 5001;

console.log("Starting Auth Service...");
console.log("Port:", PORT);

const server = app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});