/**
 * jwt.js
 * @description Central JWT token settings for access and refresh tokens.
 */

module.exports = {
  access: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
};
