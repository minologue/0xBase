ALTER TABLE "onboarding_responses" DROP CONSTRAINT "uniq_onboarding_step";--> statement-breakpoint
ALTER TABLE "onboarding_responses" ADD COLUMN "answers" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding_responses" DROP COLUMN "step";--> statement-breakpoint
ALTER TABLE "onboarding_responses" DROP COLUMN "answer";--> statement-breakpoint
ALTER TABLE "onboarding_responses" ADD CONSTRAINT "onboarding_responses_user_id_unique" UNIQUE("user_id");