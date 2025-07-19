const cron = require("node-cron");
const { RefreshToken } = require("../models");
const { Op } = require("sequelize");

// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const deleted = await RefreshToken.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date()
        }
      }
    });
    console.log(`🧹 Cleaned ${deleted} expired refresh tokens`);
  } catch (err) {
    console.error("❌ Failed to clean refresh tokens:", err);
  }
});
