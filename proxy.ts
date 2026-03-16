import { NextRequest, NextResponse } from "next/server";
import { project } from "@/config/project";

const AUTH_ROUTES = ["/login"];

export function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const sessionCookie = req.cookies.get("better-auth.session_token")?.value;

	// Authenticated user hitting an auth route → send to app
	const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
	if (isAuthRoute && sessionCookie) {
		return NextResponse.redirect(new URL("/dashboard", req.url));
	}

	// Unauthenticated user hitting a protected route → send to login
	// Stateless cookie-presence check only; full session validation happens
	// in AuthGuard (Server Component) which handles invalid/expired tokens.
	const isProtected = project.protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);
	if (isProtected && !sessionCookie) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
