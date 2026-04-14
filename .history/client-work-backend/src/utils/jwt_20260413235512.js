/**
 * jwt.js
 * @description JWT helpers for access/refresh tokens and refresh-cookie policies.
 */

const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

/**
 * Signs an access token.
 * @param {Record<string, unknown>} payload
 * @returns {string}
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.access.secret, {
    expiresIn: jwtConfig.access.expiresIn,
  });
};

/**
 * Signs a refresh token.
 * @param {Record<string, unknown>} payload
 * @returns {string}
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.refresh.secret, {
    expiresIn: jwtConfig.refresh.expiresIn,
  });
};

/**
 * Verifies an access token.
 * @param {string} token
 * @returns {string | jwt.JwtPayload}
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtConfig.access.secret);
};

/**
 * Verifies a refresh token.
 * @param {string} token
 * @returns {string | jwt.JwtPayload}
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtConfig.refresh.secret);
};

// Cookie options
const isSecureCookie = process.env.COOKIE_SECURE === "true";
const cookieSameSite = isSecureCookie ? "none" : "lax";

/**
 * Cookie settings used when writing refresh tokens.
 * @returns {import("express").CookieOptions}
 */
const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: isSecureCookie,
  sameSite: cookieSameSite,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
});

/**
 * Cookie settings used when clearing refresh tokens.
 * @returns {import("express").CookieOptions}
 */
const clearRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: isSecureCookie,
  sameSite: cookieSameSite,
});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshCookieOptions,
  clearRefreshCookieOptions,
};
