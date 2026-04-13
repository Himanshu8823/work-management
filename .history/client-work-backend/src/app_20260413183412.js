/**
 * app.js
 * @description Builds the Express application with security, parsing, routing, and global error handling.
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const routes = require("./routes");
const { errorHandler } = require("./middleware/errorHandler");
const { generalLimiter } = require("./middleware/rateLimiter");

/** @type {import("express").Express} */
const app = express();

// ─── Security Headers ───────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ───────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // allow cookies (refresh token)
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ─── Sanitize MongoDB Operators ──────────────────────────────────────────────
app.use(mongoSanitize());

// ─── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Rate Limiting ───────────────────────────────────────────────────────────
app.use("/api", generalLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api", routes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
