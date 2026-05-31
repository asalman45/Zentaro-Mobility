import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:54322/postgres";

const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

const pool = globalForDb.conn ?? new Pool({
  connectionString,
  ssl: isLocal ? undefined : { rejectUnauthorized: false }
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = pool;
}

export const db = drizzle(pool, { schema });
export * from "./schema";
