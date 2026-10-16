import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

/**
 * Daily log entries representing daily blog posts / logbook records of internship work.
 */
export const dailyLogs = sqliteTable("daily_logs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  date: text("date").notNull(), // YYYY-MM-DD format
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(), // Markdown / full journal text
  hoursWorked: real("hours_worked").notNull().default(8.0),
  category: text("category").notNull().default("Feature Development"), // e.g. "Feature Development", "Bug Fixing", "Architecture & Planning", "Research & Learning", "Testing & QA", "DevOps & CI/CD", "Onboarding"
  mood: text("mood").notNull().default("productive"), // "excited" | "productive" | "neutral" | "challenged" | "satisfied"
  accomplishments: text("accomplishments", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  skills: text("skills", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),
  challenges: text("challenges"),
  learnings: text("learnings"),
  mentorFeedback: text("mentor_feedback"),
  isPublished: integer("is_published", { mode: "boolean" })
    .notNull()
    .default(true),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/**
 * Contributions table for the GitHub-style contribution heatmap.
 * Each record represents daily activity intensity and stats.
 */
export const contributions = sqliteTable("contributions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  date: text("date").notNull().unique(), // YYYY-MM-DD
  activityCount: integer("activity_count").notNull().default(1),
  intensityLevel: integer("intensity_level").notNull().default(1), // 0 to 4 scale
  hoursLogged: real("hours_logged").notNull().default(8.0),
  highlight: text("highlight"),
  dailyLogId: integer("daily_log_id").references(() => dailyLogs.id, {
    onDelete: "set null",
  }),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/**
 * Internship milestones and competencies to measure overall progress.
 */
export const internshipGoals = sqliteTable("internship_goals", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("Technical"), // "Technical" | "Architecture" | "Soft Skills" | "Process & CI/CD"
  status: text("status").notNull().default("in_progress"), // "not_started" | "in_progress" | "completed"
  progress: integer("progress").notNull().default(0), // 0-100%
  targetDate: text("target_date"),
  completedDate: text("completed_date"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

// Relationships
export const dailyLogsRelations = relations(dailyLogs, ({ one }) => ({
  contribution: one(contributions, {
    fields: [dailyLogs.id],
    references: [contributions.dailyLogId],
  }),
}));

export const contributionsRelations = relations(contributions, ({ one }) => ({
  dailyLog: one(dailyLogs, {
    fields: [contributions.dailyLogId],
    references: [dailyLogs.id],
  }),
}));

export type DailyLog = typeof dailyLogs.$inferSelect;
export type NewDailyLog = typeof dailyLogs.$inferInsert;

export type Contribution = typeof contributions.$inferSelect;
export type NewContribution = typeof contributions.$inferInsert;

export type InternshipGoal = typeof internshipGoals.$inferSelect;
export type NewInternshipGoal = typeof internshipGoals.$inferInsert;
