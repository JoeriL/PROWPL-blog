import {
  getDailyLogs,
  getContributions,
  getInternshipGoals,
  getInternshipStats,
  createDailyLog,
  updateDailyLog,
  deleteDailyLog,
} from "../lib/actions";

async function verifyAll() {
  console.log("🔍 Verifying Full-Stack Internship Blog implementation...");

  // 1. Test fetching logs
  const logs = await getDailyLogs();
  console.log(`✓ Fetched ${logs.length} daily logs`);
  if (logs.length === 0) throw new Error("Expected daily logs to be populated");

  // 2. Test fetching contributions
  const contributions = await getContributions();
  console.log(`✓ Fetched ${contributions.length} contribution heatmap entries`);
  if (contributions.length === 0) throw new Error("Expected contributions to be populated");

  // 3. Test fetching goals
  const goals = await getInternshipGoals();
  console.log(`✓ Fetched ${goals.length} internship goals`);
  if (goals.length === 0) throw new Error("Expected goals to be populated");

  // 4. Test statistics
  const stats = await getInternshipStats();
  console.log("✓ Calculated internship stats:", {
    totalHours: stats.totalHours,
    totalDays: stats.totalDays,
    totalAccomplishments: stats.totalAccomplishments,
    completedGoals: `${stats.completedGoals}/${stats.totalGoals}`,
    topSkillsCount: stats.topSkills.length,
  });
  if (stats.totalHours <= 0) throw new Error("Expected total hours > 0");
  if (stats.totalAccomplishments <= 0) throw new Error("Expected accomplishments > 0");

  // 5. Test creating a new daily log
  const testDate = "2026-10-14";
  const existingTestLogs = logs.filter((l) => l.date === testDate);
  for (const l of existingTestLogs) {
    await deleteDailyLog(l.id);
  }

  console.log("✓ Testing createDailyLog...");
  const createResult = await createDailyLog({
    date: testDate,
    title: "Geautomatiseerde E2E Test van het Stage Logboek",
    summary: "Testverslag om CRUD-operaties en heatmapsynchronisatie te valideren.",
    content: "Dit verslag is aangemaakt door het validatiescript en verifieert de werking van Drizzle ORM.",
    hoursWorked: 8.0,
    category: "Testing & QA",
    mood: "excited",
    accomplishments: [
      "Drizzle ORM query flow geverifieerd",
      "Heatmap sync geautomatiseerd getest",
    ],
    skills: ["Automated Testing", "Drizzle ORM", "SQLite"],
    challenges: "Geen",
    learnings: "Drizzle Server Actions werken foutloos",
    mentorFeedback: "Uitstekend gedocumenteerd",
  });

  if (!createResult.success || !createResult.data) {
    throw new Error(`Failed to create daily log: ${createResult.error}`);
  }
  const createdId = createResult.data.id;
  console.log(`✓ Created log with ID: ${createdId}`);

  // Check that contribution was created for testDate
  const contribsAfterCreate = await getContributions();
  const createdContrib = contribsAfterCreate.find((c) => c.date === testDate);
  if (!createdContrib) {
    throw new Error("Contribution record was not synchronized for the new log date");
  }
  console.log("✓ Verified contribution was synced automatically with intensity:", createdContrib.intensityLevel);

  // 6. Test updating the daily log
  console.log("✓ Testing updateDailyLog...");
  const updateResult = await updateDailyLog(createdId, {
    date: testDate,
    title: "Bijgewerkt: Geautomatiseerde E2E Test van het Stage Logboek",
    summary: "Bijgewerkte samenvatting.",
    content: "Bijgewerkte inhoud.",
    hoursWorked: 9.0,
    category: "Testing & QA",
    mood: "satisfied",
    accomplishments: ["Realisatie 1", "Realisatie 2", "Realisatie 3"],
    skills: ["Drizzle ORM", "TypeScript"],
  });

  if (!updateResult.success) {
    throw new Error(`Failed to update daily log: ${updateResult.error}`);
  }
  console.log("✓ Updated log successfully");

  // 7. Test deleting the log
  console.log("✓ Testing deleteDailyLog...");
  const deleteResult = await deleteDailyLog(createdId);
  if (!deleteResult.success) {
    throw new Error("Failed to delete daily log");
  }
  console.log("✓ Cleaned up test log successfully");

  console.log("🎉 ALL TESTS & VERIFICATIONS PASSED SUCCESSFULLY!");
}

verifyAll()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Verification failed:", err);
    process.exit(1);
  });
