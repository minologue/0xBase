import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from "@/lib/db";

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
console.log("Migrations complete");
process.exit(0);
