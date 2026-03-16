import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { onboardingResponses, users } from "../../../drizzle/schema";

/**
 * Saves all onboarding responses as a single row and marks the user as onboarded.
 * Uses db.batch() — single atomic HTTP request (neon-http has no transactions).
 * onConflictDoUpdate handles re-submission gracefully.
 * @param userId - The authenticated user's ID (from session, never from request input)
 * @param responses - Map of 0-based step index to { question, answer }
 */
export async function completeOnboarding(
	userId: string,
	responses: Record<number, { question: string; answer: string }>,
): Promise<void> {
	if (!userId) throw new Error("completeOnboarding: userId is required");

	await db.batch([
		db
			.insert(onboardingResponses)
			.values({ id: crypto.randomUUID(), userId, answers: responses })
			.onConflictDoUpdate({
				target: onboardingResponses.userId,
				set: { answers: responses },
			}),
		db
			.update(users)
			.set({ onboardingCompleted: true })
			.where(eq(users.id, userId)),
	]);
}
