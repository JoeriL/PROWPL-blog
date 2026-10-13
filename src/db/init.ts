import { client, db } from "./index";
import { dailyLogs, contributions, internshipGoals } from "./schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

interface ImportLogEntry {
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

interface ImportGoalEntry {
  title: string;
  description?: string;
  category?: string;
  status?: "not_started" | "in_progress" | "completed";
  progress?: number;
}

function computeIntensity(hoursWorked: number, activityCount: number): number {
  if (hoursWorked <= 0 && activityCount <= 0) return 0;
  if (hoursWorked >= 8.5 || activityCount >= 5) return 4;
  if (hoursWorked >= 7.5 || activityCount >= 4) return 3;
  if (hoursWorked >= 4.0 || activityCount >= 2) return 2;
  return 1;
}

/**
 * Creates database tables and indexes if they do not already exist.
 */
export async function ensureTablesExist() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS daily_logs (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      date text NOT NULL,
      title text NOT NULL,
      summary text NOT NULL,
      content text NOT NULL,
      hours_worked real DEFAULT 8 NOT NULL,
      category text DEFAULT 'Feature Development' NOT NULL,
      mood text DEFAULT 'productive' NOT NULL,
      accomplishments text DEFAULT '[]' NOT NULL,
      skills text DEFAULT '[]' NOT NULL,
      challenges text,
      learnings text,
      mentor_feedback text,
      is_published integer DEFAULT 1 NOT NULL,
      created_at text NOT NULL,
      updated_at text NOT NULL
    );
  `);

  await client.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS daily_logs_date_unique ON daily_logs (date);
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS contributions (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      date text NOT NULL,
      activity_count integer DEFAULT 1 NOT NULL,
      intensity_level integer DEFAULT 1 NOT NULL,
      hours_logged real DEFAULT 8 NOT NULL,
      highlight text,
      daily_log_id integer,
      created_at text NOT NULL,
      updated_at text NOT NULL,
      FOREIGN KEY (daily_log_id) REFERENCES daily_logs(id) ON UPDATE no action ON DELETE set null
    );
  `);

  await client.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS contributions_date_unique ON contributions (date);
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS internship_goals (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      title text NOT NULL,
      description text,
      category text DEFAULT 'Technical' NOT NULL,
      status text DEFAULT 'in_progress' NOT NULL,
      progress integer DEFAULT 0 NOT NULL,
      target_date text,
      completed_date text,
      created_at text NOT NULL
    );
  `);
}

/**
 * Automatically imports entries from import-data.json if missing from the database.
 */
export async function autoImportLogs() {
  const filePath = path.resolve(process.cwd(), "import-data.json");
  if (!fs.existsSync(filePath)) {
    return;
  }

  let entries: ImportLogEntry[] = [];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    entries = JSON.parse(raw);
    if (!Array.isArray(entries)) return;
  } catch (err) {
    console.error("⚠️ Failed to parse import-data.json:", err);
    return;
  }

  const existingLogs = await db.select({ id: dailyLogs.id, date: dailyLogs.date }).from(dailyLogs);
  const existingMap = new Map(existingLogs.map((l) => [l.date, l.id]));

  let insertedCount = 0;

  for (const entry of entries) {
    if (!entry.date || !entry.title) continue;

    const activityCount = Math.max(
      1,
      (entry.accomplishments?.length || 0) + (entry.skills?.length ? 1 : 0)
    );
    const intensityLevel = computeIntensity(entry.hoursWorked || 8.0, activityCount);

    if (!existingMap.has(entry.date)) {
      const [inserted] = await db
        .insert(dailyLogs)
        .values({
          date: entry.date,
          title: entry.title,
          summary: entry.summary || entry.title,
          content: entry.content || entry.summary || entry.title,
          hoursWorked: Number(entry.hoursWorked) || 8.0,
          category: entry.category || "Feature Development",
          mood: entry.mood || "productive",
          accomplishments: entry.accomplishments || [],
          skills: entry.skills || [],
          challenges: entry.challenges || null,
          learnings: entry.learnings || null,
          mentorFeedback: entry.mentorFeedback || null,
          isPublished: true,
        })
        .returning();

      await db.insert(contributions).values({
        date: entry.date,
        activityCount,
        intensityLevel,
        hoursLogged: Number(entry.hoursWorked) || 8.0,
        highlight: entry.title,
        dailyLogId: inserted.id,
      });

      insertedCount++;
    }
  }

  if (insertedCount > 0) {
    console.log(`📥 Auto-imported ${insertedCount} missing log entries from import-data.json`);
  }
}

/**
 * Automatically imports goals from import-goals.json if missing from the database.
 */
export async function autoImportGoals() {
  const filePath = path.resolve(process.cwd(), "import-goals.json");
  if (!fs.existsSync(filePath)) {
    return;
  }

  let goals: ImportGoalEntry[] = [];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    goals = JSON.parse(raw);
    if (!Array.isArray(goals)) return;
  } catch (err) {
    console.error("⚠️ Failed to parse import-goals.json:", err);
    return;
  }

  const existingGoals = await db.select({ title: internshipGoals.title }).from(internshipGoals);
  const existingTitles = new Set(existingGoals.map((g) => g.title));

  let insertedGoals = 0;

  for (const g of goals) {
    if (!g.title || existingTitles.has(g.title)) continue;

    await db.insert(internshipGoals).values({
      title: g.title,
      description: g.description || null,
      category: g.category || "Technical",
      status: g.status || (g.progress === 100 ? "completed" : "in_progress"),
      progress: typeof g.progress === "number" ? Math.min(100, Math.max(0, g.progress)) : 0,
    });

    insertedGoals++;
  }

  if (insertedGoals > 0) {
    console.log(`🎯 Auto-imported ${insertedGoals} missing goals from import-goals.json`);
  }
}

/**
 * Master initialization function: ensures tables exist and imports default JSON files.
 */
export async function initDatabase() {
  await ensureTablesExist();
  await autoImportLogs();
  await autoImportGoals();
}

let initPromise: Promise<void> | null = null;

export async function ensureDbInitialized() {
  if (!initPromise) {
    initPromise = initDatabase().catch((err) => {
      console.error("❌ Database auto-initialization error:", err);
      initPromise = null; // Reset on failure so subsequent attempts can retry
      throw err;
    });
  }
  return initPromise;
}

// When executed directly as a script (e.g. `npx tsx src/db/init.ts` or via npm predev/prebuild)
if (process.argv[1] && process.argv[1].endsWith("init.ts")) {
  initDatabase()
    .then(() => {
      console.log("✅ Database initialized successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Database initialization failed:", err);
      process.exit(1);
    });
}
