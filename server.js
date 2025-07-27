require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const collaboratorRoutes = require('./routes/collaborators.routes');
const jwt = require("jsonwebtoken"); // Add for JWT verification

// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const projectCollaboration = require("./routes/collaborationProject.routes");
const artistRoutes = require("./routes/artist.routes");
const messageRoutes = require("./routes/messageRoutes");

// Socket controller
const socketController = require("./controllers/socketController");

// Create Express app
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = socketIO(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://poize-music-front.vercel.app"
    ],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://poize-music-front.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json());


// Keep track of online users
const onlineUsers = {};

// JWT authentication middleware for sockets
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error: No token provided"));

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error("Authentication error"));
      socket.user = decoded;
      next();
    });
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

// Handle new socket connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.id}`);
  
  // Add user to online list
  onlineUsers[socket.user.id] = true;
  io.emit("online_users", onlineUsers);
  
  // Join user's personal room
  socket.join(`user_${socket.user.id}`);
  
  // Handle socket events with controller
  socketController(io, socket, onlineUsers);
  
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.id}`);
    delete onlineUsers[socket.user.id];
    io.emit("online_users", onlineUsers);
  });
});


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", artistRoutes);
app.use("/api/collaboration", projectCollaboration);
app.use('/api/messages', messageRoutes);
app.use('/api/collaborators', collaboratorRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "http://localhost";

server.listen(PORT, () => {
  console.clear();
  console.log("======================================");
  console.log("🚀 Server is running!");
  console.log("🔗 Base URL:", `${HOST}:${PORT}`);
  console.log("📁 Auth Route:", `${HOST}:${PORT}/api/auth`);
  console.log("📁 Messages API:", `${HOST}:${PORT}/api/messages`);
  console.log("📡 Socket.IO Ready on same port");
  console.log("🌱 Environment:", process.env.NODE_ENV || "development");
  console.log("======================================");
});