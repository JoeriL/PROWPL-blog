import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const dbUrl = process.env.DATABASE_URL || "file:sqlite.db";

// Global cache for development hot reloading
const globalForDb = globalThis as unknown as {
  libsqlClient?: ReturnType<typeof createClient>;
};

export const client =
  globalForDb.libsqlClient ??
  createClient({
    url: dbUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.libsqlClient = client;
}

export const db = drizzle(client, { schema });

// Re-export ensureDbInitialized helper
export { ensureDbInitialized, initDatabase } from "./init";
