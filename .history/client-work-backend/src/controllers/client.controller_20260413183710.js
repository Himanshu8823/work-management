/**
 * client.controller.js
 * @description HTTP handlers for client resources.
 */

const clientService = require("../services/client.service");
const { validateCreateClient, validateUpdateClient } = require("../validators");
const { asyncHandler, sendSuccess, sendError } = require("../utils/helpers");

/** @type {import("express").RequestHandler} */
const getAllClients = asyncHandler(async (req, res) => {
  const result = await clientService.getAllClients(req.query);
  sendSuccess(res, 200, "Clients fetched successfully", result);
});

/** @type {import("express").RequestHandler} */
const getClientById = asyncHandler(async (req, res) => {
  const client = await clientService.getClientById(req.params.id);
  sendSuccess(res, 200, "Client fetched successfully", { client });
});

/** @type {import("express").RequestHandler} */
const getClientWithTasks = asyncHandler(async (req, res) => {
  const result = await clientService.getClientWithTasks(req.params.id);
  sendSuccess(res, 200, "Client details fetched successfully", result);
});

/** @type {import("express").RequestHandler} */
const getClientStats = asyncHandler(async (req, res) => {
  const stats = await clientService.getClientStats(req.params.id);
  sendSuccess(res, 200, "Client stats fetched successfully", { stats });
});

/** @type {import("express").RequestHandler} */
const createClient = asyncHandler(async (req, res) => {
  const { errors, isValid } = validateCreateClient(req.body);
  if (!isValid) return sendError(res, 400, "Validation failed", errors);

  const client = await clientService.createClient(req.body);
  sendSuccess(res, 201, "Client created successfully", { client });
});

/** @type {import("express").RequestHandler} */
const updateClient = asyncHandler(async (req, res) => {
  const { errors, isValid } = validateUpdateClient(req.body);
  if (!isValid) return sendError(res, 400, "Validation failed", errors);

  const client = await clientService.updateClient(req.params.id, req.body);
  sendSuccess(res, 200, "Client updated successfully", { client });
});

/** @type {import("express").RequestHandler} */
const deleteClient = asyncHandler(async (req, res) => {
  await clientService.deleteClient(req.params.id);
  sendSuccess(res, 200, "Client and associated tasks deleted successfully");
});

module.exports = {
  getAllClients,
  getClientById,
  getClientWithTasks,
  getClientStats,
  createClient,
  updateClient,
  deleteClient,
};
