/**
 * auth.js
 * @description Authentication middleware that validates bearer access tokens and attaches admin context.
 */

const { verifyAccessToken } = require("../utils/jwt");
const Admin = require("../models/Admin");
const { AppError, asyncHandler } = require("../utils/helpers");

/**
 * Protects private routes by verifying JWT and loading the admin identity.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {Promise<void>}
 */
const protect = asyncHandler(async (req, res, next) => {
  // 1. Get token from Authorization header
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Authentication required. Please log in.", 401));
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Session expired. Please log in again.", 401));
    }
    return next(new AppError("Invalid token. Please log in again.", 401));
  }

  // 3. Check admin still exists
  const admin = await Admin.findById(decoded.id);
  if (!admin) {
    return next(new AppError("Admin account no longer exists.", 401));
  }

  // 4. Attach admin to request
  req.admin = { id: admin._id, name: admin.name, email: admin.email };
  next();
});

module.exports = { protect };
