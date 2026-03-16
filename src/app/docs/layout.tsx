import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";

export default async function DocsLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const t = await getTranslations("nav");
	return (
		<>
			<Nav />
			<div
				style={{ maxWidth: "54rem", marginTop: "2rem" }}
				className="mx-auto px-6 pt-10 pb-24 overflow-x-hidden"
			>
				<nav
					aria-label="breadcrumb"
					className="flex items-center gap-2 text-xs font-body text-secondary mb-10"
				>
					<Link
						href="/"
						className="text-secondary no-underline transition-colors hover:text-foreground"
					>
						{t("home")}
					</Link>
					<span aria-hidden="true" className="text-muted select-none">
						/
					</span>
					<span className="text-foreground">{t("docs")}</span>
				</nav>
				<article className="prose">{children}</article>
			</div>
		</>
	);
}
