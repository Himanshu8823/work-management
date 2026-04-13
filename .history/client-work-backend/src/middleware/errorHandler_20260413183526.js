/**
 * errorHandler.js
 * @description Normalizes operational/runtime errors into consistent API responses.
 */

const { AppError } = require("../utils/helpers");

/**
 * Converts Mongoose cast errors (invalid ObjectId, etc.) into a client-safe AppError.
 * @param {Error & { path?: string; value?: unknown }} err
 * @returns {AppError}
 */
const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

/**
 * Converts Mongo duplicate key errors into a conflict AppError.
 * @param {{ keyValue: Record<string, unknown> }} err
 * @returns {AppError}
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`${field} "${value}" already exists. Please use a different value.`, 409);
};

/**
 * Converts Mongoose schema validation errors into a single readable message.
 * @param {{ errors: Record<string, { message: string }> }} err
 * @returns {AppError}
 */
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${messages.join(". ")}`, 400);
};

/**
 * Global Express error middleware.
 * @param {any} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message, name: err.name };

  // Mongoose errors → operational errors
  if (error.name === "CastError") error = handleCastError(error);
  if (error.code === 11000) error = handleDuplicateKeyError(error);
  if (error.name === "ValidationError") error = handleValidationError(error);

  const statusCode = error.statusCode || 500;
  const isOperational = error.isOperational || false;

  // Log unexpected errors
  if (!isOperational) {
    console.error("💥 UNEXPECTED ERROR:", err);
  }

  res.status(statusCode).json({
    success: false,
    message: isOperational ? error.message : "Something went wrong. Please try again.",
    ...(process.env.NODE_ENV === "development" && !isOperational && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
