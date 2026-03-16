"use client";

import { useTranslations } from "next-intl";
import { signOut } from "@/lib/auth-client";

/**
 * Client button that calls Better Auth signOut then does a full-page redirect
 * to home, replacing the history entry so the back button can't return to a
 * protected page.
 */
export function SignOutButton() {
	const t = useTranslations("common");

	const handleSignOut = async () => {
		await signOut();
		window.location.replace("/");
	};

	return (
		<button
			type="button"
			onClick={handleSignOut}
			className="bg-transparent border border-border rounded-md px-3 py-[0.35rem] cursor-pointer text-secondary font-body text-[0.8rem] leading-none"
		>
			{t("signOut")}
		</button>
	);
}
