"use client";

import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { project } from "@/config/project";

type ProvidersProps = {
	children: React.ReactNode;
	locale: string;
	messages: AbstractIntlMessages;
	timeZone: string | undefined;
};

/**
 * Composes next-themes and next-intl client providers.
 * Receives locale + messages from the server layout so all client
 * components can call useTranslations() and useTheme() anywhere in the tree.
 */
export function Providers({
	children,
	locale,
	messages,
	timeZone,
}: ProvidersProps) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme={project.defaultTheme}
			enableSystem
		>
			<NextIntlClientProvider
				locale={locale}
				messages={messages}
				timeZone={timeZone}
			>
				{children}
			</NextIntlClientProvider>
		</ThemeProvider>
	);
}
