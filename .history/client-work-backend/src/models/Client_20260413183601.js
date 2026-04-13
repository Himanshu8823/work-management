/**
 * Client model
 * @description Represents a customer profile managed by admins.
 */

const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [150, "Name cannot exceed 150 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: [200, "Company name cannot exceed 200 characters"],
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: total tasks count
clientSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "client",
  count: false,
});

// Indexes
clientSchema.index({ name: "text", email: "text", companyName: "text" });
clientSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Client", clientSchema);
