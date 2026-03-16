ALTER TABLE "accounts" ADD COLUMN "access_token_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "refresh_token_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "scope" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "id_token" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "user_agent" text;