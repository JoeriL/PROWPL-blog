import { db } from "./index";
import { dailyLogs, contributions } from "./schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

interface ImportLogEntry {
  date: string; // YYYY-MM-DD
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

function computeIntensity(hoursWorked: number, activityCount: number): number {
  if (hoursWorked <= 0 && activityCount <= 0) return 0;
  if (hoursWorked >= 8.5 || activityCount >= 5) return 4;
  if (hoursWorked >= 7.5 || activityCount >= 4) return 3;
  if (hoursWorked >= 4.0 || activityCount >= 2) return 2;
  return 1;
}

async function importLogs() {
  const filePath = path.resolve(process.cwd(), "import-data.json");

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Bestand niet gevonden: ${filePath}`);
    console.log("Maak een 'import-data.json' bestand in de hoofdmap met je logboek JSON array.");
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  let entries: ImportLogEntry[];

  try {
    entries = JSON.parse(raw);
    if (!Array.isArray(entries)) {
      throw new Error("JSON root moet een array zijn van log items.");
    }
  } catch (err) {
    console.error("❌ Fout bij het parsen van import-data.json:", err);
    process.exit(1);
  }

  console.log(`📦 Gevonden: ${entries.length} logboek items om te importeren...`);

  let importedCount = 0;
  let updatedCount = 0;

  for (const entry of entries) {
    if (!entry.date || !entry.title) {
      console.warn(`⚠️ Item overgeslagen wegens ontbrekende datum of titel:`, entry);
      continue;
    }

    const activityCount = Math.max(
      1,
      (entry.accomplishments?.length || 0) + (entry.skills?.length ? 1 : 0)
    );
    const intensityLevel = computeIntensity(entry.hoursWorked || 8.0, activityCount);

    // Check if log for date already exists
    const existing = await db
      .select()
      .from(dailyLogs)
      .where(eq(dailyLogs.date, entry.date))
      .limit(1);

    let logId: number;

    if (existing.length > 0) {
      logId = existing[0].id;
      await db
        .update(dailyLogs)
        .set({
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
          updatedAt: new Date().toISOString(),
        })
        .where(eq(dailyLogs.id, logId));
      updatedCount++;
    } else {
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
      logId = inserted.id;
      importedCount++;
    }

    // Upsert contribution heatmap record
    const existingContrib = await db
      .select()
      .from(contributions)
      .where(eq(contributions.date, entry.date))
      .limit(1);

    if (existingContrib.length > 0) {
      await db
        .update(contributions)
        .set({
          activityCount,
          intensityLevel,
          hoursLogged: Number(entry.hoursWorked) || 8.0,
          highlight: entry.title,
          dailyLogId: logId,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(contributions.date, entry.date));
    } else {
      await db.insert(contributions).values({
        date: entry.date,
        activityCount,
        intensityLevel,
        hoursLogged: Number(entry.hoursWorked) || 8.0,
        highlight: entry.title,
        dailyLogId: logId,
      });
    }
  }

  console.log(`✅ Succesvol geïmporteerd: ${importedCount} nieuw, ${updatedCount} bijgewerkt!`);
}

importLogs()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Fout tijdens importeren:", err);
    process.exit(1);
  });
