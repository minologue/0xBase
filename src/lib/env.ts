import { z } from "zod";

const schema = z.object({
	BETTER_AUTH_SECRET: z.string().min(32, "Must be at least 32 chars"),
	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_CLIENT_SECRET: z.string().min(1),
	GITHUB_CLIENT_ID: z.string().min(1),
	GITHUB_CLIENT_SECRET: z.string().min(1),
	DATABASE_URL: z.url(),
	APP_URL: z.url().default("http://localhost:3000"),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

const result = schema.safeParse(process.env);

if (!result.success) {
	const details = JSON.stringify(result.error.flatten().fieldErrors);
	throw new Error(`Missing or invalid environment variables: ${details}`);
}

export const env = result.data;
