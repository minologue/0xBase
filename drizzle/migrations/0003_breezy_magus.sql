CREATE TABLE "onboarding_responses" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"step" integer NOT NULL,
	"answer" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uniq_onboarding_step" UNIQUE("user_id","step")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding_responses" ADD CONSTRAINT "onboarding_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_onboarding_responses_userId" ON "onboarding_responses" USING btree ("user_id");