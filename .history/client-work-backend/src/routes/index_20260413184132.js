/**
 * routes/index.js
 * @description Central router that mounts all API route modules.
 */

const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const clientRoutes = require("./client.routes");
const taskRoutes = require("./task.routes");
const dashboardRoutes = require("./dashboard.routes");

router.use("/auth", authRoutes);
router.use("/clients", clientRoutes);
router.use("/tasks", taskRoutes);
router.use("/dashboard", dashboardRoutes);

// Lightweight health endpoint for uptime probes.
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Client Work Management API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

module.exports = router;
