import { db } from "./index";
import { dailyLogs, contributions } from "./schema";

async function clearData() {
  console.log("🧹 Clearing all existing log entries and contributions...");
  await db.delete(contributions);
  await db.delete(dailyLogs);
  console.log("✅ Database cleared! Ready for your real internship logbook data.");
}

clearData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error clearing database:", err);
    process.exit(1);
  });
