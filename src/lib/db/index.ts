import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { parse } from "pg-connection-string";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:54322/postgres";

const isLocalDev = connectionString.includes("54322");

const dbConfig = parse(connectionString);

if (!isLocalDev) {
  if (dbConfig.ssl && typeof dbConfig.ssl === "object") {
    dbConfig.ssl.rejectUnauthorized = false;
  } else {
    dbConfig.ssl = { rejectUnauthorized: false };
  }
}

const poolConfig = {
  ...dbConfig,
  host: dbConfig.host ?? undefined,
  database: dbConfig.database ?? undefined,
  port: dbConfig.port ? parseInt(dbConfig.port, 10) : undefined,
  ssl: dbConfig.ssl ? (dbConfig.ssl as any) : undefined,
};

const pool = globalForDb.conn ?? new Pool(poolConfig);

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = pool;
}

export const db = drizzle(pool, { schema });
export * from "./schema";
