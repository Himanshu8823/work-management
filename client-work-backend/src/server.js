/**
 * server.js
 * @description Application entrypoint: loads env, connects DB, starts HTTP server, and handles graceful shutdown.
 */

require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 5000;

/**
 * Bootstraps database + HTTP server lifecycle.
 * @returns {Promise<void>}
 */
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
    console.log(`Health Check: http://localhost:${PORT}/api/health\n`);
  });

  // Graceful shutdown
  /**
   * Stops accepting new requests and exits the process.
   * @param {string} signal - OS signal name.
   * @returns {void}
   */
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("✅ HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (err) => {
    console.error(" Unhandled Rejection:", err.name, err.message);
    server.close(() => process.exit(1));
  });
};

startServer();
