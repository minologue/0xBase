"use client";

import { useTranslations } from "next-intl";

type ErrorPageProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	const t = useTranslations("common.error");

	return (
		<main className="min-h-screen flex flex-col justify-center items-center text-center p-8 gap-5 bg-background">
			<h1 className="font-display text-[2rem] tracking-[0.04em] text-foreground">
				{t("heading")}
			</h1>
			<p className="font-body text-[0.85rem] text-secondary max-w-[400px]">
				{t("body")}
			</p>
			{process.env.NODE_ENV === "development" && error.message && (
				<code className="font-body text-xs text-muted max-w-[500px] break-words">
					{error.message}
				</code>
			)}
			<button
				type="button"
				onClick={reset}
				className="bg-accent text-background border-0 px-6 py-[0.65rem] rounded-md font-body text-[0.85rem] cursor-pointer leading-none mt-2"
			>
				{t("retry")}
			</button>
		</main>
	);
}
