import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import * as schema from "../../drizzle/schema";

export const auth = betterAuth({
	baseURL: env.APP_URL,
	user: {
		additionalFields: {
			onboardingCompleted: {
				type: "boolean" as const,
				defaultValue: false,
				// server-only — client cannot set this field
				input: false,
			},
		},
	},
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: schema.users,
			session: schema.sessions,
			account: schema.accounts,
			verification: schema.verifications,
		},
	}),
	rateLimit: {
		enabled: true,
		// 10 auth requests per 10-second window per IP
		window: 10,
		max: 10,
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
	},
});
