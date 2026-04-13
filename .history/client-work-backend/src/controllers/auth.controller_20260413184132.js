/**
 * auth.controller.js
 * @description Authentication controller for admin sessions.
 * @module controllers/auth
 */

const {
  loginService,
  refreshTokenService,
  logoutService,
  getMeService,
} = require("../services/auth.service");
const { validateLogin } = require("../validators");
const { asyncHandler, sendSuccess, sendError } = require("../utils/helpers");
const { getRefreshCookieOptions, clearRefreshCookieOptions } = require("../utils/jwt");

/**
 * Authenticate admin credentials and issue access/refresh tokens.
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>}
 */
const login = asyncHandler(async (req, res) => {
  const { errors, isValid } = validateLogin(req.body);
  if (!isValid) return sendError(res, 400, "Validation failed", errors);

  const { accessToken, refreshToken, admin } = await loginService(
    req.body.email,
    req.body.password
  );

  res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

  sendSuccess(res, 200, "Login successful", { accessToken, admin });
});

/**
 * Issue a new access token using the refresh token from secure cookie.
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>}
 */
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { accessToken } = await refreshTokenService(token);
  sendSuccess(res, 200, "Token refreshed", { accessToken });
});

/**
 * Invalidate the current admin refresh token and clear session cookie.
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>}
 */
const logout = asyncHandler(async (req, res) => {
  await logoutService(req.admin.id);
  res.clearCookie("refreshToken", clearRefreshCookieOptions());
  sendSuccess(res, 200, "Logged out successfully");
});

/**
 * Return the authenticated admin profile.
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>}
 */
const getMe = asyncHandler(async (req, res) => {
  const admin = await getMeService(req.admin.id);
  sendSuccess(res, 200, "Admin profile fetched", { admin });
});

module.exports = { login, refreshToken, logout, getMe };
