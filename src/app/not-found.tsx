import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";

export default async function NotFound() {
	const t = await getTranslations("common.notFound");

	return (
		<>
			<Nav />
			<main className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center text-center p-8 gap-5">
				<p className="font-display text-[6rem] leading-none text-ring">404</p>
				<h1 className="font-display text-[2rem] tracking-[0.04em] text-foreground">
					{t("heading")}
				</h1>
				<p className="font-body text-[0.9rem] text-secondary">{t("body")}</p>
				<Link
					href="/"
					className="bg-accent text-background px-6 py-[0.65rem] rounded-md font-body text-[0.85rem] no-underline leading-none mt-2"
				>
					{t("cta")}
				</Link>
			</main>
		</>
	);
}
