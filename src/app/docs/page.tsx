import { cookies } from "next/headers";
import type { Locale } from "@/config/project";
import { isValidLocale, project } from "@/config/project";
import ArDocs from "@/content/docs/ar.mdx";
import EnDocs from "@/content/docs/en.mdx";
import HiDocs from "@/content/docs/hi.mdx";
import UrDocs from "@/content/docs/ur.mdx";

const localeContent: Record<Locale, React.ComponentType> = {
	en: EnDocs,
	ar: ArDocs,
	ur: UrDocs,
	hi: HiDocs,
};

export default async function DocsPage() {
	const cookieStore = await cookies();
	const raw = cookieStore.get("locale")?.value ?? "";
	const locale: Locale = isValidLocale(raw) ? raw : project.defaultLocale;
	const Content = localeContent[locale];
	return <Content />;
}
