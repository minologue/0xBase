"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import type { Locale } from "@/config/project";
import { project } from "@/config/project";
import { setLocale } from "@/i18n/actions";

type LocaleSwitcherProps = {
	current: Locale;
};

/**
 * Renders a dropdown to switch the active locale.
 * Selecting a new locale writes the cookie via Server Action then
 * reloads so the server layout picks up the new locale tree.
 */
export function LocaleSwitcher({ current }: LocaleSwitcherProps) {
	const [isPending, startTransition] = useTransition();
	const t = useTranslations("common.locale");

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const locale = e.target.value as Locale;
		startTransition(async () => {
			await setLocale(locale);
			window.location.reload();
		});
	};

	return (
		<select
			aria-label={t("label")}
			value={current}
			disabled={isPending}
			onChange={handleChange}
			className="border border-border rounded-sm px-2 py-1 font-body text-xs bg-transparent text-secondary cursor-pointer transition-opacity duration-150 disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-ring"
		>
			{(project.locales as readonly Locale[]).map((locale) => (
				<option key={locale} value={locale}>
					{t(locale)}
				</option>
			))}
		</select>
	);
}
