import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5003;

// connect DB
connectDB();

// start server
app.listen(PORT, () => {
  console.log(`Feed Service running on port ${PORT}`);
});