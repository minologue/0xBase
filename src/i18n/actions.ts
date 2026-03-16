"use server";

import { cookies } from "next/headers";
import { isValidLocale } from "@/config/project";

/**
 * Persists the selected locale in a long-lived cookie.
 * The root layout reads this cookie server-side to inject locale + messages.
 */
export async function setLocale(locale: string): Promise<void> {
	if (!isValidLocale(locale)) return;
	const cookieStore = await cookies();
	cookieStore.set("locale", locale, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
		sameSite: "lax",
		httpOnly: false,
		// Only enforce HTTPS in production; dev runs on plain HTTP
		secure: process.env.NODE_ENV === "production",
	});
}
