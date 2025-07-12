require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors"); // ⬅️ Import CORS
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://poize-music-front.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

// Port and Host Info
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "http://localhost";

// Start Server
app.listen(PORT, () => {
  console.clear();
  console.log("======================================");
  console.log("🚀 Server is running!");
  console.log("🔗 Base URL:", `${HOST}:${PORT}`);
  console.log("📁 Auth Route:", `${HOST}:${PORT}/api/auth`);
  console.log("🌱 Environment:", process.env.NODE_ENV || "development");
  console.log("======================================");
});
