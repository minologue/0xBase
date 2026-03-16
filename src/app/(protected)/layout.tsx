import { AuthGuard } from "@/components/layout/AuthGuard";

export default function ProtectedLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return <AuthGuard>{children}</AuthGuard>;
}
