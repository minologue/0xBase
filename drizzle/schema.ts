import { relations } from "drizzle-orm";
import { boolean, index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable(
	"users",
	{
		id: text("id").primaryKey(),
		email: text("email").notNull().unique(),
		emailVerified: boolean("email_verified").default(false).notNull(),
		name: text("name"),
		image: text("image"),
		onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
	},
	(table) => [index("idx_users_email").on(table.email)],
);

export const onboardingResponses = pgTable(
	"onboarding_responses",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.unique()
			.references(() => users.id, { onDelete: "cascade" }),
		answers: jsonb("answers").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("idx_onboarding_responses_userId").on(table.userId),
	],
);

export const sessions = pgTable(
	"sessions",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		token: text("token").notNull().unique(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
	},
	(table) => [
		index("idx_sessions_userId").on(table.userId),
		index("idx_sessions_token").on(table.token),
	],
);

export const accounts = pgTable(
	"accounts",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		providerId: text("provider_id").notNull(),
		accountId: text("account_id").notNull(),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at", {
			withTimezone: true,
		}),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
			withTimezone: true,
		}),
		scope: text("scope"),
		idToken: text("id_token"),
		password: text("password"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
	},
	(table) => [index("idx_accounts_userId").on(table.userId)],
);

export const verifications = pgTable(
	"verifications",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
	},
	(table) => [index("idx_verification_identifier").on(table.identifier)],
);

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	accounts: many(accounts),
	onboardingResponses: many(onboardingResponses),
}));

export const onboardingResponsesRelations = relations(onboardingResponses, ({ one }) => ({
	user: one(users, {
		fields: [onboardingResponses.userId],
		references: [users.id],
	}),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));
