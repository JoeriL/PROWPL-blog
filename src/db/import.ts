import fs from "fs";
import path from "path";
import { db, ensureDbInitialized } from "./index";
import { dailyLogs } from "./schema";
import { syncContributionForDate } from "../lib/actions";
import { eq, and } from "drizzle-orm";

interface ImportPostEntry {
  date: string;
  title: string;
  summary: string;
  content: string;
  hoursWorked: number;
  category: string;
  mood: string;
  accomplishments: string[];
  skills: string[];
  challenges?: string;
  learnings?: string;
  mentorFeedback?: string;
}

export async function importBlogPosts(jsonFilePath?: string) {
  const filePath =
    jsonFilePath ||
    process.argv[2] ||
    path.resolve(process.cwd(), "import-blog.json");

  console.log(`📂 Reading import file: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const entries: ImportPostEntry[] = JSON.parse(raw);

  if (!Array.isArray(entries)) {
    throw new Error("Invalid format: Expected a JSON array of post entries.");
  }

  console.log(`Found ${entries.length} post entries to process.`);

  await ensureDbInitialized();

  let insertedCount = 0;
  let updatedCount = 0;
  const processedDates = new Set<string>();

  for (const entry of entries) {
    // Check if an entry with identical date and title already exists
    const existing = await db
      .select()
      .from(dailyLogs)
      .where(
        and(
          eq(dailyLogs.date, entry.date),
          eq(dailyLogs.title, entry.title)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      console.log(`🔄 Updating existing log: [${entry.date}] "${entry.title}" (ID: ${existing[0].id})`);
      await db
        .update(dailyLogs)
        .set({
          summary: entry.summary,
          content: entry.content,
          hoursWorked: Number(entry.hoursWorked) || 0,
          category: entry.category || "Feature Development",
          mood: entry.mood || "productive",
          accomplishments: Array.isArray(entry.accomplishments) ? entry.accomplishments : [],
          skills: Array.isArray(entry.skills) ? entry.skills : [],
          challenges: entry.challenges || null,
          learnings: entry.learnings || null,
          mentorFeedback: entry.mentorFeedback || null,
          isPublished: true,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(dailyLogs.id, existing[0].id));
      updatedCount++;
    } else {
      console.log(`➕ Inserting new log: [${entry.date}] "${entry.title}" (${entry.hoursWorked}h, ${entry.category})`);
      await db.insert(dailyLogs).values({
        date: entry.date,
        title: entry.title,
        summary: entry.summary,
        content: entry.content,
        hoursWorked: Number(entry.hoursWorked) || 0,
        category: entry.category || "Feature Development",
        mood: entry.mood || "productive",
        accomplishments: Array.isArray(entry.accomplishments) ? entry.accomplishments : [],
        skills: Array.isArray(entry.skills) ? entry.skills : [],
        challenges: entry.challenges || null,
        learnings: entry.learnings || null,
        mentorFeedback: entry.mentorFeedback || null,
        isPublished: true,
      });
      insertedCount++;
    }

    processedDates.add(entry.date);
  }

  // Synchronize contribution heatmap for all modified dates
  console.log("📊 Synchronizing contribution heatmap records...");
  for (const date of processedDates) {
    await syncContributionForDate(date);
    console.log(`   ✓ Synced heatmap contribution for ${date}`);
  }

  console.log(`\n🎉 Import completed successfully!`);
  console.log(`   • Added: ${insertedCount}`);
  console.log(`   • Updated: ${updatedCount}`);
  console.log(`   • Dates synced: ${processedDates.size}`);
}

// When run directly from CLI
if (process.argv[1] && process.argv[1].endsWith("import.ts")) {
  importBlogPosts()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Import failed:", err);
      process.exit(1);
    });
}
