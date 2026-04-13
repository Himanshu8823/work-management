/**
 * auth.service.js
 * @description Business logic for admin authentication, token refresh, logout, and profile lookup.
 */

const Admin = require("../models/Admin");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshCookieOptions,
  clearRefreshCookieOptions,
} = require("../utils/jwt");
const { AppError } = require("../utils/helpers");

/**
 * Validates admin credentials and issues new token pair.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{accessToken: string, refreshToken: string, admin: {id: import("mongoose").Types.ObjectId, name: string, email: string}}>} 
 */
const loginService = async (email, password) => {
  // Find admin (select password explicitly since it's excluded by default)
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
    "+password +refreshToken"
  );

  if (!admin) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isPasswordCorrect = await admin.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password.", 401);
  }

  // Generate tokens
  const payload = { id: admin._id };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Save hashed refresh token to DB
  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });

  return {
    accessToken,
    refreshToken,
    admin: { id: admin._id, name: admin.name, email: admin.email },
  };
};

/**
 * Validates refresh token and returns a new access token.
 * @param {string | undefined} token
 * @returns {Promise<{accessToken: string}>}
 */
const refreshTokenService = async (token) => {
  if (!token) throw new AppError("Refresh token not provided.", 401);

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError("Invalid or expired refresh token.", 401);
  }

  const admin = await Admin.findById(decoded.id).select("+refreshToken");
  if (!admin || admin.refreshToken !== token) {
    throw new AppError("Refresh token is invalid or has been revoked.", 401);
  }

  const accessToken = generateAccessToken({ id: admin._id });
  return { accessToken };
};

/**
 * Revokes admin refresh token in persistence layer.
 * @param {string} adminId
 * @returns {Promise<void>}
 */
const logoutService = async (adminId) => {
  await Admin.findByIdAndUpdate(adminId, { refreshToken: null });
};

/**
 * Loads admin profile by id.
 * @param {string} adminId
 * @returns {Promise<import("mongoose").Document>}
 */
const getMeService = async (adminId) => {
  const admin = await Admin.findById(adminId);
  if (!admin) throw new AppError("Admin not found.", 404);
  return admin;
};

module.exports = { loginService, refreshTokenService, logoutService, getMeService };
