/**
 * helpers.js
 * @description Shared helper utilities for error handling and standard API responses.
 */

// Custom error class
class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Wrap async route handlers to catch errors
/**
 * Wraps async Express handlers and forwards rejections to the error middleware.
 * @param {import("express").RequestHandler} fn
 * @returns {import("express").RequestHandler}
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Standard API response helpers
/**
 * Sends a standard success payload.
 * @param {import("express").Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {unknown} [data=null]
 */
const sendSuccess = (res, statusCode, message, data = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  res.status(statusCode).json(response);
};

/**
 * Sends a standard error payload.
 * @param {import("express").Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {Record<string, unknown> | null} [errors=null]
 */
const sendError = (res, statusCode, message, errors = null) => {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  res.status(statusCode).json(response);
};

module.exports = { AppError, asyncHandler, sendSuccess, sendError };
