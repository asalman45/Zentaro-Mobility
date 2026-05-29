import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";

async function main() {
  console.log("⏳ Connecting to database and running migrations...");
  const { db } = await import("./index");
  
  // Apply migrations from the target migration output folder
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), "src/lib/db/migrations"),
  });
  
  console.log("✅ Migrations completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration execution failed:", err);
  process.exit(1);
});
