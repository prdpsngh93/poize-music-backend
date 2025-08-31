require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const collaboratorRoutes = require('./routes/collaborators.routes');
const jwt = require("jsonwebtoken");
const venueRoutes = require('./routes/venue.routes');
const venueGigRequestRoutes = require("./routes/venue_gig_request.routes");
const Razorpay = require("razorpay");
const contributorGigsRequestRoutes = require("./routes/contributor_gigs_request.routes");
const Stripe = require("stripe");
const router = express.Router();




// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const projectCollaboration = require("./routes/collaborationProject.routes");
const artistRoutes = require("./routes/artist.routes");
const messageRoutes = require("./routes/messageRoutes");
const musicLoverRoutes = require('./routes/music_lover.routes');
const venueGigRoutes = require('./routes/venue_gigs.routes');
const contributorGigRoutes = require('./routes/gigs_contributer.routes');
const notificationRoutes = require("./routes/notification.routes");


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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


app.get("/api/payment/:id", async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.id);
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// router.post("/create-payment-intent", async (req, res) => {
//   try {
//     const { amount } = req.body; // amount in cents

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//     });

//     res.json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body; // amount in cents, currency with default

    // Validate required fields
    if (!amount) {
      return res.status(400).json({ 
        error: "Amount is required" 
      });
    }

    // Optional: Validate currency format (ISO 4217 codes are 3 characters)
    if (currency && currency.length !== 3) {
      return res.status(400).json({ 
        error: "Currency must be a valid 3-character ISO code (e.g., 'usd', 'eur', 'gbp')" 
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(), // Stripe expects lowercase currency codes
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment Intent Error:", error);
    res.status(500).json({ error: error.message });
  }
});


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/collaboration", projectCollaboration);
app.use('/api/messages', messageRoutes);
app.use('/api/collaborators', collaboratorRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/music-lovers', musicLoverRoutes);
app.use('/api/venue-gigs', venueGigRoutes);
app.use('/api/contributor-gigs', contributorGigRoutes);
app.use("/api/venue-gig-requests", venueGigRequestRoutes);
app.use("/api/contributor-gigs-requests", contributorGigsRequestRoutes);
app.use("/api/stripe", router);
app.use("/api/notifications", notificationRoutes);


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