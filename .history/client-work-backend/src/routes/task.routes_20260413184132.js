/**
 * routes/task.routes.js
 * @description Task resource routes; all endpoints require authentication.
 */

const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/task.controller");
const { protect } = require("../middleware/auth");

// All task routes are protected
router.use(protect);

// GET  /api/tasks     - list all tasks (supports ?status=, ?client=, ?priority=, ?search=, ?page=, ?limit=)
// POST /api/tasks     - create a task
router.route("/").get(getAllTasks).post(createTask);

// GET    /api/tasks/:id   - get single task
// PATCH  /api/tasks/:id   - update task (full update)
// DELETE /api/tasks/:id   - delete task
router.route("/:id").get(getTaskById).patch(updateTask).delete(deleteTask);

// PATCH /api/tasks/:id/status  - update status only (quick action)
router.patch("/:id/status", updateTaskStatus);

module.exports = router;
