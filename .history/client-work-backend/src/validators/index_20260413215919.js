/**
 * validators/index.js
 * @description Input validation helpers used by auth, client, and task controllers.
 */

const validator = require("validator");

// ─── Auth Validators ────────────────────────────────────────────────────────

const validateLogin = (data) => {
  const errors = {};

  if (!data.email || typeof data.email !== "string") {
    errors.email = "Email is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password || typeof data.password !== "string") {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

// ─── Client Validators ───────────────────────────────────────────────────────

const validateCreateClient = (data) => {
  const errors = {};

  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    errors.name = "Client name is required";
  } else if (data.name.trim().length > 150) {
    errors.name = "Name cannot exceed 150 characters";
  }

  if (!data.email || typeof data.email !== "string") {
    errors.email = "Email is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.companyName || typeof data.companyName !== "string" || !data.companyName.trim()) {
    errors.companyName = "Company name is required";
  } else if (data.companyName.trim().length > 200) {
    errors.companyName = "Company name cannot exceed 200 characters";
  }

  if (!data.phone || typeof data.phone !== "string" || !data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!validator.isMobilePhone(data.phone, "any", { strictMode: false })) {
    errors.phone = "Invalid phone number";
  }

  if (data.notes && data.notes.length > 1000) {
    errors.notes = "Notes cannot exceed 1000 characters";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

const validateUpdateClient = (data) => {
  const errors = {};

  if (data.name !== undefined) {
    if (!data.name.trim()) errors.name = "Name cannot be empty";
    else if (data.name.trim().length > 150) errors.name = "Name cannot exceed 150 characters";
  }

  if (data.email !== undefined) {
    if (!validator.isEmail(data.email)) errors.email = "Invalid email format";
  }

  if (data.companyName !== undefined && data.companyName && data.companyName.length > 200) {
    errors.companyName = "Company name cannot exceed 200 characters";
  }

  if (data.phone !== undefined && data.phone && !validator.isMobilePhone(data.phone, "any", { strictMode: false })) {
    errors.phone = "Invalid phone number";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

// ─── Task Validators ─────────────────────────────────────────────────────────

const VALID_STATUSES = ["Pending", "In Progress", "Completed"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

const validateCreateTask = (data) => {
  const errors = {};

  if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
    errors.title = "Task title is required";
  } else if (data.title.trim().length > 250) {
    errors.title = "Title cannot exceed 250 characters";
  }

  if (data.description && data.description.length > 2000) {
    errors.description = "Description cannot exceed 2000 characters";
  }

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.status = `Status must be one of: ${VALID_STATUSES.join(", ")}`;
  }

  if (!data.client || typeof data.client !== "string") {
    errors.client = "Client is required";
  } else if (!validator.isMongoId(data.client)) {
    errors.client = "Invalid client ID";
  }

  if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
    errors.priority = `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`;
  }

  if (data.dueDate && !validator.isISO8601(data.dueDate)) {
    errors.dueDate = "Invalid date format";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

const validateUpdateTask = (data) => {
  const errors = {};

  if (data.title !== undefined) {
    if (!data.title.trim()) errors.title = "Title cannot be empty";
    else if (data.title.trim().length > 250) errors.title = "Title cannot exceed 250 characters";
  }

  if (data.status !== undefined && !VALID_STATUSES.includes(data.status)) {
    errors.status = `Status must be one of: ${VALID_STATUSES.join(", ")}`;
  }

  if (data.priority !== undefined && !VALID_PRIORITIES.includes(data.priority)) {
    errors.priority = `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`;
  }

  if (data.client !== undefined && !validator.isMongoId(data.client)) {
    errors.client = "Invalid client ID";
  }

  if (data.dueDate !== undefined && data.dueDate && !validator.isISO8601(data.dueDate)) {
    errors.dueDate = "Invalid date format";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

module.exports = {
  validateLogin,
  validateCreateClient,
  validateUpdateClient,
  validateCreateTask,
  validateUpdateTask,
};
