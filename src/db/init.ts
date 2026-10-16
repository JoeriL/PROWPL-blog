import { client } from "./index";

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

  // Allow multiple blog post entries per date while maintaining fast queries
  await client.execute(`
    DROP INDEX IF EXISTS daily_logs_date_unique;
  `);
  await client.execute(`
    CREATE INDEX IF NOT EXISTS daily_logs_date_idx ON daily_logs (date);
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
 * Master initialization function: ensures tables exist.
 */
export async function initDatabase() {
  await ensureTablesExist();
}

let initPromise: Promise<void> | null = null;

export async function ensureDbInitialized() {
  if (!initPromise) {
    initPromise = initDatabase().catch((err) => {
      console.error("❌ Database initialization error:", err);
      initPromise = null;
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
