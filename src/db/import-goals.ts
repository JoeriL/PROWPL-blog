import { db } from "./index";
import { internshipGoals } from "./schema";
import * as fs from "fs";
import * as path from "path";

interface ImportGoalEntry {
  title: string;
  description?: string;
  category?: string; // "Technical" | "Architecture" | "Soft Skills" | "Process & CI/CD"
  status?: "not_started" | "in_progress" | "completed";
  progress?: number; // 0 - 100
}

async function importGoals() {
  const filePath = path.resolve(process.cwd(), "import-goals.json");

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Bestand niet gevonden: ${filePath}`);
    console.log("Plaats een 'import-goals.json' bestand in de hoofdmap met je stageleerdoelen.");
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  let goals: ImportGoalEntry[];

  try {
    goals = JSON.parse(raw);
    if (!Array.isArray(goals)) {
      throw new Error("JSON root moet een array zijn van goals.");
    }
  } catch (err) {
    console.error("❌ Fout bij het parsen van import-goals.json:", err);
    process.exit(1);
  }

  console.log(`🎯 Gevonden: ${goals.length} stageleerdoelen om te importeren...`);

  // Clear previous default goals
  await db.delete(internshipGoals);

  for (const g of goals) {
    if (!g.title) continue;

    await db.insert(internshipGoals).values({
      title: g.title,
      description: g.description || null,
      category: g.category || "Technical",
      status: g.status || (g.progress === 100 ? "completed" : "in_progress"),
      progress: typeof g.progress === "number" ? Math.min(100, Math.max(0, g.progress)) : 0,
    });
  }

  console.log(`✅ Succesvol ${goals.length} stageleerdoelen geïmporteerd!`);
}

importGoals()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Fout tijdens importeren van doelen:", err);
    process.exit(1);
  });
