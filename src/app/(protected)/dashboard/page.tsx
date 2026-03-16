import Image from "next/image";
import { getCachedSession } from "@/lib/session";
import { getProfile } from "@/features/profile/service";
import { OnboardingGate } from "@/components/features/dashboard/OnboardingGate";

export default async function DashboardPage() {
	const session = await getCachedSession();
	const profile = await getProfile(session!.user.id);

	return (
		<OnboardingGate>
			<main className="min-h-screen bg-background p-8">
				<div className="max-w-180 mx-auto grid gap-8">
					<div className="flex items-center gap-4">
						{profile.image ? (
							<Image
								src={profile.image}
								alt={profile.name ?? "Avatar"}
								width={56}
								height={56}
								className="rounded-full"
							/>
						) : (
							<div className="size-14 rounded-full bg-elevated flex items-center justify-center text-foreground font-display text-xl">
								{(profile.name ?? profile.email)[0].toUpperCase()}
							</div>
						)}
						<div>
							<h1 className="font-display text-[1.5rem] leading-tight">
								{profile.name ?? "Welcome"}
							</h1>
							<p className="font-sans text-secondary text-sm">{profile.email}</p>
						</div>
					</div>

					<div className="rounded-md border border-border bg-surface p-6 grid gap-2">
						<h2 className="font-display text-[1.1rem]">Dashboard</h2>
						<p className="font-sans text-secondary text-sm">
							Your workspace is ready.
						</p>
					</div>
				</div>
			</main>
		</OnboardingGate>
	);
}
