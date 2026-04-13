/**
 * client.service.js
 * @description Encapsulates client CRUD and related client-task aggregation logic.
 */

const Client = require("../models/Client");
const Task = require("../models/Task");
const { AppError } = require("../utils/helpers");

/**
 * Returns paginated clients with optional search and status filters.
 * @param {{ search?: string; page?: string | number; limit?: string | number; isActive?: string }} query
 */
const getAllClients = async (query) => {
  const { search, page = 1, limit = 20, isActive } = query;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } },
    ];
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [clients, total] = await Promise.all([
    Client.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Client.countDocuments(filter),
  ]);

  return {
    clients,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

/**
 * Returns one client by id.
 * @param {string} id
 */
const getClientById = async (id) => {
  const client = await Client.findById(id);
  if (!client) throw new AppError("Client not found.", 404);
  return client;
};

/**
 * Returns one client with all its tasks.
 * @param {string} id
 */
const getClientWithTasks = async (id) => {
  const client = await Client.findById(id);
  if (!client) throw new AppError("Client not found.", 404);

  const tasks = await Task.find({ client: id }).sort({ createdAt: -1 });
  return { client, tasks };
};

/**
 * Creates a new client after basic normalization.
 * @param {{ name: string; email: string; companyName?: string; phone?: string; notes?: string }} data
 */
const createClient = async (data) => {
  const client = await Client.create({
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    companyName: data.companyName?.trim() || null,
    phone: data.phone?.trim() || null,
    notes: data.notes?.trim() || null,
  });
  return client;
};

/**
 * Updates editable client fields.
 * @param {string} id
 * @param {Record<string, any>} data
 */
const updateClient = async (id, data) => {
  const client = await Client.findById(id);
  if (!client) throw new AppError("Client not found.", 404);

  const allowedFields = ["name", "email", "companyName", "phone", "notes", "isActive"];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      client[field] = typeof data[field] === "string" ? data[field].trim() : data[field];
    }
  });

  await client.save();
  return client;
};

/**
 * Deletes a client and all associated tasks.
 * @param {string} id
 * @returns {Promise<void>}
 */
const deleteClient = async (id) => {
  const client = await Client.findById(id);
  if (!client) throw new AppError("Client not found.", 404);

  // Delete all related tasks
  await Task.deleteMany({ client: id });
  await client.deleteOne();
};

/**
 * Builds per-client task status statistics.
 * @param {string} id
 */
const getClientStats = async (id) => {
  const client = await Client.findById(id);
  if (!client) throw new AppError("Client not found.", 404);

  const stats = await Task.aggregate([
    { $match: { client: client._id } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = { total: 0, Pending: 0, "In Progress": 0, Completed: 0 };
  stats.forEach(({ _id, count }) => {
    result[_id] = count;
    result.total += count;
  });

  return result;
};

module.exports = {
  getAllClients,
  getClientById,
  getClientWithTasks,
  createClient,
  updateClient,
  deleteClient,
  getClientStats,
};
