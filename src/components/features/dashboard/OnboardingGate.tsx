import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/session";

type OnboardingGateProps = {
	children: React.ReactNode;
};

/**
 * Server Component that checks onboardingCompleted from the session.
 * Uses getCachedSession() — React.cache deduplicates the DB call since
 * AuthGuard already called it in the same render pass. Zero extra queries.
 * Redirects to /onboarding if the user hasn't completed it yet.
 */
export async function OnboardingGate({ children }: OnboardingGateProps) {
	const session = await getCachedSession();

	if (!session?.user.onboardingCompleted) {
		redirect("/onboarding");
	}

	return <>{children}</>;
}
