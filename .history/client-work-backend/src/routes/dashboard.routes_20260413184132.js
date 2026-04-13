/**
 * routes/dashboard.routes.js
 * @description Dashboard metrics route definitions.
 */

const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboard.controller");
const { protect } = require("../middleware/auth");

// GET /api/dashboard
router.get("/", protect, getDashboardStats);

module.exports = router;
