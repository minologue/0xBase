"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Hydration-safe light/dark toggle.
 * Renders nothing until mounted to prevent SSR class mismatch with next-themes.
 */
export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const t = useTranslations("common.theme");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const isDark = theme === "dark";

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			aria-label={t("toggle")}
			title={t("toggle")}
			className="bg-transparent border border-border rounded-md px-[0.65rem] py-[0.4rem] cursor-pointer text-foreground font-body text-[0.85rem] leading-none transition-colors duration-150"
		>
			{isDark ? "☀" : "☾"}
		</button>
	);
}
