export const project = {
	name: "0xBase",
	description: "Production-ready Next.js scaffold",
	defaultLocale: "en",
	locales: ["en", "ar", "ur", "hi"],
	defaultTheme: "dark",
	protectedRoutes: ["/profile", "/dashboard", "/onboarding"],
	onboarding: { enabled: true, steps: 5 },
} as const;

export type Locale = (typeof project.locales)[number];

export function isValidLocale(value: string): value is Locale {
	return (project.locales as readonly string[]).includes(value);
}
