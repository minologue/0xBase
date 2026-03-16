"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { updateDisplayName } from "./service";

const nameSchema = z.string().min(1).max(50).trim();

type SaveResult = { success: boolean; error?: string };

/**
 * Updates the authenticated user's display name.
 * UserId is always sourced from the verified session, never from request input.
 * @param name - The new display name (validated by Zod before DB write)
 */
export async function saveProfileAction(name: string): Promise<SaveResult> {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) return { success: false, error: "Not authenticated" };

	const parsed = nameSchema.safeParse(name);
	if (!parsed.success) {
		return {
			success: false,
			error: parsed.error.issues[0]?.message ?? "Invalid name",
		};
	}

	await updateDisplayName(session.user.id, parsed.data);
	return { success: true };
}
