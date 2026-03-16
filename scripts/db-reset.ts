import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

if (env.NODE_ENV === "production") {
	throw new Error("db:reset cannot run in production");
}

await db.execute(sql`drop schema if exists public cascade`);
await db.execute(sql`drop schema if exists drizzle cascade`);
await db.execute(sql`create schema public`);
const scriptDir = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = resolve(scriptDir, "../drizzle/migrations");

if (!existsSync(resolve(migrationsFolder, "meta/_journal.json"))) {
	throw new Error(
		[
			"Missing Drizzle migration metadata at drizzle/migrations/meta/_journal.json.",
			"Run `bun run db:generate` first.",
		].join(" "),
	);
}

await migrate(db, { migrationsFolder });

console.log("Database reset complete");
