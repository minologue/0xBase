"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { project } from "@/config/project";
import { completeOnboarding } from "./service";

const stepResponseSchema = z.object({
	question: z.string().min(1),
	answer: z.string().min(1),
});

const responsesSchema = z
	.record(z.coerce.number().int().min(0), stepResponseSchema)
	.refine(
		(val) => Object.keys(val).length === project.onboarding.steps,
		{ message: "All onboarding steps must be answered" },
	);

type CompleteOnboardingResult = { success: boolean; error?: string };

/**
 * Server action to save onboarding responses and mark the user as onboarded.
 * userId is always sourced from the verified session — never from client input.
 * @param responses - Map of 0-based step index to { question, answer }
 */
export async function completeOnboardingAction(
	responses: Record<number, { question: string; answer: string }>,
): Promise<CompleteOnboardingResult> {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) return { success: false, error: "Not authenticated" };

	const parsed = responsesSchema.safeParse(responses);
	if (!parsed.success) {
		return {
			success: false,
			error: parsed.error.issues[0]?.message ?? "Invalid responses",
		};
	}

	await completeOnboarding(session.user.id, parsed.data);
	return { success: true };
}
