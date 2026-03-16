import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import {
	Barlow_Condensed,
	IBM_Plex_Mono,
	IBM_Plex_Sans,
} from "next/font/google";
import { cookies } from "next/headers";
import { getMessages, getTimeZone } from "next-intl/server";
import { Providers } from "@/components/providers/Providers";
import type { Locale } from "@/config/project";
import { isValidLocale, project } from "@/config/project";
import "@/styles/globals.css";

const barlowCondensed = Barlow_Condensed({
	weight: ["400", "600", "700"],
	subsets: ["latin"],
	variable: "--font-display",
});

const ibmPlexMono = IBM_Plex_Mono({
	weight: ["300", "400", "500"],
	subsets: ["latin"],
	variable: "--font-body",
});

const ibmPlexSans = IBM_Plex_Sans({
	weight: ["400", "500", "600"],
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "0xBase",
	description: "Production-ready Next.js scaffold",
	icons: {
		icon: "/0xbase-favicon.svg",
	},
};

const RTL_LOCALES: Locale[] = ["ar", "ur"];

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const cookieStore = await cookies();
	const raw = cookieStore.get("locale")?.value ?? "";
	const locale: Locale = isValidLocale(raw) ? raw : project.defaultLocale;
	const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
	const messages = await getMessages();
	const timeZone = await getTimeZone();

	return (
		<html lang={locale} dir={dir} suppressHydrationWarning>
			<body
				className={`${barlowCondensed.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable}`}
			>
				<Providers locale={locale} messages={messages} timeZone={timeZone}>
					{children}
				</Providers>
				<Analytics />
			</body>
		</html>
	);
}
