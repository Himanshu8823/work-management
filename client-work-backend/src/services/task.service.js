/**
 * task.service.js
 * @description Encapsulates task CRUD, filtering, and status update logic.
 */

const Task = require("../models/Task");
const Client = require("../models/Client");
const { AppError } = require("../utils/helpers");

/**
 * Returns paginated tasks with optional filter params.
 * @param {{ status?: string; client?: string; priority?: string; search?: string; page?: string | number; limit?: string | number }} query
 */
const getAllTasks = async (query) => {
  const { status, client, priority, search, page = 1, limit = 20 } = query;

  const filter = {};

  if (status) filter.status = status;
  if (client) filter.client = client;
  if (priority) filter.priority = priority;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("client", "name email companyName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

/**
 * Returns a task by id with selected client details.
 * @param {string} id
 */
const getTaskById = async (id) => {
  const task = await Task.findById(id).populate("client", "name email companyName");
  if (!task) throw new AppError("Task not found.", 404);
  return task;
};

/**
 * Creates a task after verifying related client exists.
 * @param {{ title: string; description?: string; status?: string; client: string; priority?: string; dueDate?: string | Date }} data
 */
const createTask = async (data) => {
  // Verify client exists
  const clientExists = await Client.findById(data.client);
  if (!clientExists) throw new AppError("Client not found.", 404);

  const task = await Task.create({
    title: data.title.trim(),
    description: data.description?.trim() || null,
    status: data.status || "Pending",
    client: data.client,
    priority: data.priority || "Medium",
    dueDate: data.dueDate || null,
  });

  return task.populate("client", "name email companyName");
};

/**
 * Updates editable task fields.
 * @param {string} id
 * @param {Record<string, any>} data
 */
const updateTask = async (id, data) => {
  const task = await Task.findById(id);
  if (!task) throw new AppError("Task not found.", 404);

  // If updating client, verify it exists
  if (data.client && data.client !== String(task.client)) {
    const clientExists = await Client.findById(data.client);
    if (!clientExists) throw new AppError("Client not found.", 404);
  }

  const allowedFields = ["title", "description", "status", "client", "priority", "dueDate"];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      task[field] = typeof data[field] === "string" && field !== "client"
        ? data[field].trim()
        : data[field];
    }
  });

  await task.save();
  return task.populate("client", "name email companyName");
};

/**
 * Updates only the task status field.
 * @param {string} id
 * @param {string} status
 */
const updateTaskStatus = async (id, status) => {
  const validStatuses = ["Pending", "In Progress", "Completed"];
  if (!validStatuses.includes(status)) {
    throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`, 400);
  }

  const task = await Task.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).populate("client", "name email companyName");

  if (!task) throw new AppError("Task not found.", 404);
  return task;
};

/**
 * Deletes a task by id.
 * @param {string} id
 * @returns {Promise<void>}
 */
const deleteTask = async (id) => {
  const task = await Task.findById(id);
  if (!task) throw new AppError("Task not found.", 404);
  await task.deleteOne();
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
