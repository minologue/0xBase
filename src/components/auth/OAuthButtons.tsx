"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";

type Provider = "google" | "github";

function Spinner() {
	return (
		<span
			aria-hidden="true"
			className="inline-block size-4 rounded-full border-2 border-ring border-t-accent animate-[spin_0.8s_linear_infinite]"
		/>
	);
}

export function OAuthButtons() {
	const t = useTranslations("auth.signIn");
	const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);

	const handleSignIn = async (provider: Provider) => {
		setLoadingProvider(provider);
		await signIn.social({ provider, callbackURL: "/dashboard" });
	};

	const btnClass = `py-3 px-4 rounded-md border border-border bg-surface text-foreground font-sans ${loadingProvider ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`;

	return (
		<div className="grid gap-3">
			<button
				type="button"
				onClick={() => handleSignIn("google")}
				disabled={loadingProvider !== null}
				className={btnClass}
			>
				{loadingProvider === "google" ? <Spinner /> : t("google")}
			</button>
			<button
				type="button"
				onClick={() => handleSignIn("github")}
				disabled={loadingProvider !== null}
				className={btnClass}
			>
				{loadingProvider === "github" ? <Spinner /> : t("github")}
			</button>
		</div>
	);
}
