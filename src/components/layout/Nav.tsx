import { cookies } from "next/headers";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SignOutButton } from "@/components/layout/SignOutButton";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { Locale } from "@/config/project";
import { isValidLocale, project } from "@/config/project";
import { getCachedSession } from "@/lib/session";

/**
 * Sticky top navigation bar. Async Server Component — reads session and
 * locale server-side so the auth state is never flash-dependent on client hydration.
 */
export async function Nav() {
	const t = await getTranslations("nav");
	const session = await getCachedSession();
	const cookieStore = await cookies();
	const raw = cookieStore.get("locale")?.value ?? "";
	const locale: Locale = isValidLocale(raw) ? raw : project.defaultLocale;

	return (
		<header className="sticky top-0 z-100 bg-background border-b border-border px-6 h-14 flex items-center justify-between gap-4">
			{/* Left — logo + primary links */}
			<nav className="flex items-center gap-6">
				<Link
					href="/"
					className="font-display text-xl tracking-[0.04em] text-foreground no-underline leading-none"
				>
					{project.name}
				</Link>
				<Link
					href="/"
					className="text-secondary font-body text-[0.8rem] no-underline"
				>
					{t("home")}
				</Link>
				<Link
					href="/docs"
					className="text-secondary font-body text-[0.8rem] no-underline"
				>
					{t("docs")}
				</Link>
			</nav>

			{/* Right — locale, theme, auth */}
			<div className="flex items-center gap-3">
				<ThemeToggle />
				<LocaleSwitcher current={locale} />

				{session ? (
					<>
						<Link
							href="/profile"
							className="text-secondary font-body text-[0.8rem] no-underline"
						>
							{t("profile")}
						</Link>
						<SignOutButton />
					</>
				) : (
					<Link
						href="/login"
						className="bg-accent text-background font-body text-[0.8rem] no-underline px-[0.85rem] py-[0.35rem] rounded-md leading-none"
					>
						{t("signIn")}
					</Link>
				)}
			</div>
		</header>
	);
}
