/**
 * dashboard.controller.js
 * @description Provides aggregate dashboard metrics for admins.
 */

const Client = require("../models/Client");
const Task = require("../models/Task");
const { asyncHandler, sendSuccess } = require("../utils/helpers");

/** @type {import("express").RequestHandler} */
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalClients,
    totalTasks,
    tasksByStatus,
    recentTasks,
    recentClients,
  ] = await Promise.all([
    // Total active clients
    Client.countDocuments({ isActive: true }),

    // Total tasks
    Task.countDocuments(),

    // Tasks grouped by status
    Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),

    // Recent 10 tasks with client info
    Task.find()
      .populate("client", "name companyName email")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt client"),

    // Recent 5 clients
    Client.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email companyName createdAt"),
  ]);

  // Transform tasksByStatus array into an object
  const statusMap = { Pending: 0, "In Progress": 0, Completed: 0 };
  tasksByStatus.forEach(({ _id, count }) => {
    statusMap[_id] = count;
  });

  sendSuccess(res, 200, "Dashboard stats fetched successfully", {
    stats: {
      totalClients,
      totalTasks,
      pendingTasks: statusMap["Pending"],
      inProgressTasks: statusMap["In Progress"],
      completedTasks: statusMap["Completed"],
    },
    recentTasks,
    recentClients,
  });
});

module.exports = { getDashboardStats };
