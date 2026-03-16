import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import type { Locale } from "@/config/project";
import { isValidLocale, project } from "@/config/project";

export default getRequestConfig(async () => {
	const cookieStore = await cookies();
	const raw = cookieStore.get("locale")?.value ?? "";
	const locale: Locale = isValidLocale(raw) ? raw : project.defaultLocale;

	return {
		locale,
		timeZone: "UTC",
		messages: (await import(`../../messages/${locale}.json`)).default as Record<
			string,
			unknown
		>,
	};
});
