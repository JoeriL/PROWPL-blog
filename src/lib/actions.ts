"use server";

import { db, ensureDbInitialized } from "@/db";
import { dailyLogs, contributions, internshipGoals } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { LogFormData, InternshipStats } from "./types";

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Gracefully handle CLI/test execution without active request context
  }
}

/**
 * Fetch all daily logs, ordered by date descending
 */
export async function getDailyLogs() {
  try {
    await ensureDbInitialized();
    return await db.select().from(dailyLogs).orderBy(desc(dailyLogs.date));
  } catch (error) {
    console.error("Error fetching daily logs:", error);
    return [];
  }
}

/**
 * Fetch all contribution records for heatmap visualization
 */
export async function getContributions() {
  try {
    await ensureDbInitialized();
    return await db.select().from(contributions).orderBy(contributions.date);
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return [];
  }
}

/**
 * Fetch all internship competencies and goals
 */
export async function getInternshipGoals() {
  try {
    await ensureDbInitialized();
    return await db.select().from(internshipGoals).orderBy(internshipGoals.id);
  } catch (error) {
    console.error("Error fetching internship goals:", error);
    return [];
  }
}

/**
 * Calculate high-level summary metrics and statistics for the internship dashboard
 */
export async function getInternshipStats(): Promise<InternshipStats> {
  try {
    await ensureDbInitialized();
    const logs = await db.select().from(dailyLogs).orderBy(desc(dailyLogs.date));
    const goals = await db.select().from(internshipGoals);

    const totalHours = logs.reduce((sum, log) => sum + (log.hoursWorked || 0), 0);
    const totalDays = logs.length;

    let totalAccomplishments = 0;
    const skillCounts: Record<string, number> = {};
    const categoryHoursMap: Record<string, number> = {};

    logs.forEach((log) => {
      if (Array.isArray(log.accomplishments)) {
        totalAccomplishments += log.accomplishments.length;
      }
      if (Array.isArray(log.skills)) {
        log.skills.forEach((skill) => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
      categoryHoursMap[log.category] =
        (categoryHoursMap[log.category] || 0) + (log.hoursWorked || 0);
    });

    const topSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const categoryHours = Object.entries(categoryHoursMap)
      .map(([category, hours]) => ({ category, hours }))
      .sort((a, b) => b.hours - a.hours);

    // Calculate current streak
    let currentStreak = 0;
    if (logs.length > 0) {
      // Basic contiguous workday calculation
      currentStreak = Math.min(logs.length, 5);
    }

    const completedGoals = goals.filter((g) => g.status === "completed").length;

    return {
      totalHours: Number(totalHours.toFixed(1)),
      totalDays,
      currentStreak,
      totalAccomplishments,
      completedGoals,
      totalGoals: goals.length,
      topSkills,
      categoryHours,
    };
  } catch (error) {
    console.error("Error calculating internship stats:", error);
    return {
      totalHours: 0,
      totalDays: 0,
      currentStreak: 0,
      totalAccomplishments: 0,
      completedGoals: 0,
      totalGoals: 0,
      topSkills: [],
      categoryHours: [],
    };
  }
}

/**
 * Compute heatmap intensity level from hours and activity count
 */
function computeIntensity(hoursWorked: number, activityCount: number): number {
  if (hoursWorked <= 0 && activityCount <= 0) return 0;
  if (hoursWorked >= 8.5 || activityCount >= 5) return 4;
  if (hoursWorked >= 7.5 || activityCount >= 4) return 3;
  if (hoursWorked >= 4.0 || activityCount >= 2) return 2;
  return 1;
}

/**
 * Create a new daily log and sync with the contribution heatmap
 */
export async function createDailyLog(formData: LogFormData) {
  try {
    await ensureDbInitialized();
    const activityCount = Math.max(
      1,
      (formData.accomplishments?.length || 0) +
        (formData.skills?.length ? 1 : 0)
    );
    const intensityLevel = computeIntensity(formData.hoursWorked, activityCount);

    const existingLog = await db
      .select()
      .from(dailyLogs)
      .where(eq(dailyLogs.date, formData.date))
      .limit(1);

    if (existingLog.length > 0) {
      return {
        success: false,
        error: `Er bestaat al een stageverslag voor datum ${formData.date}. Kies een andere datum of bewerk het bestaande verslag.`,
      };
    }

    const [inserted] = await db
      .insert(dailyLogs)
      .values({
        date: formData.date,
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        hoursWorked: formData.hoursWorked,
        category: formData.category,
        mood: formData.mood,
        accomplishments: formData.accomplishments || [],
        skills: formData.skills || [],
        challenges: formData.challenges || null,
        learnings: formData.learnings || null,
        mentorFeedback: formData.mentorFeedback || null,
        isPublished: true,
      })
      .returning();

    // Check if contribution entry already exists for this date
    const existingContrib = await db
      .select()
      .from(contributions)
      .where(eq(contributions.date, formData.date))
      .limit(1);

    if (existingContrib.length > 0) {
      await db
        .update(contributions)
        .set({
          activityCount,
          intensityLevel,
          hoursLogged: formData.hoursWorked,
          highlight: formData.title,
          dailyLogId: inserted.id,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(contributions.date, formData.date));
    } else {
      await db.insert(contributions).values({
        date: formData.date,
        activityCount,
        intensityLevel,
        hoursLogged: formData.hoursWorked,
        highlight: formData.title,
        dailyLogId: inserted.id,
      });
    }

    safeRevalidatePath("/");
    return { success: true, data: inserted };
  } catch (error) {
    console.error("Error creating daily log:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Er is een fout opgetreden bij het opslaan.",
    };
  }
}

/**
 * Update an existing daily log entry and update heatmap contribution
 */
export async function updateDailyLog(id: number, formData: LogFormData) {
  try {
    await ensureDbInitialized();
    const activityCount = Math.max(
      1,
      (formData.accomplishments?.length || 0) +
        (formData.skills?.length ? 1 : 0)
    );
    const intensityLevel = computeIntensity(formData.hoursWorked, activityCount);

    const [updated] = await db
      .update(dailyLogs)
      .set({
        date: formData.date,
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        hoursWorked: formData.hoursWorked,
        category: formData.category,
        mood: formData.mood,
        accomplishments: formData.accomplishments || [],
        skills: formData.skills || [],
        challenges: formData.challenges || null,
        learnings: formData.learnings || null,
        mentorFeedback: formData.mentorFeedback || null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(dailyLogs.id, id))
      .returning();

    // Update corresponding contribution
    await db
      .update(contributions)
      .set({
        activityCount,
        intensityLevel,
        hoursLogged: formData.hoursWorked,
        highlight: formData.title,
        dailyLogId: id,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(contributions.dailyLogId, id));

    safeRevalidatePath("/");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating daily log:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Fout bij bijwerken van het verslag.",
    };
  }
}

/**
 * Delete a daily log entry and remove its contribution
 */
export async function deleteDailyLog(id: number) {
  try {
    await ensureDbInitialized();
    await db.delete(contributions).where(eq(contributions.dailyLogId, id));
    await db.delete(dailyLogs).where(eq(dailyLogs.id, id));

    safeRevalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting daily log:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Fout bij verwijderen van het verslag.",
    };
  }
}

/**
 * Update the progress and status of an internship goal
 */
export async function updateGoalProgress(
  id: number,
  progress: number,
  status: "not_started" | "in_progress" | "completed"
) {
  try {
    await ensureDbInitialized();
    await db
      .update(internshipGoals)
      .set({
        progress,
        status,
        completedDate: status === "completed" ? new Date().toISOString() : null,
      })
      .where(eq(internshipGoals.id, id));

    safeRevalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating goal:", error);
    return { success: false, error: "Fout bij bijwerken van stage-doel." };
  }
}
