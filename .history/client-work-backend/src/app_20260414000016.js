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

const parseAllowedOrigins = () => {
  const envOrigins = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URL_PROD,
    process.env.CLIENT_URLS,
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaults = ["http://localhost:5173", "http://127.0.0.1:5173"];

  return new Set([...defaults, ...envOrigins]);
};

const allowedOrigins = parseAllowedOrigins();
const allowedOriginPatterns = [/^https:\/\/work-management(?:-[a-z0-9-]+)?\.vercel\.app$/i];

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (no Origin header) and allowlisted browser origins.
    const isPatternMatch = origin
      ? allowedOriginPatterns.some((pattern) => pattern.test(origin))
      : false;

    if (!origin || allowedOrigins.has(origin) || isPatternMatch) {
      return callback(null, true);
    }

    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ─── Security Headers ───────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ───────────────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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
