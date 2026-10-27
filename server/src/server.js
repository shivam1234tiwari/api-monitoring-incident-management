
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import monitoredAPIRoutes from "./routes/monitoredAPIRoutes.js";
import { startMonitoringScheduler } from "./services/monitoringScheduler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/monitored-apis", monitoredAPIRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Monitoring Platform backend is running!",
  });
});

// Server Health Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    startMonitoringScheduler();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
