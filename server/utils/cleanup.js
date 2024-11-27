const cron = require("node-cron");
const LoginHistory = require("../models/LoginHistory");

async function runCleanup() {
  console.log("Running cleanup task...");
  try {
    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000); // 5 hours ago
    const staleLogins = await LoginHistory.find({
      logoutTime: null,
      loginTime: { $lt: fiveHoursAgo },
    });

    for (const login of staleLogins) {
      // set logoutTime to 5 hours after loginTime
      login.logoutTime = new Date(login.loginTime.getTime() + 5 * 60 * 60 * 1000);
      await login.save();
    }

    console.log(`${staleLogins.length} stale logins updated.`);
  } catch (error) {
    console.error("Error during cleanup task:", error);
  }
}

// run the cleanup immediately after the server starts
(async () => {
  console.log("Running initial cleanup task after server startup...");
  await runCleanup();
})();

// schedule the cleanup to run every hour
cron.schedule("0 * * * *", async () => {
  console.log("Running scheduled cleanup task...");
  await runCleanup();
});

module.exports = runCleanup;
