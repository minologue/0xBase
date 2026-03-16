import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProfileForm } from "@/components/features/profile/ProfileForm";
import { Nav } from "@/components/layout/Nav";
import { getProfile } from "@/features/profile/service";
import { getCachedSession } from "@/lib/session";

export default async function ProfilePage() {
	// AuthGuard in the (protected) layout redirects unauthenticated users, but
	// layout and page render concurrently in the App Router — so the page must
	// also handle a null session gracefully rather than throwing.
	const session = await getCachedSession();
	if (!session) redirect("/login");

	const profile = await getProfile(session.user.id);
	const t = await getTranslations("profile");

	return (
		<>
			<Nav />
			<main className="min-h-[calc(100vh-3.5rem)] px-6 py-12 flex flex-col items-center">
				<div className="w-full max-w-[480px]">
					<h1 className="font-display text-[2.5rem] tracking-[0.04em] mb-10 text-foreground">
						{t("title")}
					</h1>
					<ProfileForm
						name={profile.name}
						email={profile.email}
						image={profile.image}
					/>
				</div>
			</main>
		</>
	);
}
