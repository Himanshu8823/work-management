/**
 * routes/client.routes.js
 * @description Client resource routes; all endpoints require authentication.
 */

const express = require("express");
const router = express.Router();
const {
  getAllClients,
  getClientById,
  getClientWithTasks,
  getClientStats,
  createClient,
  updateClient,
  deleteClient,
} = require("../controllers/client.controller");
const { protect } = require("../middleware/auth");

// All client routes are protected
router.use(protect);

// GET  /api/clients            - list all clients (supports ?search=, ?page=, ?limit=, ?isActive=)
// POST /api/clients            - create a client
router.route("/").get(getAllClients).post(createClient);

// GET    /api/clients/:id           - get single client
// PATCH  /api/clients/:id           - update client
// DELETE /api/clients/:id           - delete client + its tasks
router.route("/:id").get(getClientById).patch(updateClient).delete(deleteClient);

// GET /api/clients/:id/tasks   - get client + all their tasks
router.get("/:id/tasks", getClientWithTasks);

// GET /api/clients/:id/stats   - task stats for a client
router.get("/:id/stats", getClientStats);

module.exports = router;
