/**
 * routes/auth.routes.js
 * @description Authentication-related route definitions.
 */

const express = require("express");
const router = express.Router();
const { login, refreshToken, logout, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/refresh
router.post("/refresh", refreshToken);

// POST /api/auth/logout  (protected)
router.post("/logout", protect, logout);

// GET /api/auth/me  (protected)
router.get("/me", protect, getMe);

module.exports = router;
