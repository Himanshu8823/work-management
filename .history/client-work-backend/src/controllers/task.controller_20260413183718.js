/**
 * task.controller.js
 * @description HTTP handlers for task resources.
 */

const taskService = require("../services/task.service");
const { validateCreateTask, validateUpdateTask } = require("../validators");
const { asyncHandler, sendSuccess, sendError } = require("../utils/helpers");

/** @type {import("express").RequestHandler} */
const getAllTasks = asyncHandler(async (req, res) => {
  const result = await taskService.getAllTasks(req.query);
  sendSuccess(res, 200, "Tasks fetched successfully", result);
});

/** @type {import("express").RequestHandler} */
const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);
  sendSuccess(res, 200, "Task fetched successfully", { task });
});

/** @type {import("express").RequestHandler} */
const createTask = asyncHandler(async (req, res) => {
  const { errors, isValid } = validateCreateTask(req.body);
  if (!isValid) return sendError(res, 400, "Validation failed", errors);

  const task = await taskService.createTask(req.body);
  sendSuccess(res, 201, "Task created successfully", { task });
});

/** @type {import("express").RequestHandler} */
const updateTask = asyncHandler(async (req, res) => {
  const { errors, isValid } = validateUpdateTask(req.body);
  if (!isValid) return sendError(res, 400, "Validation failed", errors);

  const task = await taskService.updateTask(req.params.id, req.body);
  sendSuccess(res, 200, "Task updated successfully", { task });
});

/** @type {import("express").RequestHandler} */
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) return sendError(res, 400, "Validation failed", { status: "Status is required" });

  const task = await taskService.updateTaskStatus(req.params.id, status);
  sendSuccess(res, 200, "Task status updated successfully", { task });
});

/** @type {import("express").RequestHandler} */
const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id);
  sendSuccess(res, 200, "Task deleted successfully");
});

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
