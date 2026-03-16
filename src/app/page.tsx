import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { getCachedSession } from "@/lib/session";

const ANIMATION_DELAYS = ["d1", "d2", "d3", "d4", "d4", "d4"] as const;

export default async function HomePage() {
	const t = await getTranslations("landing");
	const session = await getCachedSession();
	const ctaHref = session ? "/profile" : "/login";

	const features = [
		{
			key: "auth",
			title: t("features.auth.title"),
			description: t("features.auth.description"),
		},
		{
			key: "db",
			title: t("features.db.title"),
			description: t("features.db.description"),
		},
		{
			key: "i18n",
			title: t("features.i18n.title"),
			description: t("features.i18n.description"),
		},
		{
			key: "theme",
			title: t("features.theme.title"),
			description: t("features.theme.description"),
		},
		{
			key: "types",
			title: t("features.types.title"),
			description: t("features.types.description"),
		},
		{
			key: "dx",
			title: t("features.dx.title"),
			description: t("features.dx.description"),
		},
	];

	return (
		<>
			<Nav />
			<main>
				{/* ── Hero ── */}
				<section className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center text-center px-6 py-16 gap-8">
					<h1 className="anim d1 font-display text-[clamp(3.5rem,12vw,9rem)] leading-none tracking-[0.04em] text-foreground">
						{t("hero.headline")}
					</h1>
					<p className="anim d2 font-body text-base text-secondary max-w-[480px] leading-[1.6]">
						{t("hero.subheadline")}
					</p>
					<div className="anim d3 flex gap-3 flex-wrap justify-center">
						<Link
							href={ctaHref}
							className="bg-accent text-background px-7 py-3 rounded-md font-body text-[0.9rem] no-underline leading-none"
						>
							{t("hero.cta")}
						</Link>
						<Link
							href="/docs"
							className="bg-transparent text-foreground px-7 py-3 rounded-md border border-border font-body text-[0.9rem] no-underline leading-none"
						>
							{t("hero.ctaSecondary")}
						</Link>
					</div>
				</section>

				{/* ── Features ── */}
				<section className="px-6 py-20 bg-surface">
					<div className="max-w-[960px] mx-auto">
						<h2 className="anim d4 font-display text-[2.5rem] tracking-[0.04em] text-center mb-12 text-foreground">
							{t("features.title")}
						</h2>
						<div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
							{features.map((feature, i) => (
								<div
									key={feature.key}
									className={`anim ${ANIMATION_DELAYS[i]} bg-background border border-border rounded-lg p-6 grid gap-2`}
								>
									<h3 className="font-display text-[1.2rem] tracking-[0.04em] text-foreground">
										{feature.title}
									</h3>
									<p className="font-body text-[0.8rem] text-secondary leading-[1.6]">
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
