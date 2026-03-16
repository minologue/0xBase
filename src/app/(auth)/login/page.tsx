import { getTranslations } from "next-intl/server";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export default async function LoginPage() {
	const t = await getTranslations("auth.signIn");

	return (
		<main className="grid grid-cols-1 min-[900px]:grid-cols-2 min-h-screen bg-background">
			<section className="hidden min-[900px]:flex p-12 bg-surface text-foreground justify-center items-center flex-col gap-4">
				<h1 className="font-display text-[5rem] leading-none tracking-[0.04em]">
					{t("hero")}
				</h1>
				<p className="font-sans text-secondary">{t("heroSubtitle")}</p>
			</section>
			<section className="flex justify-center items-center p-8">
				<div className="w-full max-w-[420px] grid gap-4">
					<h2 className="font-display text-[2rem]">{t("title")}</h2>
					<p className="text-secondary font-sans">{t("subtitle")}</p>
					<OAuthButtons />
				</div>
			</section>
		</main>
	);
}
