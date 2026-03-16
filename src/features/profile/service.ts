import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "../../../drizzle/schema";

export type UserProfile = {
	id: string;
	name: string | null;
	email: string;
	image: string | null;
};

/**
 * Returns the public profile fields for a user.
 * @param userId - The authenticated user's ID (from session, never from request input)
 */
export async function getProfile(userId: string): Promise<UserProfile> {
	if (!userId) throw new Error("getProfile: userId is required");

	const [row] = await db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			image: users.image,
		})
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	if (!row) throw new Error("getProfile: user not found");
	return row;
}

/**
 * Updates the display name for a user.
 * @param userId - The authenticated user's ID (from session, never from request input)
 * @param name - The new display name (pre-validated by the action layer)
 */
export async function updateDisplayName(
	userId: string,
	name: string,
): Promise<void> {
	if (!userId) throw new Error("updateDisplayName: userId is required");
	if (!name) throw new Error("updateDisplayName: name is required");
	await db
		.update(users)
		.set({ name, updatedAt: new Date() })
		.where(eq(users.id, userId));
}
