/**
 * seed.js
 * @description Seeds a default admin account for first-time setup.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

/**
 * Connects to DB and creates admin if it does not exist.
 * @returns {Promise<void>}
 */
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await Admin.findOne({ email: process.env.SEED_ADMIN_EMAIL });
    if (existing) {
      console.log("⚠️  Admin already exists:", existing.email);
      process.exit(0);
    }

    const admin = await Admin.create({
      name: process.env.SEED_ADMIN_NAME || "Admin",
      email: process.env.SEED_ADMIN_EMAIL || "admin@company.com",
      password: process.env.SEED_ADMIN_PASSWORD || "Admin@123456",
    });

    console.log("✅ Admin created successfully");
    console.log("   Name:", admin.name);
    console.log("   Email:", admin.email);
    console.log("   Password:", process.env.SEED_ADMIN_PASSWORD || "Admin@123456");
    console.log("\n⚠️  Please change the password after first login!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
