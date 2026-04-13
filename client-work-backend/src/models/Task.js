/**
 * Task model
 * @description Represents work items assigned to a client.
 */

const mongoose = require("mongoose");

const TASK_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [250, "Title cannot exceed 250 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(TASK_STATUS),
        message: `Status must be one of: ${Object.values(TASK_STATUS).join(", ")}`,
      },
      default: TASK_STATUS.PENDING,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client is required"],
    },
    dueDate: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
taskSchema.index({ client: 1, status: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Task", taskSchema);
module.exports.TASK_STATUS = TASK_STATUS;
