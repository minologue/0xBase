import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/session";

type AuthGuardProps = {
	children: React.ReactNode;
};

export async function AuthGuard({ children }: AuthGuardProps) {
	const session = await getCachedSession();

	if (!session) {
		redirect("/login");
	}

	return children;
}
